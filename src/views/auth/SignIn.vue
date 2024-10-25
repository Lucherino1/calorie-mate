<template>
  <AuthWrapper
    title-text="Sign In"
    label="Already have an account?"
    toggle-auth-page-btn-text="Sign Up"
    :toggle-auth-page="toggleAuthPage"
    :loading-status="isLoading"
  >
    <p class="text-gray-light">Enter your email and password to sign in!</p>
    <el-form
      ref="formRef"
      :rules="formRules"
      :model="formModel"
      class="mt-[20px] flex flex-col gap-3"
      label-position="top"
      label-width="auto"
      require-asterisk-position="right"
      :size="$elComponentSize.large"
      @submit.prevent="submit"
    >
      <el-form-item label="Email" prop="email" required>
        <el-input
          v-model="formModel.email"
          placeholder="email@example.com"
          type="email"
        />
      </el-form-item>

      <el-form-item label="Password" prop="password" required>
        <el-input
          v-model="formModel.password"
          placeholder="Min. 8 characters"
          type="password"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          native-type="submit"
          class="w-full mt-[20px]"
          :type="$elComponentType.primary"
          :size="$elComponentSize.large"
        >
          Submit
        </el-button>
      </el-form-item>
    </el-form>
  </AuthWrapper>
</template>

<script setup lang="ts">
import { calculateBMR, calculateTDEE, calculateGoalCalories, calculateTargetNutritionDetails } from '@/helpers'
import { routeNames } from '@/router/route-names'
const router = useRouter()
const isLoading = ref(false)

function toggleAuthPage () {
  router.push({ name: routeNames.signup })
}

///
const age = 23
const sex: TSex = 'male'
const height = 178
const currentWeight = 63
const goalWeight = 70
const activityLevel = 1.55

const bmr = calculateBMR(currentWeight, height, age, sex)
const tdee = calculateTDEE(bmr, activityLevel)
const goalCalories = calculateGoalCalories(currentWeight, goalWeight, tdee)
const targetNutritionDetails = calculateTargetNutritionDetails(goalCalories)

console.log('Target Nutrition Details:', targetNutritionDetails)

///

const formRef = ref()
const formModel = reactive({
  email: '',
  password: ''
})

const formRules = reactive({
  email: [useRequiredRule(), useEmailRule()],
  password: [useRequiredRule(), useMinLenRule(8)]
})

function submit () {
  formRef.value?.validate((isValid: boolean) => {
    if (isValid) {
      router.push({ name: routeNames.dashboard })
    }
  })
}
</script>
