class ApproveService {
  async getPendingApprovalProducts () {
    const { data, error } = await useSupabase
      .from('user-products')
      .select('*')
      .eq('isUnderReview', true)

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  async productReview ({ id, approve }: { id: string; approve: boolean }) {
    const { data: product, error: fetchError } = await useSupabase
      .from('user-products')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    const { error: updateError } = await useSupabase
      .from('user-products')
      .update({ isUnderReview: false })
      .eq('id', id)
      .select('*')

    if (updateError) throw updateError

    if (approve) {
      const { isUnderReview, userId, ...approvedProduct } = product

      const { error: insertError } = await useSupabase
        .from('products')
        .insert(approvedProduct)

      if (insertError) throw insertError
    }

    const { error: deleteError } = await useSupabase
      .from('user-products')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError
  }

  async getPendingApprovalRecipes () {
    const { data, error } = await useSupabase
      .from('user-recipes')
      .select('*')
      .eq('isUnderReview', true)

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  async recipeReview ({ id, approve }: { id: string; approve: boolean }) {
    const { data: product, error: fetchError } = await useSupabase
      .from('user-recipes')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    const { error: updateError } = await useSupabase
      .from('user-recipes')
      .update({ isUnderReview: false })
      .eq('id', id)
      .select('*')

    if (updateError) throw updateError

    if (approve) {
      const { isUnderReview, userId, ...approvedProduct } = product

      const { error: insertError } = await useSupabase
        .from('recipes')
        .insert(approvedProduct)

      if (insertError) throw insertError
    }

    const { error: deleteError } = await useSupabase
      .from('user-recipes')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError
  }
}

export const approveService = new ApproveService()
