import { roundToNearestTen } from '@/helpers'

class NutritionService {
  calculateBMR = (weight: number, height: number, age: number, sex: TSex): number => {
    const bmr = sex === 'male'
      ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
      : 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age
    return roundToNearestTen(bmr)
  }

  calculateTDEE = (bmr: number, activityLevel: number): number => {
    return roundToNearestTen(bmr * activityLevel)
  }

  calculateGoalCalories = (currentWeight: number, goalWeight: number, tdee: number): number => {
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

  calculateTargetNutritionDetails = (calories: number) => {
    return {
      calories: roundToNearestTen(calories),
      fats: roundToNearestTen(calories * 0.25 / 9),
      carbs: roundToNearestTen(calories * 0.5 / 4),
      proteins: roundToNearestTen(calories * 0.25 / 4)
    }
  }

  calculateTargetNutritionDetailsByMeal = (targetNutritionDetails: INutritionDetails) => {
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

  calculateTotalNutritious = (dashboard: IDashboard) => {
    return dashboard.meals.reduce((total, meal) => {
      meal.products.forEach((product) => {
        total.calories += product.nutritionDetails.calories
        total.proteins += product.nutritionDetails.proteins
        total.carbs += product.nutritionDetails.carbs
        total.fats += product.nutritionDetails.fats
      })

      meal.recipes.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
          total.calories += ingredient.nutritionDetails.calories
          total.proteins += ingredient.nutritionDetails.proteins
          total.carbs += ingredient.nutritionDetails.carbs
          total.fats += ingredient.nutritionDetails.fats
        })
      })

      return total
    }, {
      calories: 0,
      proteins: 0,
      carbs: 0,
      fats: 0
    })
  }

  calculateNutritiousByMeals = (dashboard: IDashboard) => {
    const totalCalories = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snacks: 0
    }

    dashboard.meals.forEach((meal) => {
      const productCalories = meal.products.reduce((sum, product) => {
        return sum + product.nutritionDetails.calories
      }, 0)

      const recipeCalories = meal.recipes.reduce((sum, recipe) => {
        const ingredientsCalories = recipe.ingredients.reduce((innerSum, ingredient) => {
          return innerSum + ingredient.nutritionDetails.calories
        }, 0)
        return sum + ingredientsCalories
      }, 0)

      totalCalories[meal.type] += productCalories + recipeCalories
    })

    return totalCalories
  }

  calculateRemainingCalories = (dashboard: IDashboard, targetCalories: number) => {
    const totalNutrition = this.calculateTotalNutritious(dashboard)
    return targetCalories - totalNutrition.calories
  }

  calculateNutrientPercentage = (dashboard: IDashboard, targetNutrition: INutritionDetails) => {
    const totalNutrition = this.calculateTotalNutritious(dashboard)

    return {
      calories: roundToNearestTen((totalNutrition.calories / targetNutrition.calories) * 100),
      fats: roundToNearestTen((totalNutrition.fats / targetNutrition.fats) * 100),
      carbs: roundToNearestTen((totalNutrition.carbs / targetNutrition.carbs) * 100),
      proteins: roundToNearestTen((totalNutrition.proteins / targetNutrition.proteins) * 100)
    }
  }

  calculateMealCaloriesPercentage =
    (dashboard: IDashboard, targetNutritionByMeal: Partial<ITargetNutritionDetailsByMeal>) => {
      const nutritionByMeal = this.calculateNutritiousByMeals(dashboard)
      const percentages: Partial<Record<keyof ITargetNutritionDetailsByMeal, number>> = {}

      for (const meal in targetNutritionByMeal) {
        const target = targetNutritionByMeal[meal as keyof ITargetNutritionDetailsByMeal]
        if (target) {
          const targetCalories = target.calories || 1

          const consumedCalories = nutritionByMeal[meal as keyof typeof nutritionByMeal] || 0

          percentages[meal as keyof ITargetNutritionDetailsByMeal] =
          roundToNearestTen((consumedCalories / targetCalories) * 100)
        }
      }

      return percentages
    }
}

export const nutritionService = new NutritionService()
