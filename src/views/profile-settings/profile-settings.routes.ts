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
    },
    props: (route) => ({
      query: route.query,
      email: route.query.email,
      token: route.query.token,
      emailUpdated: route.query['email-updated'] === 'true'
    })
  }
]
