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

  async updateUserProfile (userProfile: Omit<IProfileFields, 'password' | 'confirmPassword'>) {
    const authStore = useAuthStore()
    const { email, firstName, lastName } = userProfile

    return useSupabase.from('profiles').update({ email, firstName, lastName }).eq('id', authStore.user.id)
  }

  async updateUserPassword (newPassword: string) {
    return useSupabase.auth.updateUser({ password: newPassword })
  }
}

export const profileService = new ProfileService()
