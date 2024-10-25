function roundToNearestTen (value: number): number {
  return Math.round(value / 10) * 10
}

export const calculateBMR = (weight: number, height: number, age: number, sex: TSex): number => {
  const bmr = sex === 'male'
    ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
    : 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age
  return roundToNearestTen(bmr)
}

export const calculateTDEE = (bmr: number, activityLevel: number): number => {
  return roundToNearestTen(bmr * activityLevel)
}

export const calculateGoalCalories = (currentWeight: number, goalWeight: number, tdee: number): number => {
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

export const calculateTargetNutritionDetails = (calories: number) => {
  return {
    calories: roundToNearestTen(calories),
    fats: roundToNearestTen(calories * 0.25 / 9),
    carbs: roundToNearestTen(calories * 0.5 / 4),
    proteins: roundToNearestTen(calories * 0.25 / 4)
  }
}
