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

  singout () {
    return useSupabase.auth.signOut()
  }
}

export const authService = new AuthService()
