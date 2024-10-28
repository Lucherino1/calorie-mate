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
  const generalStore = useGeneralStore()
  const { pageLoading } = storeToRefs(generalStore)

  const store = useAuthStore()
  const { user } = storeToRefs(store)
  const { getUserProfile } = store

  pageLoading.value = true

  if (!store.user) {
    const userData = await getUserProfile()
    if (userData) {
      user.value = userData
    }
  }
  pageLoading.value = false
  next()
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
