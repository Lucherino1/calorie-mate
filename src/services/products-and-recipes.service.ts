class ProductsAndRecipesService {
  async getGlobalProducts () {
    const { data, error } = await useSupabase.from('products').select('*')
    if (error) throw new Error(error.message)
    return data
  }

  async getGlobalRecipes () {
    const { data, error } = await useSupabase.from('recipes').select('*')
    if (error) throw new Error(error.message)
    return data
  }

  async getUserProduct () {
    const { data, error } = await useSupabase.from('user-products').select('*')
    if (error) throw new Error(error.message)
    return data
  }

  async getUserRecipes () {
    const { data, error } = await useSupabase.from('user-recipes').select('*')
    if (error) throw new Error(error.message)
    return data
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

  async getPaginatedProducts (limit: number, offset: number, typeFilter?: string) {
    const authStore = useAuthStore()
    const tableName = authStore.isUserAdmin ? 'products' : 'user-products'

    let query = useSupabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)

    if (typeFilter) {
      query = query.eq('type', typeFilter)
    }

    const { data, count, error } = await query
    if (error) throw new Error(error.message)

    return { data, count }
  }

  async getPaginatedRecipes (limit: number, offset: number, typeFilter?: string) {
    const authStore = useAuthStore()
    const tableName = authStore.isUserAdmin ? 'recipes' : 'user-recipes'

    let query = useSupabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)

    if (typeFilter) {
      query = query.eq('type', typeFilter)
    }

    const { data, count, error } = await query
    if (error) throw new Error(error.message)

    return { data, count }
  }

  async searchRecipes (searchQuery: string, typeFilter?: string, limit?: number, offset?: number) {
    const authStore = useAuthStore()
    const tableName = authStore.isUserAdmin ? 'recipes' : 'user-recipes'

    let query = useSupabase
      .from(tableName)
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

  async searchProducts (searchQuery: string, typeFilter?: string, limit?: number, offset?: number) {
    const authStore = useAuthStore()
    const tableName = authStore.isUserAdmin ? 'products' : 'user-products'

    let query = useSupabase
      .from(tableName)
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
    const authStore = useAuthStore()
    const tableName = authStore.isUserAdmin ? 'products' : 'user-products'

    const { data, error } = await useSupabase
      .from(tableName)
      .update(updatedProductData)
      .eq('id', productId)

    if (error) throw new Error(error.message)

    return data
  }

  async updateRecipe (recipeId: string, updatedRecipeData: Partial<IRecipe>) {
    const authStore = useAuthStore()
    const tableName = authStore.isUserAdmin ? 'recipes' : 'user-recipes'

    const { data, error } = await useSupabase
      .from(tableName)
      .update(updatedRecipeData)
      .eq('id', recipeId)

    if (error) throw new Error(error.message)

    return data
  }

  async deleteProduct (productId: string) {
    const authStore = useAuthStore()
    const tableName = authStore.isUserAdmin ? 'products' : 'user-products'

    const { data, error } = await useSupabase
      .from(tableName)
      .delete()
      .eq('id', productId)

    if (error) throw new Error(error.message)

    return data
  }

  async deleteRecipe (recipeId: string) {
    const authStore = useAuthStore()
    const tableName = authStore.isUserAdmin ? 'recipes' : 'user-recipes'

    const { data, error } = await useSupabase
      .from(tableName)
      .delete()
      .eq('id', recipeId)

    if (error) throw new Error(error.message)

    return data
  }

  async createProduct (product: Partial<IProduct>) {
    const authStore = useAuthStore()
    const tableName = authStore.isUserAdmin ? 'products' : 'user-products'

    const { data, error } = await useSupabase
      .from(tableName)
      .insert(product)
      .select()
      .single()

    if (error) throw new Error(error.message)

    return data
  }

  async createRecipe (recipe: Partial<IRecipe>) {
    const authStore = useAuthStore()
    const tableName = authStore.isUserAdmin ? 'recipes' : 'user-recipes'

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
