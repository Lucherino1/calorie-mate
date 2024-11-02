class UpdateMealService {
  getUserMeals = async (userId: string, date: string, mealType?: TMealType) => {
    const { data, error } = await useSupabase.from('dashboard').select('meals').eq('userId', userId).eq('date', date)

    if (error) throw new Error(error.message)

    if (data && mealType) {
      const filteredMeals = data[0]?.meals.filter((meal: IMeals) => meal.type === mealType)
      return filteredMeals.length ? filteredMeals[0] : null
    }

    return data ? data[0]?.meals : []
  }

  updateMeal = async (
    userId: string,
    date: string,
    mealType: TMealType,
    newItem: IUpdateProduct,
    mealComponent: TMealComponent
  ): Promise<IMeals[]> => {
    const mealData = await this.getUserMeals(userId, date, mealType)

    if (mealData) {
      const updatedItems = mealData[mealComponent].map((item) =>
        item.id === newItem.id ? newItem : item
      )

      const itemExists = mealData[mealComponent].some((item) => item.id === newItem.id)
      if (!itemExists) {
        updatedItems.push(newItem)
      }

      const updatedMeal = {
        ...mealData,
        [mealComponent]: updatedItems
      }

      const mealsData = await this.getUserMeals(userId, date)
      const updatedMeals = mealsData.map((meal: IMeals) => (meal.type === mealType ? updatedMeal : meal))

      const { data: updateData, error } = await useSupabase
        .from('dashboard')
        .update({ meals: updatedMeals })
        .eq('userId', userId)
        .eq('date', date)

      if (error) throw new Error(error.message)

      return updateData
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
}

export const updateMealService = new UpdateMealService()
