import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { routeNames } from '@/router/route-names'

export const routeGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const store = useAuthStore()

  if (to.meta.requireAuth && !store.user) {
    next({ name: routeNames.signin })
  }

  if (to.meta.roles) {
    const userRole = store.user?.role
    const allowedRoles = to.meta.roles
    if (!userRole || !allowedRoles.includes(userRole)) {
      next({ name: routeNames.dashboard })
    }
  }

  next()
}

export const initializeSession = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const store = useAuthStore()
  const { userProfileLoading } = storeToRefs(store)

  const { getUserProfile } = store

  userProfileLoading.value = true

  if (!store.user) {
    await getUserProfile()
  }

  next()
  userProfileLoading.value = false
}

export const sessionAccessGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const store = useAuthStore()

  if (store.user && to.meta.isProtectedDuringSession) {
    next({ name: routeNames.dashboard })
  } else {
    next()
  }
}
