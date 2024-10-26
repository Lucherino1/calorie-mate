import { router } from '@/router'
import { routeNames } from '@/router/route-names'

export const useAuthStore = defineStore('authStore', () => {
  const signup = async (payload: ISignUpPayload) => {
    try {
      const { data, error } = await authService.signup(payload)

      if (error || !data.user) {
        throw new Error(error?.message)
      }

      router.push({ name: routeNames.dashboard })
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
      console.log(data)
      router.push({ name: routeNames.dashboard })
    } catch (error) {
      console.error(error)
    }
  }

  const signout = async () => {
    try {
      const { error } = await authService.singout()
      if (error) {
        console.log(error)
      }
    } catch (error) {
      console.log(error)
    }

    window.location.href = router.resolve({ name: routeNames.signin }).href
  }
  return {
    signup,
    signin,
    signout
  }
})
