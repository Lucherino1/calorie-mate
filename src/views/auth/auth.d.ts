interface ISignInPayload {
  email: string
  password: string
}

interface ISignUpPayload {
  email: string
  password: string
  firstName: string
  lastName: string
  age: number
  sex: TSex
  height: number
  currentWeight: number
  goalWeight: number
}
