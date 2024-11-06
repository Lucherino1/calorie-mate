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
      <RecipesAndProductsRecipesTab
        v-model:active-tab="activeTab"
      />
    </template>
  </ProductsAndRecipesTabsWrapper>
</template>

<script lang="ts" setup>
const pageLoading = ref(false)
const activeTab = ref('products')
</script>
