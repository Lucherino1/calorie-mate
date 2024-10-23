import type { RouteRecordRaw } from 'vue-router'
import { uiKitRoutes } from '@/views/ui-kit/ui-kit.routes'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },
  ...uiKitRoutes
]

export {
  routes
}
