class UpdateMealService {
  getUserMeals = async (userId: string, date: string, mealType?: TMealType) => {
    const { data, error } = await useSupabase.from('dashboard').select('meals').eq('userId', userId).eq('date', date)

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

  async updateMeal (
    userId: string,
    date: string,
    mealType: TMealType,
    newItem: IProduct | IRecipe,
    mealComponent: TMealComponent,
    currentMealData?: IMeals
  ): Promise<IMeals[]> {
    const mealData = currentMealData || (await this.getUserMeals(userId, date, mealType))

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

      const mealsData = await this.getUserMeals(userId, date)
      const updatedMeals = mealsData.map((meal: IMeals) => (meal.type === mealType ? updatedMeal : meal))

      const { error } = await useSupabase
        .from('dashboard')
        .update({ meals: updatedMeals })
        .eq('userId', userId)
        .eq('date', date)

      if (error) throw new Error(error.message)

      return updatedMeals
    } else {
      throw new Error('No data found for the specified date or meal type')
    }
  }

  removeProduct = async (
    userId: string,
    date: string,
    mealType: TMealType,
    productId: string,
    mealComponent: TMealComponent
  ) => {
    const mealData = await this.getUserMeals(userId, date, mealType)

    if (mealData) {
      const updatedItems = mealData[mealComponent].filter((item: any) => item.id !== productId)

      const updatedMeal = {
        ...mealData,
        [mealComponent]: updatedItems
      }

      const mealsData = await this.getUserMeals(userId, date)
      const updatedMeals = mealsData.map((meal: IMeals) => (meal.type === mealType ? updatedMeal : meal))

      const { data: updateData, error: updateError } = await useSupabase
        .from('dashboard')
        .update({ meals: updatedMeals })
        .eq('userId', userId)
        .eq('date', date)

      if (updateError) throw new Error(updateError.message)

      return updateData
    } else {
      throw new Error('No data found for the specified date or meal type')
    }
  }

  calculateTotalNutrients (products: IProduct[], recipes: IRecipe[]) {
    const totalNutrients = {
      calories: 0,
      proteins: 0,
      fats: 0,
      carbs: 0
    }

    products.forEach(product => {
      const grams = product.grams || 100
      const scale = grams / 100

      Object.keys(totalNutrients).forEach(key => {
        totalNutrients[key] += Math.round((product.nutritionDetails[key] || 0) * scale)
      })
    })

    recipes.forEach(recipe => {
      const portionCount = recipe.portions || 1
      recipe.ingredients.forEach(ingredient => {
        const grams = ingredient.grams || 100
        const scale = grams / 100

        Object.keys(totalNutrients).forEach(key => {
          totalNutrients[key] += Math.round(((ingredient.nutritionDetails[key] || 0) * scale) * portionCount)
        })
      })
    })

    return totalNutrients
  }

  calculateCaloriesPercentage (targetCalories: number, totalCalories: number) {
    return targetCalories ? Math.round(totalCalories / targetCalories * 100) : 0
  }
}

export const updateMealService = new UpdateMealService()
