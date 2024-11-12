<template>
  <ProductsAndRecipesTabsWrapper
    v-model:active-tab="activeTab"
    page-title="Admin Panel"
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
const activeTab = ref('products')
</script>
