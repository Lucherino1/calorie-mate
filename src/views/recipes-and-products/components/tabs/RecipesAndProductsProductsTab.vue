<template>
  <div :loading="tableLoading" class="flex w-full justify-center items-center">
    <el-card class="card--no-shadow w-full overflow-x-scroll h-full">
      <div class="flex flex-col items-center">
        <ModalUpsertProduct
          v-model:product="editableProduct"
          v-model:visible="isEditDialogVisible"
          :modal-button-loading="modalButtonLoading"
          :title="isCreating ? 'Add New Product' : 'Edit Product'"
          :isCreating="isCreating"
          @close="isEditDialogVisible = false"
          @save="saveProduct"
          @delete="deleteProduct"
        />

        <RecipesAndProductsManageBar
          v-model:search-query="searchQuery"
          v-model:selected-type="selectedType"
          :option-types="productTypes"
          :is-search-and-input-disabled="isSearchAndInputDisabled"
          button-text="Add New Product"
          search-placeholder="Search products..."
          select-placeholder="Select product type"
          @add-new-product="openCreateDialog"
          @filter-change="handleFilterChange"
          @search-input="handleSearchInput"
        />

        <RecipesAndProductsProductsTable
          table-height="550"
          :table-data="sortedProducts"
          :table-loading="tableLoading"
          :handle-sort-change="handleSortChange"
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
                @click="deleteProduct(row.id)"
              >
                Delete
              </el-button>
            </div>
          </template>
        </RecipesAndProductsProductsTable>

        <div class="flex justify-center items-center mt-5 w-full">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="totalProducts"
            layout="prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'

import { EProductType } from '@/types/products-and-recipes.enums'
import { showNotification, sortArrayBySortFieldAndOrder } from '@/helpers'

const authStore = useAuthStore()

const currentPage = ref(1)
const pageSize = ref(15)

const totalProducts = ref(0)
const products = ref<IProduct[]>([])

const productTypes = ref<TProductType[]>(Object.values(EProductType))
const selectedType = ref<TProductType[]>(null)

const searchQuery = ref('')

const productPagesCache = ref<{ [key: number]: IProduct[] }>({})

const tableLoading = ref(false)
const modalButtonLoading = ref(false)

const sortField = ref<string>(null)
const sortOrder = ref<'asc' | 'desc'>(null)

const isSearchAndInputDisabled = ref(false)

function handleSortChange () {
  return sortArrayBySortFieldAndOrder(products.value, sortField.value, sortOrder.value)
}

const sortedProducts = computed(() => {
  if (!sortField.value || !sortOrder.value) {
    return products.value
  }

  return handleSortChange()
})

async function getPaginatedProducts (page?: number, initialLoad = false) {
  if (page && productPagesCache.value[page]) {
    products.value = productPagesCache.value[page]
    return
  }

  try {
    tableLoading.value = true

    const { data, count } = await productsAndRecipesService.getProducts({
      limit: pageSize.value,
      offset: (currentPage.value - 1) * pageSize.value,
      typeFilter: selectedType.value,
      userOnly: true,
      isAdmin: authStore.isUserAdmin
    })

    products.value = data || []
    totalProducts.value = count || 0
    productPagesCache.value[page] = data

    if (initialLoad) {
      isSearchAndInputDisabled.value = totalProducts.value === 0
    }
  } catch (error) {
    showNotification()
  } finally {
    tableLoading.value = false
  }
}

async function searchProducts (page: number = 1) {
  try {
    tableLoading.value = true

    const offset = (page - 1) * pageSize.value
    const { data, count } = await productsAndRecipesService.getProducts({
      searchQuery: searchQuery.value,
      typeFilter: selectedType.value,
      limit: pageSize.value,
      offset,
      userOnly: true,
      isAdmin: authStore.isUserAdmin
    })

    products.value = data || []
    totalProducts.value = count || 0
    currentPage.value = 1
  } catch (error) {
    showNotification()
  } finally {
    tableLoading.value = false
  }
}

const debouncedSearchProducts = debounce(searchProducts, 500)

const isEditDialogVisible = ref(false)
const isCreating = ref(false)
const editableProduct = ref<IProduct | null>(null)

function openEditDialog (row: IProduct) {
  editableProduct.value = cloneDeep(row)
  isCreating.value = false
  isEditDialogVisible.value = true
}

function openCreateDialog () {
  const authStore = useAuthStore()

  editableProduct.value = {
    name: '',
    type: productTypes.value[0],
    isVegan: false,
    nutritionDetails: {
      calories: 0,
      carbs: 0,
      proteins: 0,
      fats: 0
    },
    ...(authStore.isUserAdmin ? {} : { userId: authStore.user.id })
  }

  isCreating.value = true
  isEditDialogVisible.value = true
}

async function saveProduct () {
  if (!editableProduct.value) return
  modalButtonLoading.value = true
  try {
    if (isCreating.value) {
      const createdProduct = await productsAndRecipesService.createProduct({
        product: editableProduct.value,
        isAdmin: authStore.isUserAdmin
      })

      products.value.push(createdProduct)
      showNotification('Product created successfully', 'Success', 'success')
    } else {
      await productsAndRecipesService.updateProduct({
        productId: editableProduct.value.id,
        updatedProductData: editableProduct.value,
        isAdmin: authStore.isUserAdmin
      })

      const index = products.value.findIndex(product => product.id === editableProduct.value.id)
      if (index !== -1) {
        products.value[index] = { ...editableProduct.value }
      }
      showNotification('Product updated successfully', 'Success', 'success')
    }

    isEditDialogVisible.value = false
  } catch (error) {
    showNotification()
  } finally {
    getPaginatedProducts()
    isSearchAndInputDisabled.value = products.value.length === 0
    isEditDialogVisible.value = false
    modalButtonLoading.value = false
  }
}

async function deleteProduct (productId: string) {
  try {
    productPagesCache.value = {}
    tableLoading.value = true

    await productsAndRecipesService.deleteProduct({ productId, isAdmin: authStore.isUserAdmin })

    getPaginatedProducts()
    products.value = products.value.filter(product => product.id !== productId)

    showNotification('Product deleted successfully', 'Success', 'success')
  } catch (error) {
    showNotification()
  } finally {
    isSearchAndInputDisabled.value = products.value.length === 0
    isEditDialogVisible.value = false
    tableLoading.value = false
  }
}

function handleSearchInput () {
  debouncedSearchProducts()
}

function handleFilterChange () {
  currentPage.value = 1
  getPaginatedProducts()
}

function handlePageChange (page: number) {
  currentPage.value = page
  getPaginatedProducts(currentPage.value)
}

onMounted(async () => {
  await getPaginatedProducts(currentPage.value, true)
})
</script>
