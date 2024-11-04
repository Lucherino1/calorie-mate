class ProfileService {
  updateUserBodyDetails = async (userId: string, bodyDetails: Partial<IBodyDetails>) => {
    return useSupabase.from('profiles').update({ bodyDetails }).eq('id', userId)
  }

  recalculateTargetNutrition = (userProfile: IUser) => {
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

  updateUserTargetNutrition = async (userId: string, targetNutritionDetails: INutritionDetails) => {
    return useSupabase.from('profiles').update({ targetNutritionDetails }).eq('id', userId)
  }

  updateUserTargetNutritionByMeal = async (
    userId: string,
    targetNutritionDetailsByMeal: ITargetNutritionDetailsByMeal
  ) => {
    return useSupabase.from('profiles').update({ targetNutritionDetailsByMeal }).eq('id', userId)
  }
}

export const profileService = new ProfileService()
