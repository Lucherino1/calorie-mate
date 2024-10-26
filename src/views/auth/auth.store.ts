import { defineStore } from 'pinia'
import { router } from '@/router'
import { routeNames } from '@/router/route-names'
import { showWarningNotification } from '@/helpers'

export const useAuthStore = defineStore('authStore', () => {
  const user = ref<TNullable<TUser>>(null)

  const signup = async (payload: ISignUpPayload) => {
    try {
      const { data, error } = await authService.signup(payload)

      if (error || !data.user) {
        throw new Error(error?.message)
      }

      router.push({ name: routeNames.signin })
    } catch (error) {
      showWarningNotification((error as Error).message, 'Signup Error')
    }
  }

  const signin = async (payload: ISignInPayload) => {
    try {
      const { data, error } = await authService.signin(payload)

      if (error || !data.user) {
        throw new Error(error?.message || 'Sign In failed')
      }

      const userData = await getUserDataById(data.user.id)
      if (userData) {
        user.value = userData
      }

      router.push({ name: routeNames.dashboard })
    } catch (error) {
      showWarningNotification((error as Error).message, 'Sign In Error')
    }
  }

  const signout = async () => {
    try {
      const { error } = await authService.signout()
      if (error) {
        showWarningNotification(error.message, 'Signout Error')
      }

      user.value = null
    } catch (error) {
      console.error(error)
    }

    window.location.href = router.resolve({ name: routeNames.signin }).href
  }

  const getUserDataById = async (userId: string): Promise<TUser | null> => {
    try {
      const { data, error } = await authService.getUserById(userId)
      if (error) throw new Error(error.message)

      return Array.isArray(data) ? data[0] : data ?? null
    } catch (error) {
      showWarningNotification((error as Error).message, 'User Data Retrieval Error')
      return null
    }
  }

  const getUserData = async (): Promise<TUser | null> => {
    const userId = (await authService.getUser())?.id
    if (!userId) return null

    const { data, error } = await authService.getUserById(userId)

    if (error) {
      await signout()
      showWarningNotification(error.message, 'Session Error')
      return null
    }

    if (Array.isArray(data)) {
      return data[0] || null
    }

    return data ?? null
  }

  return {
    user,
    signup,
    signin,
    signout,
    getUserDataById,
    getUserData
  }
})
