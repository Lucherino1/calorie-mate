import { defineStore } from 'pinia'
import { router } from '@/router'
import { routeNames } from '@/router/route-names'

export const useAuthStore = defineStore('authStore', () => {
  const user = ref<TUser | null>(null)

  const signup = async (payload: ISignUpPayload) => {
    try {
      const { data, error } = await authService.signup(payload)

      if (error || !data.user) {
        throw new Error(error?.message)
      }
      console.log(user)
      router.push({ name: routeNames.signin })
    } catch (error) {
      console.error(error)
    }
  }

  const signin = async (payload: ISignInPayload) => {
    try {
      const { data, error } = await authService.signin(payload)

      if (error || !data.user) {
        throw new Error(error?.message)
      }

      await getUser(data.user.id)
      router.push({ name: routeNames.dashboard })
    } catch (error) {
      console.error(error)
    }
  }

  const signout = async () => {
    try {
      const { error } = await authService.signout()
      if (error) {
        console.error(error)
      }
      user.value = null
    } catch (error) {
      console.error(error)
    }

    window.location.href = router.resolve({ name: routeNames.signin }).href
  }

  const getUser = async (userId: string) => {
    try {
      const userData = await authService.getUserById(userId)
      user.value = userData
    } catch (error) {
      console.error(error)
    }
  }

  return {
    user,
    signup,
    signin,
    signout,
    getUser
  }
})
