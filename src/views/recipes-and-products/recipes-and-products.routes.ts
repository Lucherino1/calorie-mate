import type { RouteRecordRaw } from 'vue-router'

export const recipesAndProductsRouteNames = {
  recipesAndProducts: 'recipesAndProducts'
}

export const recepiesAndProductsRoutes: RouteRecordRaw[] = [
  {
    path: '/recipes-and-products',
    name: recipesAndProductsRouteNames.recipesAndProducts,
    component: () => import('@/views/recipes-and-products/recipesAndProducts.vue'),
    meta: {
      requireAuth: true
    }
  }
]
