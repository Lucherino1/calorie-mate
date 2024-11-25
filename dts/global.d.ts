import 'vue-router'
import { routeNames } from '@/router/route-names'
import { globalProperties, portalNames } from '@/plugins'
import { EElComponentSize, EElComponentType, ELayouts } from '@/types/enums'
import type { ERoles } from '@/views/auth/auth.enums'

declare module 'vue-router' {
  interface RouteMeta {
    // todo: this is just an example. Please setup your own route meta params.
    label?: string
    roles?: keyof typeof ERoles,
    layout?: keyof typeof ELayouts,
    parentName?: string,
    requireAuth?: boolean,
    isProtectedDuringSession?: boolean
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    // todo: Here you define you global vue definitions.
    $routeNames: typeof routeNames

    // todo: These ones are used only for element library for size and type props;
    $elComponentSize: typeof EElComponentSize
    $elComponentType: typeof EElComponentType
  }
}

declare global {
  interface ObjectConstructor {
    keys<T>(obj: T): Array<keyof T>
  }
}

export { }
