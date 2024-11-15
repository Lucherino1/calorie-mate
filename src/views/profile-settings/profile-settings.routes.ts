import type { RouteRecordRaw } from 'vue-router'

export const profileSettingsRouteNames = {
  profileSettings: 'profileSettings'
}

export const profileSettingRoutes: RouteRecordRaw[] = [
  {
    path: '/profile-settings',
    name: profileSettingsRouteNames.profileSettings,
    component: () => import('@/views/profile-settings/ProfileSettings.vue'),
    meta: {
      requireAuth: true
    }
  }
]
