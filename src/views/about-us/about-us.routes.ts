import type { RouteRecordRaw } from 'vue-router'
import AboutUs from './AboutUs.vue'
import { ELayouts } from '@/types/enums'

export const aboutUsRouteNames = {
  aboutUs: 'aboutUs'
}

export const aboutUsRoutes: RouteRecordRaw[] = [
  {
    path: '/about-us',
    name: aboutUsRouteNames.aboutUs,
    component: AboutUs,
    meta: {
      layout: ELayouts.blank
    }
  }
]
