import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { routeNames } from './route-names'

export const routeGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const store = useAuthStore()

  if (to.meta.requireAuth && !store.user) {
    return next({ name: routeNames.signin })
  }

  if (to.meta.roles) {
    const userRole = store.user?.role
    const allowedRoles = to.meta.roles
    if (!userRole || !allowedRoles.includes(userRole)) {
      return next({ name: routeNames.dashboard })
    }
  }

  next()
}

export const renewSession = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const store = useAuthStore()
  const { user } = storeToRefs(store)
  const { getUserData } = store

  if (!store.user) {
    const userData = await getUserData()
    if (userData) {
      user.value = userData
    }
  }
  next()
}

export const sessionGuard = async (
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
