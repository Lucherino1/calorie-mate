import { aboutUsRouteNames } from '@/views/about-us/about-us.routes'
import { authRouteNames } from '@/views/auth/auth.routes'
import { calculatorsRouteNames } from '@/views/calculators/calculators.routes'
import { dashboardRouteNames } from '@/views/dashboard/dashboard.routes'
import { profileSettignsRouteNames } from '@/views/profile-settings/profile-setting.routes'
import { recepiesAndProductsRouteNames } from '@/views/recepies-and-products/recepies-and-products.routes'
import { uiKitRouteNames } from '@/views/ui-kit/ui-kit.routes'
import { updateMealRouteNames } from '@/views/update-meal/update-meal'

export const routeNames = {
  ...dashboardRouteNames,
  ...uiKitRouteNames,
  ...aboutUsRouteNames,
  ...calculatorsRouteNames,
  ...authRouteNames,
  ...updateMealRouteNames,
  ...recepiesAndProductsRouteNames,
  ...profileSettignsRouteNames
}
