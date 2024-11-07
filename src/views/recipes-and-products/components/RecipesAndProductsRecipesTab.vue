<template>
  <div v-loading.fullscreen="pageLoading" class="flex justify-center items-center">
    <el-card class="max-w-[600px] lg:max-w-[700px] xl:max-w-[900px] 2xl:max-w-full">
      <div class="flex flex-col items-center justify-between">
        <ModalUpsertRecipe
          v-model:recipe="editableRecipe"
          v-model:visible="isEditDialogVisible"
          :title="'Edit recipe'"
          @close="isEditDialogVisible = false"
          @save="saveRecipe"
          @delete="deleteRecipe"
        />
        <div class="flex items-center gap-5 w-full mb-10">
          <el-input
            v-model="searchQuery"
            :prefix-icon="IconSearchFood"
            :size="$elComponentSize.large"
            class="w-full"
            placeholder="Search recipes..."
            clearable
            @input="handleSearchInput"
          />

          <el-select
            v-model="selectedType"
            clearable
            class="max-w-[200px]"
            placeholder="Select recipe type"
            @change="handleFilterChange"
          >
            <el-option
              v-for="type in recipeTypes"
              :key="type"
              class="capitalize"
              :label="type"
              :value="type"
            />
          </el-select>
          <el-button :type="$elComponentType.primary" @click="openCreateDialog">
            Add New Recipe
          </el-button>
        </div>

        <div class="overflow-x-auto w-full">
          <div class="min-w-[1200px]">
            <AppTable
              v-loading="tableLoading"
              :headers="recipeHeaders"
              :table-data="sortedRecipes"
              @sort-change="handleSortChange"
            >
              <template #image="{ row }">
                <div class="w-[100px] h-[100px] rounded-xl overflow-hidden">
                  <SkeletonImage :img-src="row.image">
                    <template #placeholder>
                      <IconErrorRecipe class="fill-gray-dark" />
                    </template>
                  </SkeletonImage>
                </div>
              </template>

              <template #name="{ row }">
                <span class="">
                  <b>{{ row.name }}</b>
                </span>
              </template>

              <template #nutrition="{ row }">
                <div>
                  <p><b>Calories:</b> {{ calculateTotalCalories(row) }} kcal</p>
                  <p><b>Carbs:</b> {{ calculateTotalCarbs(row) }}g</p>
                  <p><b>Proteins:</b> {{ calculateTotalProteins(row) }}g</p>
                  <p><b>Fats:</b> {{ calculateTotalFats(row) }}g</p>
                </div>
              </template>

              <template #ingredients="{ row }">
                <el-popover
                  placement="top"
                  width="auto"
                  trigger="click"
                >
                  <ul class="flex gap-5 w-auto">
                    <li v-for="(ingredient, index) in row.ingredients" :key="index">
                      <b>{{ ingredient.name }}</b>: <br>
                      {{ ingredient.nutritionDetails.carbs }}g carbs, <br>
                      {{ ingredient.nutritionDetails.proteins }}g proteins, <br>
                      {{ ingredient.nutritionDetails.fats }}g fats, <br>
                      {{ ingredient.nutritionDetails.calories }} kcal <br>
                    </li>
                  </ul>
                  <template #reference>
                    <el-button size="small">show</el-button>
                  </template>
                </el-popover>
              </template>

              <template #isVegan="{ row }">
                <span v-if="row.isVegan" class="fill-success">
                  <IconVegan class="w-[30px] h-[30px]" />
                </span>
                <span v-else />
              </template>

              <template #edit="{ row }">
                <el-button
                  :size="$elComponentSize.small"
                  @click="openEditDialog(row)"
                >
                  Edit
                </el-button>
              </template>
              <template #delete="{ row }">
                <el-button
                  :type="$elComponentType.danger"
                  :size="$elComponentSize.small"
                  @click="deleteRecipe(row.id)"
                >
                  Delete
                </el-button>
              </template>
            </AppTable>
          </div>
        </div>

        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="totalRecipes"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'

import { ERecipeType } from '@/types/products-and-recipes.enums'
import { normalizeStringLabel, showNotification, sortArrayBySortFieldAndOrder } from '@/helpers'
import IconSearchFood from '~icons/icon/search-food'
import IconErrorRecipe from '~icons/icon/error-recipe'

const activeTab = defineModel<string>('active-tab')

const currentPage = ref(1)
const pageSize = ref(10)

const totalRecipes = ref(0)
const recipes = ref<IRecipe[]>([])

const recipeTypes = ref<TRecipesType[]>(Object.values(ERecipeType))
const selectedType = ref<string>(null)

const searchQuery = ref('')

const recipePagesCache = ref<{ [key: number]: IRecipe[] }>({})

const pageLoading = ref(false)
const tableLoading = ref(false)

