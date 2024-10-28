export const useGeneralStore = defineStore('generalStore', () => {
  const pageLoading = ref(true)
  return {
    pageLoading
  }
})
