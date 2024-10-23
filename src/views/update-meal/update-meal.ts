import type { RouteRecordRaw } from 'vue-router'

export const updateMealRouteNames = {
  updateMeal: 'updateMeal'
}

export const updateMealRoutes: RouteRecordRaw[] = [
  {
    path: '/update-meal',
    name: updateMealRouteNames.updateMeal,
    component: () => import('./UpdateMeal.vue'),
    meta: {
      requiresAuth: true
    }
  }
]
