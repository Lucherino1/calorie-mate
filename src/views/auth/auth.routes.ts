import type { RouteRecordRaw } from 'vue-router'

export const authRouteNames = {
  signin: 'signin',
  signup: 'signup'
}

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/sign-in',
    name: authRouteNames.signin,
    component: () => import('@/views/auth/SignIn.vue'),
    meta: {
      layout: 'blank'
    }
  },
  {
    path: '/sign-up',
    name: authRouteNames.signup,
    component: () => import('@/views/auth/SignUp.vue'),
    meta: {
      layout: 'blank'
    }
  }
]
