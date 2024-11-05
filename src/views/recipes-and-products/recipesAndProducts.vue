<template>
  <ProductsAndRecipesTabsWrapper
    v-model:active-tab="activeTab"
    :page-title="'Recipes and Products'"
    :loading="pageLoading"
  >
    <template #products>
      <RecipesAndProductsProductsTab />
    </template>

    <template #recipes>
      <div>
        sss
      </div>
    </template>
  </ProductsAndRecipesTabsWrapper>
</template>

<script lang="ts" setup>
// import { showNotification } from '@/helpers'

const pageLoading = ref(false)
const activeTab = ref('products')

// const currentPage = ref(1)
// const pageSize = ref(15)

// const totalProducts = ref(0)
// const products = ref<IProduct[]>([])

// const loadPaginatedProducts = async () => {
//   try {
//     pageLoading.value = true
//     const { data, count } = await productsAndRecipesService.getPaginatedProducts(pageSize.value, 0)

//     products.value = data || []
//     console.log(products.value)
//     totalProducts.value = count || 0

//     pageLoading.value = false
//   } catch (error) {
//     showNotification()
//   }
// }

// onMounted(() => {
//   loadPaginatedProducts()
// })
</script>
