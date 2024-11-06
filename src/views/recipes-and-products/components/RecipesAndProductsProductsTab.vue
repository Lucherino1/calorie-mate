<template>
  <div v-loading.fullscreen="pageLoading" class="flex justify-center items-center">
    <el-card class="w-full xl:max-w-[800px] 2xl:max-w-full">
      <div class="flex flex-col items-center justify-between">
        <ModalUpsertProduct
          v-model:product="editableProduct"
          v-model:visible="isEditDialogVisible"
          :title="isCreating ? 'Add New Product' : 'Edit Product'"
          :isCreating="isCreating"
          @close="isEditDialogVisible = false"
          @save="saveProduct"
          @delete="deleteProduct"
        />
        <div class="flex items-center gap-5 w-full mb-10">
          <el-input
            v-model="searchQuery"
            :prefix-icon="IconSearchFood"
            :size="$elComponentSize.large"
            class="w-full"
            placeholder="Search products..."
            clearable
            @input="handleSearchInput"
          />
          <el-select
            v-model="selectedType"
            clearable
            class="max-w-[200px]"
            placeholder="Select product type"
            @change="handleFilterChange"
          >
            <el-option
              v-for="type in productTypes"
              :key="type"
              class="capitalize"
              :label="type"
              :value="type"
            />
          </el-select>
          <el-button :type="$elComponentType.primary" @click="openCreateDialog">
            Add New Product
          </el-button>
        </div>

        <div class="overflow-x-auto w-full">
          <AppTable
            v-loading="tableLoading"
            :headers="productHeaders"
            :table-data="sortedProducts"
            @sort-change="handleSortChange"
          >
            <template #name="{ row }">
              <span class="">
                <b>{{ row.name }}</b>
              </span>
            </template>

            <template #isVegan="{ row }">
              <span v-if="row.isVegan" class="fill-success">
                <IconVegan />
              </span>
              <span v-else />
            </template>

            <template #type="{ row }">
              <span class="capitalize">{{ row.type }}</span>
            </template>

            <template #actions="{ row }">
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
            </template>
          </AppTable>
        </div>

        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="totalProducts"
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

import { EProductType } from '@/types/products-and-recipes.enums'
import { showNotification, sortArrayBySortFieldAndOrder } from '@/helpers'
import IconVegan from '~icons/icon/vegan'
import IconSearchFood from '~icons/icon/search-food'

const currentPage = ref(1)
const pageSize = ref(15)

const totalProducts = ref(0)
const products = ref<IProduct[]>([])

const productTypes = ref<TProductType[]>(Object.values(EProductType))
const selectedType = ref<string>(null)

const searchQuery = ref('')

const productPagesCache = ref<{ [key: number]: IProduct[] }>({})

const pageLoading = ref(false)
const tableLoading = ref(false)

const productHeaders: TTableHeadings<IProduct> = [
  {
    label: 'Product Name',
    value: 'name'
  },
  {
    label: 'Calories (kcal)',
    value: 'nutritionDetails.calories',
    sort: true,
    align: 'center',
    formatter: (row) => Math.round(row.nutritionDetails.calories)
  },
  {
    label: 'Carbs (g)',
    value: 'nutritionDetails.carbs',
    sort: true,
    align: 'center',
    formatter: (row) => Math.round(row.nutritionDetails.carbs)
  },
  {
    label: 'Proteins (g)',
    value: 'nutritionDetails.proteins',
    sort: true,
    align: 'center',
    formatter: (row) => Math.round(row.nutritionDetails.proteins)
  },
  {
    label: 'Fats (g)',
    value: 'nutritionDetails.fats',
    sort: true,
    align: 'center',
    formatter: (row) => Math.round(row.nutritionDetails.fats)
  },
  {
    label: 'Type',
    value: 'type'
  },
  {
    label: 'Vegan',
    value: 'isVegan',
    sort: true,
    align: 'center'
  },
  {
    label: '',
    value: 'actions',
    align: 'center'
  }
]

const sortField = ref<string>(null)
const sortOrder = ref<'asc' | 'desc'>(null)

function handleSortChange () {
  return sortArrayBySortFieldAndOrder(products.value, sortField.value, sortOrder.value)
}

const sortedProducts = computed(() => {
  if (!sortField.value || !sortOrder.value) {
    return products.value
  }

  return handleSortChange()
})

async function getPaginatedProducts (page?: number) {
  if (page && productPagesCache.value[page]) {
    products.value = productPagesCache.value[page]
    return
  }

  try {
    tableLoading.value = true

    const { data, count } = await productsAndRecipesService.getPaginatedProducts(
      pageSize.value,
      (currentPage.value - 1) * pageSize.value,
      selectedType.value
    )

    products.value = data || []
    totalProducts.value = count || 0
    productPagesCache.value[page] = data

    tableLoading.value = false
  } catch (error) {
    showNotification()
  }
}

async function searchProducts (page: number = 1) {
  try {
    tableLoading.value = true

    const offset = (page - 1) * pageSize.value
    const { data, count } = await productsAndRecipesService.searchProducts(
      searchQuery.value,
      selectedType.value,
      pageSize.value, offset)

    products.value = data || []
    totalProducts.value = count || 0
    currentPage.value = 1

    tableLoading.value = false
  } catch (error) {
    showNotification()
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

  try {
    if (isCreating.value) {
      await productsAndRecipesService.createProduct(editableProduct.value)

      products.value.push(editableProduct.value)
      showNotification('Product created successfully', 'Success', 'success')
    } else {
      await productsAndRecipesService.updateProduct(editableProduct.value.id, editableProduct.value)

      const index = products.value.findIndex(product => product.id === editableProduct.value.id)
      if (index !== -1) {
        products.value[index] = { ...editableProduct.value }
      }
      showNotification('Product updated successfully', 'Success', 'success')
    }

    isEditDialogVisible.value = false
  } catch (error) {
    showNotification(error.message, 'error')
  }
}

async function deleteProduct (productId: string) {
  try {
    await productsAndRecipesService.deleteProduct(productId)
    products.value = products.value.filter(product => product.id !== productId)
    showNotification('Product deleted successfully', 'Success', 'success')
    isEditDialogVisible.value = false
  } catch (error) {
    showNotification(error.message, 'error')
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

onMounted(() => {
  pageLoading.value = true
  getPaginatedProducts(currentPage.value)
  pageLoading.value = false
})
</script>
