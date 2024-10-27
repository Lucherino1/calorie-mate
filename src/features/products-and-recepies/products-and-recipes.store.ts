import { defineStore } from 'pinia'
import { showWarningNotification } from '@/helpers'
import type { IProduct, IRecipe, IUserProduct, IUserRecipe } from './products-and-recipes'
import { recipesAndProductsService } from './products-and-recipes.service'

export const useRecipesAndProductsStore = defineStore('recipesAndProductsStore', () => {
  const allProducts = ref<IProduct[]>([])
  const userProducts = ref<IUserProduct[]>([])

  const allRecipes = ref<IRecipe[]>([])
  const userRecipes = ref<IUserRecipe[]>([])

  const { user } = useAuthStore()

  const getAllProducts = async () => {
    try {
      const { data, error } = await recipesAndProductsService.getAllProducts()
      console.log(data)
      if (data?.length) {
        allProducts.value = data
      }
      console.log(allProducts)
      // if (error || !data) {
      //   console.error(error?.message)
      //   throw new Error(error.message)
      // }

      return data
    } catch (error) {
      showWarningNotification((error as Error).message, 'Fetching products error')
    }
  }

  const getUserProducts = async () => {
    if (!user) return

    try {
      const { data, error } = await recipesAndProductsService.getUserProducts(user?.id)

      if (data?.length) {
        userProducts.value = data
      }
      console.log(userProducts.value)
      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      showWarningNotification((error as Error).message, 'Fetching products error')
    }
  }

  const getAllRecipes = async () => {
    try {
      const { data, error } = await recipesAndProductsService.getAllRecipes()

      if (data?.length) {
        allRecipes.value = data
      }

      if (error || !data) {
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      showWarningNotification((error as Error).message, 'Fetching recipes error')
    }
  }

  const gerUserRecipes = async () => {
    if (!user) return

    try {
      const { data, error } = await recipesAndProductsService.getUserRecipes(user?.id)

      if (data?.length) {
        userRecipes.value = data
      }

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      showWarningNotification((error as Error).message, 'Fetching recipes error')
    }
  }

  const addProductToMeal = async (product: IProduct) => {
    try {
      await addProductToMeal(product)
        .then(data => console.log(data))

      getUserProducts()
    } catch (error) {
      showWarningNotification((error as Error).message, 'Failed to add product')
    }
  }
  return {
    allProducts,
    getAllProducts,
    getUserProducts,
    getAllRecipes,
    gerUserRecipes,
    addProductToMeal
  }
})
