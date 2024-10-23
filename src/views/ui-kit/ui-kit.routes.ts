import type { RouteRecordRaw } from 'vue-router'
import UIKit from '@/views/ui-kit/UIKit.vue'

export const uiKitRoutesNames = {
  uiKit: 'ui-kit'
}

export const uiKitRoutes: RouteRecordRaw[] = [
  {
    path: '/ui-kit',
    name: uiKitRoutesNames.uiKit,
    component: UIKit
  }
]
