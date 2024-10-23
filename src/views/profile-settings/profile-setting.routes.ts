import type { RouteRecordRaw } from 'vue-router'

export const profileSettignsRouteNames = {
  profileSettings: 'profileSettings'
}

export const profileSettignsRoutes: RouteRecordRaw[] = [
  {
    path: '/profile-settings',
    name: profileSettignsRouteNames.profileSettings,
    component: () => import('./ProfileSettings.vue'),
    meta: {
      requiresAuth: true
    }
  }
]
