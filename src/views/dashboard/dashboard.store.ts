import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboardStore', () => {
  const route = useRoute()
  const date = ref((route.query.date || new Date().toISOString().split('T')[0]).toString())

  return {
    date
  }
})
