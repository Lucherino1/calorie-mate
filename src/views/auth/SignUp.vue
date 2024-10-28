<template>
  <AuthWrapper
    title-text="Sign Up"
    auth-prompt-text="Already have an account?"
    toggle-auth-page-btn-text="Sign In"
    :toggle-auth-page="toggleAuthPage"
  >
    <transition name="fade" mode="out-in">
      <UserFormBodyDetails
        v-if="currentStep === 1"
        :body-form-data="bodyDetailsFormData"
        :submit-button-text="submitBtnText"
        @submit="submitBodyDetails"
      />
      <UserFormProfile
        v-else
        :profile-form-data="profileFormData"
        @submit="submitEntireProfile"
      >
        <template #submitBtn>
          <div class="flex justify-between items-center w-full">
            <el-button
              class="flex-1"
              :icon="IconArrowLeft"
              @click="toggleStep()"
            >
              Previous step
            </el-button>
            <el-button
              native-type="submit"
              class="flex-1"
              :loading="isLoading"
              :type="$elComponentType.primary"
              :size="$elComponentSize.large"
            >
              {{ submitBtnText }}
            </el-button>
          </div>
        </template>
      </UserFormProfile>
    </transition>
  </AuthWrapper>
</template>

<script setup lang="ts">
import UserFormBodyDetails from '@/components/profile-details-forms/UserFormBodyDetails.vue'
import UserFormProfile from '@/components/profile-details-forms/UserFormProfile.vue'
import { routeNames } from '@/router/route-names'
import IconArrowLeft from '~icons/icon/arrow-left'

const router = useRouter()
const { signup } = useAuthStore()
const isLoading = ref(false)

function toggleAuthPage () {
  router.push({ name: routeNames.signin })
}

const currentStep = ref(1)
function toggleStep () {
  currentStep.value === 1 ? ++currentStep.value : --currentStep.value
}

const submitBtnText = computed(() => (currentStep.value === 1 ? 'Next step' : 'Submit'))

const bodyDetailsFormData = ref<Partial<IBodyDetails>>({
  age: undefined,
  sex: 'male',
  activityLevel: undefined,
  height: undefined,
  currentWeight: undefined,
  goalWeight: undefined
})

function submitBodyDetails (bodyDetailsFormModel: Partial<IBodyDetails>) {
  bodyDetailsFormData.value = bodyDetailsFormModel
  currentStep.value = 2
}

const profileFormData = ref<IProfileFields>({
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: ''
})

function createSignUpPayload (
  bodyDetailsFormData: Partial<IBodyDetails>,
  profileFormData: IProfileFields
): ISignUpPayload | null {
  if (Object.values(bodyDetailsFormData).some(value => value == null)) {
    console.error('Some fields in bodyDetailsFormData are missing')
    return null
  }

  const validatedBodyDetails = bodyDetailsFormData as IBodyDetails

  const bmr = calculateNutritionService.calculateBMR(
    validatedBodyDetails.currentWeight,
    validatedBodyDetails.height,
    validatedBodyDetails.age,
    validatedBodyDetails.sex
  )

  const tdee = calculateNutritionService.calculateTDEE(bmr, validatedBodyDetails.activityLevel)
  const goalCalories = calculateNutritionService.calculateGoalCalories(
    validatedBodyDetails.currentWeight,
    validatedBodyDetails.goalWeight,
    tdee
  )

  const targetNutritionDetails = calculateNutritionService.calculateTargetNutritionDetails(goalCalories)
  const targetNutritionDetailsByMeal =
  calculateNutritionService.calculateTargetNutritionDetailsByMeal(targetNutritionDetails)

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

async function submitEntireProfile (profileFormModel: IProfileFields) {
  profileFormData.value = profileFormModel
  const payload = createSignUpPayload(bodyDetailsFormData.value, profileFormData.value)

  if (!payload) return

  isLoading.value = true
  await signup(payload)
  isLoading.value = false
}
</script>
