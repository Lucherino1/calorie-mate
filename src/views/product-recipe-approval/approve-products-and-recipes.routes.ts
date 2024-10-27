import type { RouteRecordRaw } from 'vue-router'

export const productRecipeApprovalRouteNames = {
  productRecipeApproval: 'productRecipeApproval'
}

export const productRecipeApprovalRoutes: RouteRecordRaw[] = [
  {
    path: '/approve-products-and-recipes',
    name: productRecipeApprovalRouteNames.productRecipeApproval,
    component: () => import('@/views/product-recipe-approval/ProductRecipeApproval.vue'),
    meta: {
      requireAuth: true,
      roles: 'admin'
    }
  }
]
