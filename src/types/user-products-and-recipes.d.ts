// temporary design to remove errors

enum ERecipeType {
  sweet = 'sweet',
  soup = 'soup',
  salad = 'salad',
  mainCourse = 'mainCourse',
  appetizer = 'appetizer',
  dessert = 'dessert',
  beverage = 'beverage',
  snack = 'snack',
  sideDish = 'sideDish',
}

enum EProductType {
  vegetable = 'vegetable',
  fruit = 'fruit',
  meat = 'meat',
  dairy = 'dairy',
  grain = 'grain',
  seafood = 'seafood',
  nut = 'nut',
  spice = 'spice',
  beverage = 'beverage',
  condiment = 'condiment',
}

interface IProduct {
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
  ingredients: IProduct[]
}