const recipeHeaders: TTableHeadings<IRecipe> = [
  {
    label: '',
    value: 'image',
    fixed: 'left'
  },
  {
    label: 'Recipe Name',
    value: 'name'
  },
  {
    label: 'Description',
    value: 'description',
    width: 150
  },
  {
    label: 'Nutrition',
    value: 'nutrition',
    sort: true
  },
  {
    label: 'Weight (g)',
    value: 'portionWeight',
    sort: true,
    align: 'center',
    width: 130
  },
  {
    label: 'Type',
    value: 'type',
    align: 'center',
    formatter: (row) => normalizeStringLabel(row.type)
  },
  {
    label: 'Vegan',
    value: 'isVegan',
    sort: true,
    align: 'center'
  },
  {
    label: 'Ingredients',
    value: 'ingredients',
    align: 'center',
    formatter: (row) => Math.round(nutritionService.calcTotalRecipeCalories(row))
  },
  {
    label: '',
    value: 'edit',
    align: 'center'
  },
  {
    label: '',
    value: 'delete',
    align: 'center'
  }

]

const sortField = ref<string>(null)
const sortOrder = ref<'asc' | 'desc'>(null)

function handleSortChange () {
  return sortArrayBySortFieldAndOrder(recipes.value, 'nutritionDetails.calories', sortOrder.value)
}

const sortedRecipes = computed(() => {
  if (!sortField.value || !sortOrder.value) {
    return recipes.value
  }

  return handleSortChange()
})

function calculateTotalCarbs (recipe: IRecipe): number {
  return recipe.ingredients.reduce((sum, ingredient) => sum + Math.round(ingredient.nutritionDetails.carbs), 0)
}

function calculateTotalProteins (recipe: IRecipe): number {
  return recipe.ingredients.reduce((sum, ingredient) => sum + Math.round(ingredient.nutritionDetails.proteins), 0)
}

function calculateTotalFats (recipe: IRecipe): number {
  return recipe.ingredients.reduce((sum, ingredient) => sum + Math.round(ingredient.nutritionDetails.fats), 0)
}

function calculateTotalCalories (recipe: IRecipe): number {
  return recipe.ingredients.reduce((sum, ingredient) => sum + Math.round(ingredient.nutritionDetails.calories), 0)
}

async function getPaginatedRecipes (page?: number) {
  if (page && recipePagesCache.value[page]) {
    recipes.value = recipePagesCache.value[page]

    return
  }

  try {
    tableLoading.value = true

    const { data, count } = await productsAndRecipesService.getPaginatedRecipes(
      pageSize.value,
      (currentPage.value - 1) * pageSize.value,
      selectedType.value
    )

    recipes.value = data || []
    totalRecipes.value = count || 0
    recipePagesCache.value[page] = data

    tableLoading.value = false
  } catch (error) {
    showNotification()
  }
}

async function searchRecipes (page: number = 1) {
  try {
    tableLoading.value = true

    const offset = (page - 1) * pageSize.value
    const { data, count } = await productsAndRecipesService.searchRecipes(
      searchQuery.value,
      selectedType.value,
      pageSize.value, offset
    )

    recipes.value = data || []
    totalRecipes.value = count || 0
    currentPage.value = 1

    tableLoading.value = false
  } catch (error) {
    showNotification()
  }
}

const debouncedSearchRecipes = debounce(searchRecipes, 500)

const isEditDialogVisible = ref(false)
const editableRecipe = ref<IRecipe>(null)

function openEditDialog (row: IRecipe) {
  editableRecipe.value = cloneDeep(row)

  isEditDialogVisible.value = true
}

async function saveRecipe () {
  if (!editableRecipe.value) return

  try {
    if (isCreating.value) {
      const createdRecipe = await productsAndRecipesService.createRecipe(editableRecipe.value)

      recipes.value.push(createdRecipe)
      showNotification('Recipe created successfully', 'Success', 'success')
    } else {
      await productsAndRecipesService.updateRecipe(editableRecipe.value.id, editableRecipe.value)

      const index = recipes.value.findIndex(recipe => recipe.id === editableRecipe.value.id)
      if (index !== -1) {
        recipes.value[index] = { ...editableRecipe.value }
      }
      showNotification('Recipe updated successfully', 'Success', 'success')
    }

    isEditDialogVisible.value = false
    isCreating.value = false
  } catch (error) {
    showNotification(error.message, 'error')
  }
}

const isCreating = ref(false)

function openCreateDialog () {
  const authStore = useAuthStore()
  editableRecipe.value = {
    name: '',
    description: '',
    image: '',
    portionWeight: 0,
    type: recipeTypes.value[0],
    isVegan: false,
    ingredients: [],
    ...(authStore.isUserAdmin ? {} : { userId: authStore.user.id })
  }

  isCreating.value = true
  isEditDialogVisible.value = true
}

async function deleteRecipe (recipeId: string) {
  try {
    await productsAndRecipesService.deleteRecipe(recipeId)

    recipes.value = recipes.value.filter(recipe => recipe.id !== recipeId)

    showNotification('Have a nice day', 'Recipe deleted successfully', 'success')
    isEditDialogVisible.value = false
  } catch (error) {
    showNotification(`Error deleting recipe: ${error.message}`, 'error')
  }
}

function handleSearchInput () {
  debouncedSearchRecipes()
}

function handleFilterChange () {
  currentPage.value = 1
  getPaginatedRecipes()
}

function handlePageChange (page: number) {
  currentPage.value = page
  getPaginatedRecipes(currentPage.value)
}

watch(activeTab, (newTab) => {
  if (newTab === 'recipes' && !recipes.value.length) {
    getPaginatedRecipes()
  }
})
</script>
