import type { EProductType, ERecipeType } from './products-and-recipes.enums'

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
  type: keyof typeof EProductType
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
  type: keyof typeof ERecipeType
  isVegan: boolean
  ingredients: IProduct[]
}
