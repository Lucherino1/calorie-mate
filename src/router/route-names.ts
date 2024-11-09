import { aboutUsRouteNames } from '@/views/about-us/about-us.routes'
import { authRouteNames } from '@/views/auth/auth.routes'
import { calculatorsRouteNames } from '@/views/calculators/calculators.routes'
import { dashboardRouteNames } from '@/views/dashboard/dashboard.routes'
import { productRecipeApprovalRouteNames } from '@/views/approve-products-and-recipes/approve-products-and-recipes.routes'
import { profileSettingsRouteNames } from '@/views/profile-settings/profile-setting.routes'
import { recipesAndProductsRouteNames } from '@/views/recipes-and-products/recipes-and-products.routes'
import { uiKitRouteNames } from '@/views/ui-kit/ui-kit.routes'
import { updateMealRouteNames } from '@/views/update-meal/update-meal.routes'

export const routeNames = {
  ...dashboardRouteNames,
  ...uiKitRouteNames,
  ...aboutUsRouteNames,
  ...calculatorsRouteNames,
  ...authRouteNames,
  ...updateMealRouteNames,
  ...recipesAndProductsRouteNames,
  ...profileSettingsRouteNames,
  ...productRecipeApprovalRouteNames
}
