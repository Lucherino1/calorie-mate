import { showNotification } from '@/helpers'

class DashboardService {
  async getUserDashboard (date?: string, userId?: string): Promise<IDashboard> {
    const { data, error } = await useSupabase.from('dashboard').select('*').eq('date', `${date}`).eq('userId', `${userId}`).single()

    if (error || !data) {
      return await this.createEmptyDashboard(date, userId)
    }

    return data
  }

  async createEmptyDashboard (date: string, userId: string): Promise<IDashboard> {
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
    try {
      const { data, error } = await useSupabase.from('dashboard').insert([newDashboard]).select()
      if (error) {
        throw new Error(error.message)
      }
      return data[0]
    } catch (error) {
      showNotification(error.message, 'Please try again later.')
    }
  }
}

export const dashboardService = new DashboardService()