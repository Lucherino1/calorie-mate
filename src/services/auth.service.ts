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
    return useSupabase.from('profiles').select('*').eq('id', userId).maybeSingle()
  }

  async getUser () {
    return (await useSupabase.auth.getSession()).data.session?.user
  }
}

export const authService = new AuthService()
