import { showWarningNotification } from '@/helpers'
import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboardStore', () => {
  const dashboardPageLoading = ref(false)
  const authStore = useAuthStore()
  const userId = computed(() => authStore.user?.id)

  const date = ref(new Date().toISOString().split('T')[0])
  const userDashboard = ref<TNullable<IDashboard>>(null)

  const calsEaten = computed(() => nutritionService.calcTotalNutritious(userDashboard.value))
  const calsAndItemsEatenByMeal = computed(() => nutritionService.calcNutritiousByMeals(userDashboard.value))

  const getUserDashboard = async (selectedDate: string) => {
    dashboardPageLoading.value = true
    if (!userId.value) return

    const { data, error } = await dashboardService.getUserDashboard(selectedDate)
    if (error) {
      showWarningNotification('Oops! Something went wrong. Please try again later.')
      dashboardPageLoading.value = false
      return
    }

    if (data && data.length > 0) {
      userDashboard.value = data[0]
      dashboardPageLoading.value = false
    } else {
      try {
        const newDashboard = await dashboardService.createEmptyDashboard(selectedDate, userId.value)
        userDashboard.value = newDashboard
      } catch (error) {
        showWarningNotification('Oops! Something went wrong. Please try again later.')
        console.error('Error creating a new dashboard:', error)
      }
    }
    dashboardPageLoading.value = false
  }
  return {
    date,
    userDashboard,
    getUserDashboard,
    dashboardPageLoading,
    calsEaten,
    calsAndItemsEatenByMeal
  }
})
