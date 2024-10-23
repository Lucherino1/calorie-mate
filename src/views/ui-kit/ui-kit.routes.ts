import type { RouteRecordRaw } from 'vue-router'

export const uiKitRouteNames = {
  uiKit: 'uiKit'
}

export const uiKitRoutes: RouteRecordRaw[] = [
  {
    path: '/ui-kit',
    name: uiKitRouteNames.uiKit,
    component: () => import('./UIKit.vue')
  }
]
