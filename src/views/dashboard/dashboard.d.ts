interface IDashboard {
  id: string
  date: string
  userId: string
  waterAmount: number
  meals: {
    products: IProduct[]
    recipes: IRecipe[]
    type: TMealType
  }[]
}

type TProgressColor = 'success' | 'warning' | 'exception'
