<template>
  <div v-loading.fullscreen="pageLoading" class="flex justify-center items-center mt-5">
    <el-card class="w-full xl:max-w-[900px] 2xl:max-w-full">
      <div class="flex flex-col items-center justify-between">
        <ModalUpsertRecipe
          v-model:recipe="editableRecipe"
          v-model:visible="isEditDialogVisible"
          :isCreating="isCreating"
          :title="isCreating ? 'Add New Recipe' : 'Edit Recipe'"
          @close="isEditDialogVisible = false"
          @save="saveRecipe"
          @delete="deleteRecipe"
        />
        <div class="flex items-center justify-end gap-5 w-full mb-10">
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
            :size="$elComponentSize.large"
            class="max-w-[200px]"
            placeholder="Select recipe type"
            @change="handleFilterChange"
          >
            <el-option
              v-for="type in recipeTypes"
              :key="type"
              class="capitalize"
              :label="normalizeStringLabel(type)"
              :value="type"
            />
          </el-select>
          <el-button
            :type="$elComponentType.primary"
            :size="$elComponentSize.large"
            @click="openCreateDialog"
          >
            Add New Recipe
          </el-button>
        </div>

        <RecipesAndProductsRecipesTable
          :table-data="sortedRecipes"
          :table-loading="tableLoading"
        >
          <template #actions="{ row }">
            <div class="flex min-w-[300px]">
              <el-button
                :size="$elComponentSize.small"
                @click="openEditDialog(row)"
              >
                Edit
              </el-button>
              <el-button
                :type="$elComponentType.danger"
                :size="$elComponentSize.small"
                @click="deleteRecipe(row.id)"
              >
                Delete
              </el-button>
            </div>
          </template>
        </RecipesAndProductsRecipesTable>

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
import orderBy from 'lodash/orderBy'
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'

import { ERecipeType } from '@/types/products-and-recipes.enums'
import { normalizeStringLabel, showNotification } from '@/helpers'
import IconSearchFood from '~icons/icon/search-food'

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

const sortOrder = ref<'asc' | 'desc'>(null)

function sortRecipesByCalories (recipes: IRecipe[], sortOrder: 'asc' | 'desc' = 'asc') {
  const recipesWithCalories = recipes.map(recipe => ({
    ...recipe,
    totalCalories: calculateTotalCalories(recipe)
  }))

  return orderBy(recipesWithCalories, ['totalCalories'], [sortOrder])
}

const sortedRecipes = computed(() => {
  return sortRecipesByCalories(recipes.value, sortOrder.value || 'asc')
})

function calculateTotalCalories (recipe: IRecipe): number {
  return nutritionService.calculateTotalCalories(recipe)
}

async function getPaginatedRecipes (page?: number) {
  if (page && recipePagesCache.value[page]) {
    recipes.value = recipePagesCache.value[page]
    return
  }

  try {
    tableLoading.value = true

    const { data, count } = await productsAndRecipesService.getPaginatedRecipes({
      limit: pageSize.value,
      offset: (currentPage.value - 1) * pageSize.value,
      typeFilter: selectedType.value
    })

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
    const { data, count } = await productsAndRecipesService.searchRecipes({
      searchQuery: searchQuery.value,
      typeFilter: selectedType.value,
      limit: pageSize.value,
      offset
    })

    recipes.value = data || []
    totalRecipes.value = count || 0
    currentPage.value = page

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
