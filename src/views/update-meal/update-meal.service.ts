class UpdateMealService {
  getUserMeals = async (date: string, mealType?: TMealType) => {
    const authStore = useAuthStore()

    const { data, error } = await useSupabase.from('dashboard').select('meals').eq('userId', authStore.user.id).eq('date', date)

    if (error) throw new Error(error.message)

    if (data && data.length > 0) {
      if (mealType) {
        const filteredMeals = data[0]?.meals.filter((meal: IMeals) => meal.type === mealType)

        return filteredMeals.length ? filteredMeals[0] : this.createNewMeal(mealType)
      }
      return data[0]?.meals || []
    }

    return this.createNewMeal(mealType)
  }

  createNewMeal = (mealType: TMealType): IMeals => {
    return {
      type: mealType,
      products: [],
      recipes: []
    }
  }

  async updateMeal ({
    date,
    mealType,
    newItem,
    mealComponent,
    currentMealData
  }: {
    date: string
    mealType: TMealType
    newItem: IProduct | IRecipe
    mealComponent: TMealComponent
    currentMealData?: IMeals
  }): Promise<IMeals[]> {
    const authStore = useAuthStore()

    const mealData = currentMealData || (await this.getUserMeals(date, mealType))

    if (mealData) {
      const updatedItems = mealData[mealComponent].map(item =>
        item.id === newItem.id ? newItem : item
      )

      if (!mealData[mealComponent].some(item => item.id === newItem.id)) {
        updatedItems.push(newItem)
      }

      const updatedMeal = {
        ...mealData,
        [mealComponent]: updatedItems
      }

      const mealsData = await this.getUserMeals(date)
      const updatedMeals = mealsData.map((meal: IMeals) => (meal.type === mealType ? updatedMeal : meal))

      const { error } = await useSupabase
        .from('dashboard')
        .update({ meals: updatedMeals })
        .eq('userId', authStore.user.id)
        .eq('date', date)

      if (error) throw new Error(error.message)

      return updatedMeals
    } else {
      throw new Error('No data found for the specified date or meal type')
    }
  }

  removeProduct = async ({
    date,
    mealType,
    productId,
    mealComponent
  }: {
    date: string
    mealType: TMealType
    productId: string
    mealComponent: TMealComponent
  }) => {
    const authStore = useAuthStore()
    const mealData = await this.getUserMeals(date, mealType)

    if (mealData) {
      const updatedItems = mealData[mealComponent].filter((item: any) => item.id !== productId)

      const updatedMeal = {
        ...mealData,
        [mealComponent]: updatedItems
      }

      const mealsData = await this.getUserMeals(date)
      const updatedMeals = mealsData.map((meal: IMeals) => (meal.type === mealType ? updatedMeal : meal))

      const { data: updateData, error: updateError } = await useSupabase
        .from('dashboard')
        .update({ meals: updatedMeals })
        .eq('userId', authStore.user.id)
        .eq('date', date)

      if (updateError) throw new Error(updateError.message)

      return updateData
    } else {
      throw new Error('No data found for the specified date or meal type')
    }
  }

  calculateTotalNutrients (products, recipes) {
    const totalNutrients = {
      calories: 0,
      proteins: 0,
      fats: 0,
      carbs: 0
    }

    products.forEach(product => {
      const grams = product.grams || 100
      const productNutrition = nutritionService.calcNutritionPerGrams(
        product.nutritionDetails,
        grams
      )

      Object.keys(totalNutrients).forEach(key => {
        totalNutrients[key] += productNutrition[key] || 0
      })
    })

    recipes.forEach(recipe => {
      const portionCount = recipe.portions || 1

      recipe.ingredients.forEach(ingredient => {
        const grams = ingredient.grams || 100
        const ingredientNutrition = nutritionService.calcNutritionPerGrams(
          ingredient.nutritionDetails,
          grams
        )

        Object.keys(totalNutrients).forEach(key => {
          totalNutrients[key] += (ingredientNutrition[key] || 0) * portionCount
        })
      })
    })

    return Object.fromEntries(
      Object.entries(totalNutrients).map(([key, value]) => [key, Math.round(value)])
    )
  }

  calculateCaloriesPercentage (targetCalories: number, totalCalories: number) {
    return targetCalories ? Math.round(totalCalories / targetCalories * 100) : 0
  }
}

export const updateMealService = new UpdateMealService()
