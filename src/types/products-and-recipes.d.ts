type TProductType = keyof typeof import('@/types/products-and-recipes.enums').EProductType
type TProductType = keyof typeof import('@/types/products-and-recipes.enums').ERecipeType

interface IProduct {
  id: string
  name: string
  nutritionDetails: {
    calories: number
    fats: number
    carbs: number
    proteins: number
  }
  type: TProductType
  isVegan: boolean
}

interface IRecipe {
  id: string
  name: string
  userId: string
  description: string
  image: string
  portionWeight: number
  type: TProductType
  isVegan: boolean
  ingredients: IProduct[]
}

type TMealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks'
