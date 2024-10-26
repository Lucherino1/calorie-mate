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

type TUser = TDatabase['public']['Tables']['profiles']['Row']
