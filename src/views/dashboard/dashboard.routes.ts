import type { RouteRecordRaw } from 'vue-router'

export const dashboardRouteNames = {
  dashboard: 'dashboard'
}

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: dashboardRouteNames.dashboard,
    component: () => import('@/views/dashboard/Dashboard.vue')
  }
]
