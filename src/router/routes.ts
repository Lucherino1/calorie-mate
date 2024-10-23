import type { RouteRecordRaw } from 'vue-router'
import { uiKitRoutes } from '@/views/ui-kit/ui-kit.routes'
import { aboutUsRoutes } from '@/views/about-us/about-us.routes'
import { calculatorsRoutes } from '@/views/calculators/calculators.routes'
import { authRoutes } from '@/views/auth/auth.routes'
import { updateMealRoutes } from '@/views/update-meal/update-meal'
import { recepiesAndProductsRoutes } from '@/views/recepies-and-products/recepies-and-products.routes'
import { profileSettignsRoutes } from '@/views/profile-settings/profile-setting.routes'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },
  ...uiKitRoutes,
  ...aboutUsRoutes,
  ...calculatorsRoutes,
  ...authRoutes,
  ...updateMealRoutes,
  ...recepiesAndProductsRoutes,
  ...profileSettignsRoutes
]

export {
  routes
}
