class ProfileService {
  updateUserBodyDetails = async (userId: string, bodyDetails: Partial<IBodyDetails>) => {
    return useSupabase.from('profiles').update({ bodyDetails }).eq('id', userId)
  }

  recalculateTargetNutrition = (userProfile: IUser) => {
    const bmr = nutritionService.calcBMR(
      userProfile.bodyDetails.currentWeight,
      userProfile.bodyDetails.height,
      userProfile.bodyDetails.age,
      userProfile.bodyDetails.sex
    )

    const tdee = nutritionService.calcTDEE(bmr, userProfile.bodyDetails.activityLevel)
    const goalCalories = nutritionService.calcGoalCalories(
      userProfile.bodyDetails.currentWeight,
      userProfile.bodyDetails.goalWeight,
      tdee
    )

    const targetNutritionDetails = nutritionService.calcTargetNutritionDetails(goalCalories)
    const targetNutritionDetailsByMeal = nutritionService.calcTargetNutritionDetailsByMeal(targetNutritionDetails)

    userProfile.targetNutritionDetails = targetNutritionDetails
    userProfile.targetNutritionDetailsByMeal = targetNutritionDetailsByMeal
    return userProfile
  }
}

export const profileService = new ProfileService()
