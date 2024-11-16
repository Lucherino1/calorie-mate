<template>
  <el-tab-pane lazy label="Profile" name="profile" class="h-full py-5 flex justify-center items-center">
    <el-card class="h-full px-10 max-w-[600px] card--no-shadow w-full">
      <ProfileSettingsUserProfileForm
        class="overflow-y-auto w-full h-full flex flex-col py-5"
        :profile-form-data="profileFormData"
        :is-submit-button-disabled="isSubmitButtonDisabled"
        :is-submit-button-loading="isSubmitButtonLoading"
        password-label="New password"
        @validate="isSubmitButtonDisabled = false"
        @submit="submitProfileForm"
      />
    </el-card>
  </el-tab-pane>
</template>

<script lang="ts" setup>
import { showNotification } from '@/helpers'

const authStore = useAuthStore()

const isSubmitButtonDisabled = ref(true)
const isSubmitButtonLoading = ref(false)

const profileFormData = reactive({
  email: authStore.user?.email,
  firstName: authStore.user?.firstName,
  lastName: authStore.user?.lastName
})

async function submitProfileForm (updatedProfileData: IUserProfile) {
  try {
    isSubmitButtonLoading.value = true

    const currentEmail = authStore.user.email
    const isEmailChanged = updatedProfileData.email && updatedProfileData.email !== currentEmail

    if (isEmailChanged) {
      await profileService.updateUserEmail(updatedProfileData.email)
      showNotification('A verification link has been sent to your email. Please check your inbox.', 'Verify your email address ', 'info')
    }

    const profileDataToUpdate = {
      firstName: updatedProfileData.firstName,
      lastName: updatedProfileData.lastName
    }
    await profileService.updateUserProfileDetails(profileDataToUpdate)

    authStore.user = {
      ...authStore.user,
      ...updatedProfileData
    }
  } catch (error) {
    showNotification('Please try again later', 'Failed to update profile', 'error')
  } finally {
    isSubmitButtonLoading.value = false
    isSubmitButtonDisabled.value = true
  }
}

watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) {
      profileFormData.email = newUser.email
      profileFormData.firstName = newUser.firstName
      profileFormData.lastName = newUser.lastName
    }
  },
  { immediate: true }
)
</script>
