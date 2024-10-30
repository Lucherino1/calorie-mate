class DashboardService {
  getUserDashboard (date?: string) {
    return useSupabase.from('dashboard').select('*').eq('date', `${date}`)
  }

  async createEmptyDashboard (date: string, userId: string): Promise<IDashboard> {
    const newDashboard: Partial<IDashboard> = {
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

    const { data, error } = await useSupabase
      .from('dashboard')
      .insert([newDashboard])
      .select()

    if (error) {
      throw new Error('Failed to create a new dashboard')
    }

    return data[0]
  }
}

export const dashboardService = new DashboardService()
