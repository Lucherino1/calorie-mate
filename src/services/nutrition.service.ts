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

  calcTotalNutritious = (dashboard: IDashboard) => {
    const totals = { calories: 0, proteins: 0, carbs: 0, fats: 0 }
    if (!dashboard) return totals

    for (const meal of dashboard.meals) {
      if (Array.isArray(meal.products)) {
        for (const product of meal.products) {
          totals.calories += product.nutritionDetails.calories
          totals.proteins += product.nutritionDetails.proteins
          totals.carbs += product.nutritionDetails.carbs
          totals.fats += product.nutritionDetails.fats
        }
      }

      if (Array.isArray(meal.recipes)) {
        for (const recipe of meal.recipes) {
          if (Array.isArray(recipe.ingredients)) {
            for (const ingredient of recipe.ingredients) {
              totals.calories += ingredient.nutritionDetails.calories
              totals.proteins += ingredient.nutritionDetails.proteins
              totals.carbs += ingredient.nutritionDetails.carbs
              totals.fats += ingredient.nutritionDetails.fats
            }
          }
        }
      }
    }

    return {
      calories: roundToNearestTen(totals.calories),
      proteins: roundToNearestTen(totals.proteins),
      carbs: roundToNearestTen(totals.carbs),
      fats: roundToNearestTen(totals.fats)
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

      const productCals = products.reduce((sum, product) => sum + (product.nutritionDetails?.calories || 0), 0)

      const recipeCals = recipes.reduce((sum, recipe) => {
        const ingredients = recipe.ingredients || []
        const ingredientsCals = ingredients.reduce((acc, item) => acc + (item.nutritionDetails?.calories || 0), 0)
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

          percentages[meal] = roundToNearestTen((consumedCalories.calories / targetCalories) * 100)
        }
      }

      return percentages
    }
}

export const nutritionService = new NutritionService()
