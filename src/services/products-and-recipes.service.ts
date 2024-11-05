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

  getPaginatedProducts = async (limit: number, offset: number, typeFilter?: string) => {
    let query = useSupabase
      .from('products')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)

    if (typeFilter) {
      query = query.eq('type', typeFilter)
    }

    const { data, count, error } = await query

    if (error) throw new Error(error.message)

    return { data, count }
  }

  getPaginatedRecipes = async (limit: number, offset: number, typeFilter?: string) => {
    let query = useSupabase
      .from('recipes')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)

    if (typeFilter) {
      query = query.eq('type', typeFilter)
    }

    const { data, count, error } = await query

    if (error) throw new Error(error.message)

    return { data, count }
  }

  async searchProducts (searchQuery: string, typeFilter?: string, limit?: number, offset?: number) {
    let query = useSupabase
      .from('products')
      .select('*', { count: 'exact' })
      .ilike('name', `%${searchQuery}%`)

    if (typeFilter) {
      query = query.eq('type', typeFilter)
    }

    if (limit !== undefined && offset !== undefined) {
      query = query.range(offset, offset + limit - 1)
    }

    const { data, count, error } = await query

    if (error) throw new Error(error.message)

    return { data, count }
  }

  async updateProduct (productId: string, updatedProductData: Partial<IProduct>) {
    const { data, error } = await useSupabase
      .from('products')
      .update(updatedProductData)
      .eq('id', productId)

    console.log(updatedProductData)
    if (error) throw new Error(error.message)

    return data
  }
}

export const productsAndRecipesService = new ProductsAndRecipesService()
