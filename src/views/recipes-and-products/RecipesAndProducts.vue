<template>
  <ProductsAndRecipesTabsWrapper
    v-model:active-tab="activeTab"
    :page-title="title"
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

const activeTab = ref('products')

const authStore = useAuthStore()

const title = computed(() => {
  return authStore.isUserAdmin ? 'Recipes and Products' : 'My Recipes and Products'
})
</script>
