<template>
  <el-dialog
    v-model="isModalVisible"
    title="Change Password"
    width="400px"
    class="rounded-xl"
    :lock-scroll="true"
    close-on-press-escape
    align-center
    :close-icon="IconClose"
  >
    <el-form
      ref="formRef"
      :model="passwordFormModel"
      :rules="formRules"
      label-position="top"
      class="pt-3"
      @submit.prevent="submit"
    >
      <el-form-item label="New Password" prop="password">
        <el-input
          v-model="passwordFormModel.password"
          placeholder="Min. 8 characters"
          type="password"
          show-password
        />
      </el-form-item>

      <el-form-item label="Confirm Password" prop="confirmPassword">
        <el-input
          v-model="passwordFormModel.confirmPassword"
          type="password"
          placeholder="Min. 8 characters"
          show-password
        />
      </el-form-item>

      <div class="flex justify-end">
        <el-form-item>
          <el-button
            type="primary"
            :loading="isSubmitButtonLoading"
            class=""
            @click="submit"
          >
            Save
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import IconClose from '~icons/icon/close'
import { showNotification } from '@/helpers'

const passwordFormModel = reactive({
  password: '',
  confirmPassword: ''
})

const isModalVisible = defineModel<boolean>('visible')

const formRef = ref(null)
const isSubmitButtonLoading = ref(false)

const formRules = reactive({
  password: [useRequiredRule(), useMinLenRule(8)],
  confirmPassword: [useRequiredRule(), useConfirmPasswordRule(passwordFormModel)]
})

async function submit () {
  formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      isSubmitButtonLoading.value = true
      try {
        await profileService.updateUserPassword(passwordFormModel.password)
        showNotification('Password changed successfully', 'Success', 'success')
      } catch (error) {
        showNotification()
      } finally {
        isModalVisible.value = false
        isSubmitButtonLoading.value = false
      }
    }
  })
}
</script>
