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
