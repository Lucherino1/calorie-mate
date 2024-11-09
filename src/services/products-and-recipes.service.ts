class ProductsAndRecipesService {
  async getProducts ({
    searchQuery,
    typeFilter,
    limit,
    offset,
    isAdmin = false,
    userOnly = false
  }: {
    searchQuery?: string
    typeFilter?: string[]
    limit?: number
    offset?: number
    isAdmin?: boolean
    userOnly?: boolean
  } = {}) {
    const tableName = isAdmin || !userOnly ? 'products' : 'user-products'

    let query = useSupabase
      .from(tableName)
      .select('*', { count: 'exact' })

    if (typeFilter && typeFilter.length > 0) {
      query = query.in('type', typeFilter)
    }

    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`)
    }

    if (limit !== undefined && offset !== undefined) {
      query = query.range(offset, offset + limit - 1)
    }

    const { data, count, error } = await query
    if (error) throw new Error(error.message)

    return { data, count }
  }

  async getProductById (id: string) {
    try {
      const { data, error } = await useSupabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async getRecipes ({
    searchQuery,
    typeFilter,
    limit,
    offset,
    isAdmin = false,
    userOnly = false
  }: {
    searchQuery?: string
    typeFilter?: string[]
    limit?: number
    offset?: number
    isAdmin?: boolean
    userOnly?: boolean
  } = {}) {
    const tableName = isAdmin || !userOnly ? 'recipes' : 'user-recipes'

    let query = useSupabase
      .from(tableName)
      .select('*', { count: 'exact' })

    if (typeFilter && typeFilter.length > 0) {
      query = query.in('type', typeFilter)
    }

    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`)
    }

    if (limit !== undefined && offset !== undefined) {
      query = query.range(offset, offset + limit - 1)
    }

    const { data, count, error } = await query
    if (error) throw new Error(error.message)

    return { data, count }
  }

  async updateProduct ({
    productId,
    updatedProductData,
    isAdmin = false
  }: {
    productId: string
    updatedProductData: Partial<IProduct>
    isAdmin?: boolean
  }) {
    const tableName = isAdmin ? 'products' : 'user-products'

    const { data, error } = await useSupabase
      .from(tableName)
      .update(updatedProductData)
      .eq('id', productId)

    if (error) throw new Error(error.message)

    return data
  }

  async updateRecipe ({
    recipeId,
    updatedRecipeData,
    isAdmin = false
  }: {
    recipeId: string
    updatedRecipeData: Partial<IRecipe>
    isAdmin?: boolean
  }) {
    const tableName = isAdmin ? 'recipes' : 'user-recipes'

    const { data, error } = await useSupabase
      .from(tableName)
      .update(updatedRecipeData)
      .eq('id', recipeId)

    if (error) throw new Error(error.message)

    return data
  }

  async deleteProduct ({
    productId,
    isAdmin = false
  }: {
    productId: string
    isAdmin?: boolean
  }) {
    const tableName = isAdmin ? 'products' : 'user-products'

    const { data, error } = await useSupabase
      .from(tableName)
      .delete()
      .eq('id', productId)

    if (error) throw new Error(error.message)

    return data
  }

  async deleteRecipe ({
    recipeId,
    isAdmin = false
  }: {
    recipeId: string
    isAdmin?: boolean
  }) {
    const tableName = isAdmin ? 'recipes' : 'user-recipes'

    const { data, error } = await useSupabase
      .from(tableName)
      .delete()
      .eq('id', recipeId)

    if (error) throw new Error(error.message)

    return data
  }

  async createProduct ({
    product,
    isAdmin = false
  }: {
    product: Partial<IProduct>
    isAdmin?: boolean
  }) {
    const tableName = isAdmin ? 'products' : 'user-products'

    const { data, error } = await useSupabase
      .from(tableName)
      .insert(product)
      .select()
      .single()

    if (error) throw new Error(error.message)

    return data
  }

  async createRecipe ({
    recipe,
    isAdmin = false
  }: {
    recipe: Partial<IRecipe>
    isAdmin?: boolean
  }) {
    const tableName = isAdmin ? 'recipes' : 'user-recipes'

    const { data, error } = await useSupabase
      .from(tableName)
      .insert(recipe)
      .select()
      .single()

    if (error) throw new Error(error.message)

    return data
  }
}

export const productsAndRecipesService = new ProductsAndRecipesService()
