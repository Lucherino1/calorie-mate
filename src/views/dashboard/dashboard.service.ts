class DashboardService {
  async getUserDashboard (date?: string): Promise<IDashboard> {
    const authStore = useAuthStore()
    const { data, error } = await useSupabase.from('dashboard').select('*').eq('date', `${date}`).eq('userId', `${authStore.user.id}`)

    if (error) throw new Error(error.message)

    if (!data.length) {
      return await this.createEmptyDashboard(date)
    }

    return data[0]
  }

  async createEmptyDashboard (date: string): Promise<IDashboard> {
    const authStore = useAuthStore()
    const userId = authStore.user.id

    const newDashboard: Omit<IDashboard, 'id'> = {
      date,
      userId,
      waterAmount: 0,
      meals: [
        { products: [], recipes: [], type: 'breakfast' },
        { products: [], recipes: [], type: 'lunch' },
        { products: [], recipes: [], type: 'dinner' },
        { products: [], recipes: [], type: 'snacks' }
      ]
    }

    const { data, error } = await useSupabase.from('dashboard').insert([newDashboard]).select().single()
    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  async updateWaterAmount (date: string, waterAmount: number): Promise<void> {
    const authStore = useAuthStore()

    const { error } = await useSupabase
      .from('dashboard')
      .update({ waterAmount })
      .eq('date', date)
      .eq('userId', authStore.user.id)

    if (error) {
      throw new Error(error.message)
    }
  }
}

export const dashboardService = new DashboardService()
