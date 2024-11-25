<template>
  <AuthWrapper
    title-text="Sign In"
    auth-prompt-text="Don't have an account?"
    toggle-auth-page-btn-text="Sign Up"
    :toggle-auth-page="toggleAuthPage"
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
          class="w-full"
          :type="$elComponentType.primary"
          :size="$elComponentSize.large"
          :loading="isLoading"
        >
          Submit
        </el-button>
      </el-form-item>
    </el-form>
  </AuthWrapper>
</template>

<script setup lang="ts">
import { routeNames } from '@/router/route-names'

const { signin } = useAuthStore()

const router = useRouter()

const isLoading = ref(false)

function toggleAuthPage () {
  router.push({ name: routeNames.signup })
}

const formRef = useTemplateRef<TElementPlus['FormInstance']>('formRef')

const formModel: ISignInPayload = reactive({
  email: '',
  password: ''
})

const formRules = reactive({
  email: [useRequiredRule(), useEmailRule()],
  password: [useRequiredRule(), useMinLenRule(8)]
})

async function submit () {
  formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      isLoading.value = true
      await signin(formModel)
      isLoading.value = false
    }
  })
}
</script>
