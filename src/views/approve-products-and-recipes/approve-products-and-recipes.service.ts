class ApproveService {
  async getPendingApprovalProducts () {
    const { data, error } = await useSupabase
      .from('user-products')
      .select('*')
      .eq('isUnderReview', true)

    if (error) {
      throw new Error(`Error fetching pending approval products: ${error.message}`)
    }

    return data
  }
}

export const approveService = new ApproveService()
