import type { EProductType, ERecipeType } from '@/types/products-and-recipes.enums'

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
  description: string
  image: string
  portionWeight: number
  type: keyof typeof ERecipeType
  isVegan: boolean
  ingredients: IProduct[]
}

type TMealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks'
