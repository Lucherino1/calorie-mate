class AuthService {
  signin (payload: ISignInPayload) {
    return useSupabase.auth.signInWithPassword(payload)
  }

  signup ({ email, password, metadata }: ISignUpPayload) {
    return useSupabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    })
  }

  signout () {
    return useSupabase.auth.signOut()
  }

  async getUserById (userId: string) {
    const { data, error } = await useSupabase.from('profiles').select('*').eq('id', userId).single()

    if (error) {
      throw new Error(error.message)
    }

    return data
  }
}

export const authService = new AuthService()
