<template>
  <el-tab-pane lazy label="Body Details" name="bodyDetails" class="h-full py-5 flex justify-center items-center">
    <el-card class="h-full px-10 max-w-[600px] card--no-shadow w-full">
      <UserFormBodyDetails
        class="overflow-y-auto w-full h-full flex flex-col py-5"
        :body-form-data="formData"
        submit-button-text="Save"
        :is-submit-button-disabled="isSubmitButtonDisabled"
        :is-submit-button-loading="isSubmitButtonLoading"
        @submit="submitBodyDetails"
        @validate="isSubmitButtonDisabled = false"
      />
    </el-card>
  </el-tab-pane>
</template>

<script lang="ts" setup>
import { showNotification } from '@/helpers'

const authStore = useAuthStore()

const isSubmitButtonDisabled = ref(true)
const isSubmitButtonLoading = ref(false)

const formData = ref<Partial<IBodyDetails>>({ ...authStore.user.bodyDetails })

async function submitBodyDetails (bodyDetailsFormModel: IBodyDetails) {
  try {
    formData.value = bodyDetailsFormModel
    authStore.user.bodyDetails = bodyDetailsFormModel
    isSubmitButtonLoading.value = true

    await profileService.updateUserBodyDetails(formData.value).then(() => {
      const updatedUser = profileService.recalculateTargetNutrition(authStore.user)

      profileService.updateUserTargetNutrition(updatedUser.targetNutritionDetails)
      profileService.updateUserTargetNutritionByMeal(updatedUser.targetNutritionDetailsByMeal)

      showNotification('Calories have been recalculated successfully', 'Profile has been updated', 'success')
    })
  } catch (error) {
    showNotification()
  } finally {
    isSubmitButtonDisabled.value = true
    isSubmitButtonLoading.value = false
  }
}

watch(formData, () => {
  isSubmitButtonDisabled.value = false
}, { deep: true })
</script>
