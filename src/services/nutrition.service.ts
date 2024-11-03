import { roundToNearestTen } from '@/helpers'

class NutritionService {
  calcBMR = (weight: number, height: number, age: number, sex: TSex): number => {
    const bmr = sex === 'male'
      ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
      : 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age
    return roundToNearestTen(bmr)
  }

  calcTDEE = (bmr: number, activityLevel: number): number => {
    return roundToNearestTen(bmr * activityLevel)
  }

  calcGoalCalories = (currentWeight: number, goalWeight: number, tdee: number): number => {
    const weightDifference = currentWeight - goalWeight

    let goalCalories
    if (weightDifference > 0) {
      // down
      goalCalories = tdee * (1 - Math.min(0.2, weightDifference * 0.02))
    } else if (weightDifference < 0) {
      // up
      goalCalories = tdee * (1 + Math.min(0.2, Math.abs(weightDifference) * 0.02))
    } else {
      // keep
      goalCalories = tdee
    }
    return roundToNearestTen(goalCalories)
  }

  calcTargetNutritionDetails = (calories: number) => {
    return {
      calories: roundToNearestTen(calories),
      fats: roundToNearestTen(calories * 0.25 / 9),
      carbs: roundToNearestTen(calories * 0.5 / 4),
      proteins: roundToNearestTen(calories * 0.25 / 4)
    }
  }

  calcTargetNutritionDetailsByMeal = (targetNutritionDetails: INutritionDetails) => {
    const mealDistribution: Record<TMealType, number> = {
      breakfast: 0.3,
      lunch: 0.35,
      dinner: 0.25,
      snacks: 0.1
    }

    const targetNutritionDetailsByMeal = Object.entries(mealDistribution).reduce(
      (acc, [meal, percentage]) => {
        acc[meal as TMealType] = {
          calories: roundToNearestTen(targetNutritionDetails.calories * percentage),
          fats: roundToNearestTen(targetNutritionDetails.fats * percentage),
          carbs: roundToNearestTen(targetNutritionDetails.carbs * percentage),
          proteins: roundToNearestTen(targetNutritionDetails.proteins * percentage)
        }
        return acc
      },
      {} as ITargetNutritionDetailsByMeal
    )
    return targetNutritionDetailsByMeal
  }

  // Eaten calculations:

  calcNutritionPerGrams = (nutritionDetails: INutritionDetails, grams: number) => {
    const factor = grams / 100
    return Object.keys(nutritionDetails).reduce((acc, key) => {
      acc[key] = Math.round(nutritionDetails[key] * factor)
      return acc
    }, {} as INutritionDetails)
  }

  calcIngredientsNutrition = (ingredients: IProduct[], portionCount: number) => {
    return ingredients.reduce((totals, ingredient) => {
      const { calories, proteins, carbs, fats } = ingredient.nutritionDetails
      totals.calories += Math.round((calories || 0) * portionCount)
      totals.proteins += Math.round((proteins || 0) * portionCount)
      totals.carbs += Math.round((carbs || 0) * portionCount)
      totals.fats += Math.round((fats || 0) * portionCount)
      return totals
    }, { calories: 0, proteins: 0, carbs: 0, fats: 0 } as INutritionDetails)
  }

  calcIngredientNutrition = (ingredient: IProduct, portionCount: number) => {
    return {
      ...ingredient,
      nutritionDetails: {
        calories: Math.round((ingredient.nutritionDetails.calories || 0) * portionCount),
        proteins: Math.round((ingredient.nutritionDetails.proteins || 0) * portionCount),
        carbs: Math.round((ingredient.nutritionDetails.carbs || 0) * portionCount),
        fats: Math.round((ingredient.nutritionDetails.fats || 0) * portionCount)
      }
    }
  }

