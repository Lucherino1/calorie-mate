type TIndexedObject<T = any> = {
  [key: string]: T
}

type TNullable<T> = null | T

type TCallbackFn<T extends unknown[] = [], R = void> = (...args: T) => R

type TFormatterFunction<T> = (row: T) => (number | string)
type TTableHeadings<T = Record<string, any>> = Array<{
  label: string
  value: string
  sort?: boolean
  width?: number
  minWidth?: number
  fixed?: boolean | 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  showOverflowTooltip?: boolean
  sortMethod?: (a: number, b: number) => number
  formatter?: (row: T) => (number | string)
}>

type TRouteNames = keyof typeof import('@/router/route-names').routeNames

type TSex = 'male' | 'female'

interface IProfileFields {
  email: string
  password: string
  firstName: string
  lastName: string
  confirmPassword: string
}

interface IBodyDetails{
  age: number
  sex: TSex
  activityLevel: number
  height: number
  currentWeight: number
  goalWeight: number
}

interface INutritionDetails {
  calories: number
  fats: number
  carbs: number
  proteins: number
}

interface ITargetNutritionDetailsByMeal {
  breakfast: INutritionDetails
  lunch: INutritionDetails
  dinner: INutritionDetails
  snacks: INutritionDetails
}

type TMealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks'

type TDataBase = IDatabase<IBodyDetails, INutritionDetails, ITargetNutritionDetailsByMeal>
