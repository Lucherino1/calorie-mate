class ProfileService {
  async updateUserBodyDetails (bodyDetails: Partial<IBodyDetails>) {
    const authStore = useAuthStore()
    return useSupabase.from('profiles').update({ bodyDetails }).eq('id', authStore.user.id)
  }

  recalculateTargetNutrition (userProfile: IUser) {
    const userBody = userProfile.bodyDetails

    const bmr = nutritionService.calcBMR(userBody.currentWeight, userBody.height, userBody.age, userBody.sex)

    const tdee = nutritionService.calcTDEE(bmr, userBody.activityLevel)
    const goalCalories = nutritionService.calcGoalCalories(userBody.currentWeight, userBody.goalWeight, tdee)

    const targetNutritionDetails = nutritionService.calcTargetNutritionDetails(goalCalories)
    const targetNutritionDetailsByMeal = nutritionService.calcTargetNutritionDetailsByMeal(targetNutritionDetails)

    userProfile.targetNutritionDetails = targetNutritionDetails
    userProfile.targetNutritionDetailsByMeal = targetNutritionDetailsByMeal
    return userProfile
  }

  async updateUserTargetNutrition (targetNutritionDetails: INutritionDetails) {
    const authStore = useAuthStore()
    return useSupabase.from('profiles').update({ targetNutritionDetails }).eq('id', authStore.user.id)
  }

  async updateUserTargetNutritionByMeal (targetNutritionDetailsByMeal: ITargetNutritionDetailsByMeal) {
    const authStore = useAuthStore()

    return useSupabase.from('profiles').update({ targetNutritionDetailsByMeal }).eq('id', authStore.user.id)
  }

  async updateUserEmail (email: string) {
    const redirectEmailUrl = 'http://localhost:5173/profile-settings'

    try {
      const { data, error } = await useSupabase.auth.updateUser(
        { email },
        { emailRedirectTo: redirectEmailUrl }
      )
      if (error) throw new Error()

      return data
    } catch (error) {
      throw new Error()
    }
  }

  async updateUserProfileDetails (userProfile: IUserProfile) {
    const authStore = useAuthStore()
    const userId = authStore.user?.id
    const { firstName, lastName } = userProfile

    try {
      const { data, error } = await useSupabase
        .from('profiles')
        .update({ firstName, lastName })
        .eq('id', userId)
      if (error) throw new Error()

      return data
    } catch (error) {
      throw new Error()
    }
  }

  async updateUserPassword (newPassword: string) {
    return useSupabase.auth.updateUser({ password: newPassword })
  }

  async verifyAndUpdateEmail ({ email, token }: {email: string; token: string}) {
    const authStore = useAuthStore()

    const { error: otpError } = await useSupabase.auth.verifyOtp({
      email,
      token,
      type: 'email_change'
    })

    if (otpError) {
      throw new Error(otpError.message)
    }

    const { data: userData, error: userError } = await useSupabase.auth.getUser()

    if (userError || !userData) {
      throw new Error(userError?.message)
    }

    const { error: profileError } = await useSupabase
      .from('profiles')
      .update({ email: userData.user.email })
      .eq('id', authStore.user.id)

    if (profileError) {
      throw new Error(profileError.message)
    }

    authStore.user.email = userData.user.email
  }
}

export const profileService = new ProfileService()
