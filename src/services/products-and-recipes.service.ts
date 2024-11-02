class ProductsAndRecipesService {
  getGlobalProducts = async () => {
    const { data, error } = await useSupabase.from('products').select('*')

    if (error) throw new Error(error.message)

    return data
  }

  getGlobalRecipes = async () => {
    const { data, error } = await useSupabase.from('recipes').select('*')

    if (error) throw new Error(error.message)

    return data
  }
}

export const productsAndRecipesService = new ProductsAndRecipesService()
