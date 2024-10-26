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

// type TUser = Omit<ISignUpPayload, 'password'> & {
//   id: string
//   role: string
// }

type TUser = IDatabase<IBodyDetails, INutritionDetails, ITargetNutritionDetailsByMeal>['public']['Tables']['profiles']['Row']
