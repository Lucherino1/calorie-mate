import type { RouteRecordRaw } from 'vue-router'
import { ELayouts } from '@/types/enums'

export const aboutUsRouteNames = {
  aboutUs: 'aboutUs'
}

export const aboutUsRoutes: RouteRecordRaw[] = [
  {
    path: '/about-us',
    name: aboutUsRouteNames.aboutUs,
    component: () => import('./AboutUs.vue'),
    meta: {
      layout: ELayouts.blank
    }
  }
]
