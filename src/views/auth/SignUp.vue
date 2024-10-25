<template>
  <AuthWrapper
    title-text="Sign Up"
    label="Don't have an account?"
    toggle-auth-page-btn-text="Sign In"
    :loading-status="isLoading"
    :toggle-auth-page="toggleAuthPage"
  >
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
            link
            :icon="IconArrowLeft"
            @click="toggleStep()"
          >Previous step</el-button>
        </span>
        <AuthButtonSubmit :submit-btn-text="submitBtnText" />
      </template>
    </ProfileForm>
  </AuthWrapper>
</template>

<script setup lang="ts">
import { routeNames } from '@/router/route-names'
import IconArrowLeft from '~icons/icon/arrow-left'

const router = useRouter()
const isLoading = ref(false)

function toggleAuthPage () {
  router.push({ name: routeNames.signin })
}

const currentStep = ref(1)
function toggleStep () {
  currentStep.value === 1 ? ++currentStep.value : --currentStep.value
}

const submitBtnText = computed(() => (currentStep.value === 1 ? 'Next step' : 'Submit'))

const bodyDetailsFormData = ref<TNullableBodyDetails>({
  age: null,
  sex: 'male',
  height: null,
  currentWeight: null,
  goalWeight: null
})

function submitBodyDetails (bodyDetailsFormModel: TNullableBodyDetails) {
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

function submitEntireProfile (profileFormModel: IProfileFields) {
  profileFormData.value = profileFormModel
  router.push({ name: routeNames.dashboard })
}

</script>
