<template>
  <ProductsAndRecipesTabsWrapper
    v-model:active-tab="activeTab"
    page-title="Admin Panel"
    :loading="pageLoading"
  >
    <template #products>
      <ApproveProductsAndRecipesProductsTab />
    </template>

    <template #recipes>
      <ApproveProductsAndRecipesRecipesTab
        v-model:active-tab="activeTab"
      />
    </template>
  </ProductsAndRecipesTabsWrapper>
</template>

<script lang="ts" setup>
const pageLoading = ref(false)

const activeTab = ref('products')
</script>
