<template>
  <el-form
    ref="formRef"
    :rules="formRules"
    :model="localProfileFormModel"
    class="mt-[20px] flex flex-col gap-2"
    label-position="top"
    label-width="auto"
    require-asterisk-position="right"
    :size="$elComponentSize.large"
    @submit.prevent="submit"
  >
    <el-form-item label="First name" prop="firstName">
      <el-input v-model="localProfileFormModel.firstName" placeholder="Anthony" type="text" />
    </el-form-item>

    <el-form-item label="Last name" prop="lastName">
      <el-input v-model="localProfileFormModel.lastName" placeholder="Soprano" type="text" />
    </el-form-item>

    <el-form-item label="Email" prop="email">
      <el-input v-model="localProfileFormModel.email" placeholder="email@example.com" type="email" />
    </el-form-item>

    <el-form-item label="Password" prop="password" required>
      <el-input
        v-model="localProfileFormModel.password"
        placeholder="Min. 8 characters"
        type="password"
        show-password
      />
    </el-form-item>
    <el-form-item
      label="Confirm Password"
      prop="confirmPassword"
    >
      <el-input
        v-model="localProfileFormModel.confirmPassword"
        type="password"
        placeholder="Min. 8 characters"
      />
    </el-form-item>
    <el-form-item>
      <slot name="submitBtn">
        <el-button
          native-type="submit"
          class="w-full"
          :type="$elComponentType.primary"
          :size="$elComponentSize.large"
        >
          Submit
        </el-button>
      </slot>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
const props = defineProps<{
  profileFormData: IProfileFields
}>()

const emit = defineEmits<{
  (e: 'submit', localProfileFormModel: IProfileFields): IProfileFields
}>()

const localProfileFormModel = reactive({ ...props.profileFormData })

const formRef = ref()

const formRules = reactive({
  email: [useRequiredRule(), useEmailRule()],
  password: [useRequiredRule(), useMinLenRule(8)],
  confirmPassword: [useRequiredRule(), useConfirmPasswordRule(localProfileFormModel)],
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
