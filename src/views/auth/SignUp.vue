<template>
  <AuthWrapper
    title-text="Sign Up"
    label="Don't have an account?"
    toggle-auth-page-btn-text="Sign In"
    :toggle-auth-page="toggleAuthPage"
  >
    <transition name="fade" mode="out-in">
      <BodyDetailsForm
        v-if="currentStep === 1"
        :body-form-data="bodyDetailsFormData"
        @submit="submitBodyDetails"
      >
        <template #submitBtn>
          <AuthButtonSubmit :submit-btn-text="submitBtnText" />
        </template>
      </BodyDetailsForm>
      <ProfileForm
        v-else
        :profile-form-data="profileFormData"
        @submit="submitEntireProfile"
      >
        <template #submitBtn>
          <span>
            <el-button
              class="mb-7"
              link
              :loading="isLoading"
              :icon="IconArrowLeft"
              @click="toggleStep()"
            >Previous step</el-button>
          </span>
          <AuthButtonSubmit :submit-btn-text="submitBtnText" />
        </template>
      </ProfileForm>
    </transition>
  </AuthWrapper>
</template>

<script setup lang="ts">
import { createSignUpPayload } from '@/helpers'
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
  console.log(bodyDetailsFormModel)
  currentStep.value = 2
}

const profileFormData = ref<IProfileFields>({
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: ''
})

async function submitEntireProfile (profileFormModel: IProfileFields) {
  profileFormData.value = profileFormModel
  const payload = createSignUpPayload(bodyDetailsFormData.value, profileFormData.value)

  if (!payload) return

  isLoading.value = true
  await signup(payload)
  isLoading.value = false
}
</script>
