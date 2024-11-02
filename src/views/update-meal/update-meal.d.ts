type TMealComponent = 'products' | 'recipes'

interface IUpdateProduct extends IProduct {
  grams: number
}

interface IMeals {
  products: IProduct[]
  recipes: IRecipe[]
  type: TMealType
}
