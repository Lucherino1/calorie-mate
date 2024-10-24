import type { RouteRecordRaw } from 'vue-router'

export const recepiesAndProductsRouteNames = {
  recepiesAndProducts: 'recepiesAndProducts'
}

export const recepiesAndProductsRoutes: RouteRecordRaw[] = [
  {
    path: '/recepies-and-products',
    name: recepiesAndProductsRouteNames.recepiesAndProducts,
    component: () => import('@/views/recepies-and-products/RecepiesAndProducts.vue'),
    meta: {
      requireAuth: true
    }
  }
]
