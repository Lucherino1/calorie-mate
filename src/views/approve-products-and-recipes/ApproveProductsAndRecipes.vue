<template>
  <ProductsAndRecipesTabsWrapper
    v-model:active-tab="activeTab"
    :page-title="pageTitle"
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

const pageTitle = computed(() => activeTab.value === 'products' ? 'Approve Products' : 'Approve Recipes')
</script>