  calcTotalNutritious = (dashboard: IDashboard) => {
    const totals = { calories: 0, proteins: 0, carbs: 0, fats: 0 }
    if (!dashboard) return totals

    for (const meal of dashboard.meals) {
      if (Array.isArray(meal.products)) {
        for (const product of meal.products) {
          const grams = product.grams || 100
          const updatedProduct = this.calcIngredientNutrition(product, grams / 100).nutritionDetails
          totals.calories += updatedProduct.calories
          totals.proteins += updatedProduct.proteins
          totals.carbs += updatedProduct.carbs
          totals.fats += updatedProduct.fats
        }
      }

      if (Array.isArray(meal.recipes)) {
        for (const recipe of meal.recipes) {
          const portionCount = recipe.portions || 1
          if (Array.isArray(recipe.ingredients)) {
            for (const ingredient of recipe.ingredients) {
              const updatedIngredient = this.calcIngredientNutrition(ingredient, portionCount).nutritionDetails
              totals.calories += updatedIngredient.calories
              totals.proteins += updatedIngredient.proteins
              totals.carbs += updatedIngredient.carbs
              totals.fats += updatedIngredient.fats
            }
          }
        }
      }
    }

    return {
      calories: Math.round(totals.calories),
      proteins: Math.round(totals.proteins),
      carbs: Math.round(totals.carbs),
      fats: Math.round(totals.fats)
    }
  }

  calcNutritiousByMeals = (dashboard: IDashboard) => {
    const totalMealsData = {
      breakfast: { calories: 0, itemsCount: 0 },
      lunch: { calories: 0, itemsCount: 0 },
      dinner: { calories: 0, itemsCount: 0 },
      snacks: { calories: 0, itemsCount: 0 }
    }
    if (!dashboard) return totalMealsData

    dashboard.meals.forEach((meal) => {
      const products = meal.products || []
      const recipes = meal.recipes || []

      const productCals = products.reduce((sum, product) => {
        const grams = product.grams || 100
        const updatedProduct = this.calcIngredientNutrition(product, grams / 100).nutritionDetails
        return sum + updatedProduct.calories
      }, 0)

      const recipeCals = recipes.reduce((sum, recipe) => {
        const portionCount = recipe.portions || 1
        const ingredients = recipe.ingredients || []
        const ingredientsCals = ingredients.reduce((acc, item) => {
          const updatedIngredient = this.calcIngredientNutrition(item, portionCount).nutritionDetails
          return acc + updatedIngredient.calories
        }, 0)
        return sum + ingredientsCals
      }, 0)

      if (totalMealsData[meal.type]) {
        totalMealsData[meal.type].calories += productCals + recipeCals
        totalMealsData[meal.type].itemsCount += products.length + recipes.length
      }
    })

    return totalMealsData
  }

  calcRemainingCalories = (dashboard: IDashboard, targetCalories: number) => {
    const totalNutrition = this.calcTotalNutritious(dashboard)
    return targetCalories - totalNutrition.calories
  }

  calcNutrientPercentage = (dashboard: IDashboard, targetNutrition: INutritionDetails) => {
    const totalNutrition = this.calcTotalNutritious(dashboard)

    return {
      calories: roundToNearestTen((totalNutrition.calories / targetNutrition.calories) * 100),
      fats: roundToNearestTen((totalNutrition.fats / targetNutrition.fats) * 100),
      carbs: roundToNearestTen((totalNutrition.carbs / targetNutrition.carbs) * 100),
      proteins: roundToNearestTen((totalNutrition.proteins / targetNutrition.proteins) * 100)
    }
  }

  calcMealCaloriesPercentage =
    (dashboard: IDashboard, targetNutritionByMeal: ITargetNutritionDetailsByMeal) => {
      const nutritionByMeal = this.calcNutritiousByMeals(dashboard)
      const percentages: Record<keyof ITargetNutritionDetailsByMeal, number> =
      { breakfast: 0, lunch: 0, dinner: 0, snacks: 0 }

      for (const meal in targetNutritionByMeal) {
        const target = targetNutritionByMeal[meal as keyof ITargetNutritionDetailsByMeal]
        if (target) {
          const targetCalories = target.calories

          const consumedCalories = nutritionByMeal[meal as keyof typeof nutritionByMeal]

          percentages[meal] = Math.min(roundToNearestTen((consumedCalories.calories / targetCalories) * 100), 100)
        }
      }

      return percentages
    }
}

export const nutritionService = new NutritionService()
