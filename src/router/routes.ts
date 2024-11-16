import type { RouteRecordRaw } from 'vue-router'
import { uiKitRoutes } from '@/views/ui-kit/ui-kit.routes'
import { aboutUsRoutes } from '@/views/about-us/about-us.routes'
import { calculatorsRoutes } from '@/views/calculators/calculators.routes'
import { authRoutes } from '@/views/auth/auth.routes'
import { updateMealRoutes } from '@/views/update-meal/update-meal.routes'
import { recipesAndProductsRoutes } from '@/views/recipes-and-products/recipes-and-products.routes'
import { profileSettingRoutes } from '@/views/profile-settings/profile-settings.routes'
import { dashboardRoutes } from '@/views/dashboard/dashboard.routes'
import { productRecipeApprovalRoutes } from '@/views/approve-products-and-recipes/approve-products-and-recipes.routes'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/about-us'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },
  ...dashboardRoutes,
  ...uiKitRoutes,
  ...aboutUsRoutes,
  ...calculatorsRoutes,
  ...authRoutes,
  ...updateMealRoutes,
  ...recipesAndProductsRoutes,
  ...profileSettingRoutes,
  ...productRecipeApprovalRoutes
]

export {
  routes
}
