import type { RouteRecordRaw } from 'vue-router'

export const profileSettignsRouteNames = {
  profileSettings: 'profileSettings'
}

export const profileSettignsRoutes: RouteRecordRaw[] = [
  {
    path: '/profile-settings',
    name: profileSettignsRouteNames.profileSettings,
    component: () => import('@/views/profile-settings/ProfileSettings.vue'),
    meta: {
      requireAuth: true
    }
  }
]
