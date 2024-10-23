import type { RouteRecordRaw } from 'vue-router'
import { ELayouts } from '@/types/enums'

export const authRouteNames = {
  signin: 'signin',
  signup: 'signup'
}

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/sign-in',
    name: authRouteNames.signin,
    component: () => import('./SignIn.vue'),
    meta: {
      layout: ELayouts.blank
    }
  },
  {
    path: '/sign-up',
    name: authRouteNames.signup,
    component: () => import('./SignUp.vue'),
    meta: {
      layout: ELayouts.blank
    }
  }
]
