class AuthService {
  // auth/v1/token?grant_type=password
  signip (payload: ISignInPayload) {
    return useSupabase.auth.signInWithPassword(payload)
  }

  // POST: auth/v1/signup, Payload: { email: string, password: string }
  signup ({ email, password, ...rest }: ISignUpPayload) {
    return useSupabase.auth.signUp({ email, password, options: { data: rest } })
  }

  // auth/v1/token?grant_type=refresh_token / { refresh_token: "the-refresh-token" }
}

export const authService = new AuthService()
