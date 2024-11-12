<template>
  <div :loading="tableLoading" class="flex h-full justify-center items-center">
    <el-card class="card--no-shadow w-full overflow-x-scroll h-full">
      <div class="flex flex-col items-center w-full h-full">
        <ModalUpsertRecipe
          v-model:recipe="editableRecipe"
          v-model:visible="isEditDialogVisible"
          v-model:modal-button-loading="modalButtonLoading"
          :isCreating="isCreating"
          :title="isCreating ? 'Add New Recipe' : 'Edit Recipe'"
          @close="isEditDialogVisible = false"
          @save="saveRecipe"
          @delete="deleteRecipe"
        />

        <RecipesAndProductsManageBar
          v-model:search-query="searchQuery"
          v-model:selected-type="selectedType"
          :option-types="recipeTypes"
          :is-search-and-input-disabled="isSearchAndInputDisabled"
          button-text="Add New Recipe"
          search-placeholder="Search recipes..."
          select-placeholder="Select recipe type"
          @add-new-product="openCreateDialog"
          @filter-change="handleFilterChange"
          @search-input="handleSearchInput"
        />

        <div class="w-full overflow-x-scroll">
          <RecipesAndProductsRecipesTable
            :table-data="sortedRecipes"
            :table-loading="tableLoading"
          >
            >
            <template #actions="{ row }">
              <div class="flex items-center justify-center">
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
        </div>

        <div class="flex justify-center items-center mt-2 w-full">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="totalRecipes"
            layout="prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import orderBy from 'lodash/orderBy'
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'

import { ERecipeType } from '@/types/products-and-recipes.enums'
import { showNotification } from '@/helpers'

const authStore = useAuthStore()

const currentPage = ref(1)
const pageSize = ref(10)

const totalRecipes = ref(0)
const recipes = ref<IRecipe[]>([])

const recipeTypes = ref<TRecipesType[]>(Object.values(ERecipeType))
const selectedType = ref<string[]>(null)

const searchQuery = ref('')

const recipePagesCache = ref<{ [key: number]: IRecipe[] }>({})

const tableLoading = ref(false)

const sortOrder = ref<'asc' | 'desc'>(null)

const isSearchAndInputDisabled = ref(false)

function sortRecipesByCalories (recipes: IRecipe[], sortOrder: 'asc' | 'desc' = 'asc') {
  const recipesWithCalories = recipes.map(recipe => ({
    ...recipe
  }))

  return orderBy(recipesWithCalories, recipe => calculateTotalCalories(recipe), [sortOrder])
}

const sortedRecipes = computed(() => {
  return sortRecipesByCalories(recipes.value, sortOrder.value || 'asc')
})

function calculateTotalCalories (recipe: IRecipe): number {
  return nutritionService.calculateTotalRecipeCalories(recipe)
}

async function getPaginatedRecipes (page?: number, initialLoad = false) {
  if (page && recipePagesCache.value[page]) {
    recipes.value = recipePagesCache.value[page]
    return
  }

  try {
    tableLoading.value = true

    const { data, count } = await productsAndRecipesService.getRecipes({
      limit: pageSize.value,
      offset: (currentPage.value - 1) * pageSize.value,
      typeFilter: selectedType.value,
      userOnly: true,
      isAdmin: authStore.isUserAdmin
    })

    recipes.value = data || []
    totalRecipes.value = count || 0
    recipePagesCache.value[page] = data

    if (initialLoad) {
      isSearchAndInputDisabled.value = totalRecipes.value === 0
    }
  } catch (error) {
    showNotification()
  } finally {
    tableLoading.value = false
  }
}

async function searchRecipes (page: number = 1) {
  try {
    tableLoading.value = true

    const offset = (page - 1) * pageSize.value
    const { data, count } = await productsAndRecipesService.getRecipes({
      searchQuery: searchQuery.value,
      typeFilter: selectedType.value,
      limit: pageSize.value,
      offset,
      userOnly: true,
      isAdmin: authStore.isUserAdmin
    })

    recipes.value = data || []
    totalRecipes.value = count || 0
    currentPage.value = page
  } catch (error) {
    showNotification()
  } finally {
    tableLoading.value = false
  }
}

const debouncedSearchRecipes = debounce(searchRecipes, 500)

const isEditDialogVisible = ref(false)
const editableRecipe = ref<IRecipe>(null)

function openEditDialog (row: IRecipe) {
  editableRecipe.value = cloneDeep(row)
  isCreating.value = false

  isEditDialogVisible.value = true
}

const modalButtonLoading = ref(false)

async function saveRecipe () {
  modalButtonLoading.value = true

  if (!editableRecipe.value) return

  try {
    if (isCreating.value) {
      const createdRecipe = await productsAndRecipesService.createRecipe({
        recipe: editableRecipe.value,
        isAdmin: authStore.isUserAdmin
      })

      recipes.value.push(createdRecipe)
      getPaginatedRecipes()

      showNotification('Recipe created successfully', 'Success', 'success')
    } else {
      await productsAndRecipesService.updateRecipe({
        recipeId: editableRecipe.value.id,
        updatedRecipeData: editableRecipe.value,
        isAdmin: authStore.isUserAdmin
      })

      const index = recipes.value.findIndex(recipe => recipe.id === editableRecipe.value.id)
      if (index !== -1) {
        recipes.value.splice(index, 1, { ...editableRecipe.value })
      }
      showNotification('Recipe updated successfully', 'Success', 'success')
    }
  } catch (error) {
    showNotification()
  } finally {
    isSearchAndInputDisabled.value = recipes.value.length === 0
    isEditDialogVisible.value = false
    isCreating.value = false
    modalButtonLoading.value = false
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
    recipePagesCache.value = {}

    tableLoading.value = true
    await productsAndRecipesService.deleteRecipe({ recipeId, isAdmin: authStore.isUserAdmin })

    getPaginatedRecipes()
    recipes.value = recipes.value.filter(recipe => recipe.id !== recipeId)

    showNotification('Recipe deleted successfully', 'Success', 'success')

    isEditDialogVisible.value = false
  } catch (error) {
    showNotification()
  } finally {
    isSearchAndInputDisabled.value = recipes.value.length === 0
    tableLoading.value = false
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

onMounted(async () => {
  await getPaginatedRecipes(currentPage.value, true)
})
</script>
