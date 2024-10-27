import { ERecipeType, EProductType } from '@/types/enums'

interface IProduct {
  id: string
  name: string
  nutritionDetails: {
    calories: number
    fats: number
    carbs: number
    proteins: number
  }
  type: keyof typeof EProductType
  isVegan: boolean
}

interface IRecipe {
  id: string
  name: string
  userId: string
  isUnderReview: boolean
  description: string
  image: string
  portionWeight: number
  type: keyof typeof ERecipeType
  isVegan: boolean
  ingredients: IProduct
}

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
  ingredients: IProduct
}
