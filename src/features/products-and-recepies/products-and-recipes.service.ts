import type { IProduct, IUserProduct } from './products-and-recipes'

class RecipesAndProductsService {
  getAllProducts () {
    return useSupabase.from('products').select('*')
  }

  getUserProducts (userId: string) {
    return useSupabase.from('user-products').select('*').eq('user_id', userId)
  }

  getAllRecipes () {
    return useSupabase.from('recipes').select('*')
  }

  getUserRecipes (userId: string) {
    return useSupabase.from('user-recipes').select('*').eq('user_id', userId)
  }

  addProductToMeal (product: IUserProduct) {
    return useSupabase.from('user-products').insert(product)
  }
}

export const recipesAndProductsService = new RecipesAndProductsService()
