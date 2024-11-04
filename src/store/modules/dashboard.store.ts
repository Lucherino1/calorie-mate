import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboardStore', () => {
  const route = useRoute()
  const date = ref(route.query.date.toString() || new Date().toISOString().split('T')[0])

  return {
    date
  }
})
