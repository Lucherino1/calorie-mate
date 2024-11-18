import type { RouteRecordRaw } from 'vue-router'

export const aboutUsRouteNames = {
  aboutUs: 'aboutUs'
}

export const aboutUsRoutes: RouteRecordRaw[] = [
  {
    path: '/about-us',
    name: aboutUsRouteNames.aboutUs,
    component: () => import('@/views/about-us/AboutUs.vue')
  }
]
