import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboardStore', () => {
  const date = ref(new Date().toISOString().split('T')[0])

  return {
    date
  }
})
