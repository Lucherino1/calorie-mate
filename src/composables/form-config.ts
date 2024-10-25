import type { FormInstance, FormItemRule, FormRules } from 'element-plus'

// --------------------------------------------- F O R M  R E F --------------------------------------------------------
export function useElFormRef (initialValue: any = null) {
  return ref<FormInstance>(initialValue)
}

// --------------------------------------------- F O R M  M O D E L ----------------------------------------------------
export function useElFormModel<T extends object> (model: T) {
  return reactive<T>(model)
}

// ------------------------------------------- F O R M  R U L E S ------------------------------------------------------
export function useElFormRules (model: FormRules) {
  return reactive(model)
}

export function useRequiredRule ({ required = true } = {}) {
  return { required, message: 'This field is required', trigger: 'change' } as FormItemRule
}

export function useEmailRule () {
  return { type: 'email', message: 'Invalid email', trigger: ['change', 'blur'] } as FormItemRule
}

export function useMinLenRule (min: number): FormItemRule {
  return { min, message: `Min length is ${min}`, trigger: 'change' }
}

export function useMaxLenRule (max: number): FormItemRule {
  return { max, message: `Max length is ${max}`, trigger: 'change' }
}

export function useConfirmPasswordRule (formModel: { password: string }): FormItemRule {
  return {
    validator: (rule: FormItemRule, value: string, callback: (error?: Error) => void) => {
      if (value !== formModel.password) {
        callback(new Error('Passwords do not match'))
      } else {
        callback()
      }
    },
    trigger: 'change'
  } as FormItemRule
}

export function useCurrentWeightRule (minWeight: number = 35, maxWeight: number = 700): FormItemRule {
  return {
    validator: (rule: FormItemRule, value: number, callback: (error?: Error) => void) => {
      if (value < minWeight) {
        callback(new Error(`Are you sure that's correct? Your starting weight should be at least ${minWeight} kg.`))
      } else if (value > maxWeight) {
        callback(new Error(`That seems a bit high! Please enter a weight under ${maxWeight} kg.`))
      } else {
        callback()
      }
    },
    trigger: ['change', 'blur']
  } as FormItemRule
}

export function useGoalWeightRule (minWeight: number = 35, maxWeight: number = 700): FormItemRule {
  return {
    validator: (rule: FormItemRule, value: number, callback: (error?: Error) => void) => {
      if (value < minWeight) {
        callback(new Error("That's too low!"))
      } else if (value > maxWeight) {
        callback(new Error(`That seems a bit high! Please enter a weight under ${maxWeight} kg.`))
      } else {
        callback()
      }
    },
    trigger: ['change', 'blur']
  } as FormItemRule
}

export function useHeightRangeRule (minHeight: number = 50, maxHeight: number = 300): FormItemRule {
  return {
    validator: (rule: FormItemRule, value: number, callback: (error?: Error) => void) => {
      if (value < minHeight || value > maxHeight) {
        callback(new Error("That can't be right! We bet your height is between 50cm and 300cm."))
      } else {
        callback()
      }
    },
    trigger: ['change', 'blur']
  } as FormItemRule
}

export function useMinAgeRule (minAge: number = 16): FormItemRule {
  return {
    validator: (rule: FormItemRule, value: number, callback: (error?: Error) => void) => {
      if (value < minAge) {
        callback(new Error('A young growing body cannot be subjected to calorie counting.'))
      } else {
        callback()
      }
    },
    trigger: ['change', 'blur']
  } as FormItemRule
}
