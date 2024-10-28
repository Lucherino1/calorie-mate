interface ISignInPayload {
  email: string
  password: string
}

interface ISignUpPayload {
  email: string
  password: string
  metadata: {
    firstName: string
    lastName: string
    bodyDetails: IBodyDetails
    targetNutritionDetails: INutritionDetails
    targetNutritionDetailsByMeal: ITargetNutritionDetailsByMeal
  }
}

interface IUser {
  bodyDetails: IBodyDetails
  email: string
  firstName: string
  id: string
  lastName: string
  role: string
  targetNutritionDetails: INutritionDetails
  targetNutritionDetailsByMeal: ITargetNutritionDetailsByMeal
}
