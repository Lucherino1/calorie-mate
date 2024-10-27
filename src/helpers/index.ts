import { ElNotification } from 'element-plus'

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

export const calculateTargetNutritionDetailsByMeal = (targetNutritionDetails: INutritionDetails) => {
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

export function createSignUpPayload (
  bodyDetailsFormData: Partial<IBodyDetails>,
  profileFormData: IProfileFields
): ISignUpPayload | null {
  if (Object.values(bodyDetailsFormData).some(value => value == null)) {
    console.error('Some fields in bodyDetailsFormData are missing')
    return null
  }

  const validatedBodyDetails = bodyDetailsFormData as IBodyDetails

  const bmr = calculateBMR(
    validatedBodyDetails.currentWeight,
    validatedBodyDetails.height,
    validatedBodyDetails.age,
    validatedBodyDetails.sex
  )

  const tdee = calculateTDEE(bmr, validatedBodyDetails.activityLevel)
  const goalCalories = calculateGoalCalories(
    validatedBodyDetails.currentWeight,
    validatedBodyDetails.goalWeight,
    tdee
  )

  const targetNutritionDetails = calculateTargetNutritionDetails(goalCalories)
  const targetNutritionDetailsByMeal = calculateTargetNutritionDetailsByMeal(targetNutritionDetails)

  const payload: ISignUpPayload = {
    email: profileFormData.email,
    password: profileFormData.password,
    metadata: {
      firstName: profileFormData.firstName,
      lastName: profileFormData.lastName,
      bodyDetails: validatedBodyDetails,
      targetNutritionDetails,
      targetNutritionDetailsByMeal
    }
  }

  return payload
}

export function showWarningNotification (message: string, title: string = 'Error') {
  ElNotification({
    title,
    message,
    type: 'error',
    showClose: true,
    offset: 50
  })
}
