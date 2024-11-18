import type { RouteRecordRaw } from 'vue-router'

export const recipesAndProductsRouteNames = {
  recipesAndProducts: 'recipesAndProducts'
}

export const recipesAndProductsRoutes: RouteRecordRaw[] = [
  {
    path: '/recipes-and-products',
    name: recipesAndProductsRouteNames.recipesAndProducts,
    component: () => import('@/views/recipes-and-products/RecipesAndProducts.vue'),
    meta: {
      requireAuth: true
    }
  }
]
