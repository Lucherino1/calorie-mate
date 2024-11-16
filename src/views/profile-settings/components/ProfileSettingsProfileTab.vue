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

const profileFormData = ref<IUserProfile>({
  email: authStore.user?.email,
  firstName: authStore.user?.firstName,
  lastName: authStore.user?.lastName
})

async function submitProfileForm (updatedProfileData) {
  try {
    isSubmitButtonLoading.value = true

    const currentEmail = authStore.user.email
    const isEmailChanged = updatedProfileData.email && updatedProfileData.email !== currentEmail

    if (isEmailChanged) {
      await profileService.updateUserEmail(updatedProfileData.email)
      showNotification('Please check your email for verification.', 'Email updated successfully! ', 'success')
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
    showNotification('Failed to update profile', 'Error', 'error')
  } finally {
    isSubmitButtonLoading.value = false
    isSubmitButtonDisabled.value = true
  }
}
</script>
