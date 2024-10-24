import type { RouteRecordRaw } from 'vue-router'

export const productRecipeApprovalRouteNames = {
  productRecipeApproval: 'productRecipeApproval'
}

export const productRecipeApprovalRoutes: RouteRecordRaw[] = [
  {
    path: '/approve-products-and-recepies',
    name: productRecipeApprovalRouteNames.productRecipeApproval,
    component: () => import('@/views/product-recipe-approval/ProductRecipeApproval.vue')
  }
]
