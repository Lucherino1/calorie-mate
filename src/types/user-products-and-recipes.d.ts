type TProductType = keyof typeof import('@/types/products-and-recipes.enums').EProductType
type TRecipesType = keyof typeof import('@/types/products-and-recipes.enums').ERecipeType

interface IUserProduct {
  id: string
  name: string
  userId: string
  isUnderReview: boolean
  nutritionDetails: {
    calories: number
    fats: number
    carbs: number
    proteins: number
  }
  type: TProductType
  isVegan: boolean
}

interface IUserRecipe {
  id: string
  name: string
  userId: string
  isUnderReview: boolean
  description: string
  image: string
  portionWeight: number
  type: TRecipesType
  isVegan: boolean
  ingredients: IProduct[]
}
