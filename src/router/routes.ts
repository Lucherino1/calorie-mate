import type { RouteRecordRaw } from 'vue-router'
import { routeNames } from './route-names'
import { uiKitRoutes } from '@/views/ui-kit/ui-kit.routes'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },
  {
    path: '/',
    name: routeNames.home,
    component: () => import('@/views/home/Home.vue')
  },

  ...uiKitRoutes
]

export {
  routes
}
