<template>
  <el-form
    ref="formRef"
    :rules="formRules"
    :model="localProfileFormModel"
    class="mt-[20px] flex flex-col gap-1 overflow-hidden h-full"
    label-position="top"
    label-width="auto"
    require-asterisk-position="right"
    :size="$elComponentSize.large"
    @submit.prevent="submit"
  >
    <ProfileSettingsChangePasswordModal
      v-model:visible="isModalVisible"
    />

    <div class="h-full">
      <el-form-item label="First name" prop="firstName">
        <el-input v-model="localProfileFormModel.firstName" placeholder="Anthony" type="text" />
      </el-form-item>

      <el-form-item label="Last name" prop="lastName">
        <el-input v-model="localProfileFormModel.lastName" placeholder="Soprano" type="text" />
      </el-form-item>

      <el-form-item label="Email" prop="email">
        <el-input v-model="localProfileFormModel.email" placeholder="email@example.com" type="email" />
      </el-form-item>
    </div>

    <div class="flex justify-center">
      <el-form-item>
        <el-button
          link
          :type="$elComponentType.primary"
          :size="$elComponentSize.large"
          @click="isModalVisible = true"
        >
          Change Password
        </el-button>
      </el-form-item>
    </div>

    <el-form-item>
      <el-button
        native-type="submit"
        class="w-full"
        :loading="isSubmitButtonLoading"
        :type="$elComponentType.primary"
        :size="$elComponentSize.large"
      >
        Save
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
const props = defineProps<{
  profileFormData: IUserProfile
  isSubmitButtonLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', localProfileFormModel: IUserProfile)
}>()

const localProfileFormModel = reactive({ ...props.profileFormData })
const formRef = ref(null)
const isModalVisible = ref(false)

const formRules = reactive({
  email: [useRequiredRule(), useEmailRule()],
  firstName: useRequiredRule(),
  lastName: useRequiredRule()
})

function submit () {
  formRef.value?.validate((isValid: boolean) => {
    if (isValid) {
      emit('submit', { ...localProfileFormModel })
    }
  })
}
</script>
