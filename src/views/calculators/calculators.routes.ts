import type { RouteRecordRaw } from 'vue-router'

export const calculatorsRouteNames = {
  calculators: 'calculators'
}

export const calculatorsRoutes: RouteRecordRaw[] = [
  {
    path: '/calculators',
    name: calculatorsRouteNames.calculators,
    component: () => import('@/views/calculators/Calculators.vue')
  }
]
