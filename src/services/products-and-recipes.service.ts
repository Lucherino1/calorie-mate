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

  getUserProduct = async () => {
    const { data, error } = await useSupabase.from('user-products').select('*')

    if (error) throw new Error(error.message)

    return data
  }

  getUserRecipes = async () => {
    const { data, error } = await useSupabase.from('user-recipes').select('*')

    if (error) throw new Error(error.message)

    return data
  }

  getPaginatedProducts = async (limit: number, offset: number) => {
    const { data, count, error } = await useSupabase
      .from('products')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)

    if (error) throw new Error(error.message)

    return { data, count }
  }

  getPaginatedRecipes = async (limit: number, offset: number) => {
    const { data, count, error } = await useSupabase
      .from('recipes')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)

    if (error) throw new Error(error.message)

    return { data, count }
  }
}

export const productsAndRecipesService = new ProductsAndRecipesService()
