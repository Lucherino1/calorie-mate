import { defineStore } from 'pinia'
import { router } from '@/router'
import { routeNames } from '@/router/route-names'
import { showWarningNotification } from '@/helpers'

export const useAuthStore = defineStore('authStore', () => {
  const userProfileLoading = ref(false)
  const user = ref<TNullable<IUser>>(null)

  const signup = async (payload: ISignUpPayload) => {
    try {
      const { data, error } = await authService.signup(payload)

      if (error || !data.user) {
        throw new Error(error?.message || 'Signup failed')
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

      const userData = await getUserProfile(data.user.id)
      user.value = userData

      router.push({ name: routeNames.dashboard })
    } catch (error) {
      showWarningNotification((error as Error).message, 'Sign In Error')
    }
  }

  const signout = async () => {
    try {
      const { error } = await authService.signout()
      if (error) {
        throw new Error(error.message || 'Signout failed')
      }

      user.value = null
    } catch (error) {
      showWarningNotification((error as Error).message, 'Signout Error')
    }

    window.location.href = router.resolve({ name: routeNames.signin }).href
  }

  const getUserProfile = async (userId?: string) => {
    try {
      const id = userId || (await authService.getUser())?.id

      if (!id) return null

      const { data, error } = await authService.getUserById(id)
      user.value = data

      if (error) {
        if (!userId) await signout()
        throw new Error(error.message || 'User Data Retrieval failed')
      }

      return data
    } catch (error) {
      showWarningNotification((error as Error).message, 'User Data Retrieval failed')
    }
  }

  return {
    user,
    signup,
    signin,
    signout,
    getUserProfile,
    userProfileLoading
  }
})
