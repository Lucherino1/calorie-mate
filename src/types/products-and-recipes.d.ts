type TProductType = keyof typeof import('@/types/products-and-recipes.enums').EProductType
type TRecipesType = keyof typeof import('@/types/products-and-recipes.enums').ERecipeType

interface IProduct {
  id?: string
  name: string
  nutritionDetails: {
    calories: number
    fats: number
    carbs: number
    proteins: number
  }
  grams?: number
  type: TProductType
  isVegan: boolean
}

interface IRecipe {
  id?: string
  name: string
  userId?: string
  description: string
  image: string
  portionWeight: number
  portions?: number
  type: TRecipesType
  isVegan: boolean
  ingredients: IProduct[]
}

type TMealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks'
