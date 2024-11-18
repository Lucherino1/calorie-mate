import type { RouteRecordRaw } from 'vue-router'

export const updateMealRouteNames = {
  updateMeal: 'updateMeal'
}

export const updateMealRoutes: RouteRecordRaw[] = [
  {
    path: '/update-meal/:mealType?',
    props: true,
    name: updateMealRouteNames.updateMeal,
    component: () => import('@/views/update-meal/UpdateMeal.vue'),
    meta: {
      requireAuth: true
    }
  }
]
