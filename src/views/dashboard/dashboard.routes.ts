import type { RouteRecordRaw } from 'vue-router'
import Dashboard from './Dashboard.vue'

export const dashboardRoutesNames = {
  dashboard: 'dashboard'
}

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: dashboardRoutesNames.dashboard,
    component: Dashboard
  }
]
