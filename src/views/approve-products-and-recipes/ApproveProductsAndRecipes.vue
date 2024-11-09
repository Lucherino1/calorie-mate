<template>
  <ProductsAndRecipesTabsWrapper
    v-model:active-tab="activeTab"
    page-title="Admin Panel"
    :loading="pageLoading"
    class=""
  >
    <template #products>
      <el-card class="mt-5 h-full w-full">
        <RecipesAndProductsProductsTable
          :table-data="products"
          :table-loading="tableLoading"
        />
      </el-card>
    </template>

    <template #recipes>
      <!-- <RecipesAndProductsRecipesTable
        tableData: IRecipe[]
        tableLoading: boolean
      /> -->
    </template>
  </ProductsAndRecipesTabsWrapper>
</template>

<script lang="ts" setup>
import { showNotification } from '@/helpers'

const pageLoading = ref(false)
const tableLoading = ref(false)
const activeTab = ref('products')

const authStore = useAuthStore()

const products = ref<IProduct[]>(null)

async function getProducts () {
  pageLoading.value = true
  try {
    const data = await approveService.getPendingApprovalProducts()

    products.value = data
  } catch (error) {
    showNotification()
  } finally {
    pageLoading.value = false
  }
}

onMounted(() => {
  getProducts()
})
</script>
