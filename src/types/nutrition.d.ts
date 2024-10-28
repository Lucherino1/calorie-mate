interface INutritionDetails {
  calories: number
  fats: number
  carbs: number
  proteins: number
}

interface ITargetNutritionDetailsByMeal {
  breakfast: INutritionDetails
  lunch: INutritionDetails
  dinner: INutritionDetails
  snacks: INutritionDetails
}

type TMealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks'
