type TMealComponent = 'products' | 'recipes'

interface IMeals {
  products: IProduct[]
  recipes: IRecipe[]
  type: TMealType
}
