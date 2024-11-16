<template>
  <div v-loading.fullscreen="pageLoading" class="app-container--compact flex flex-col gap-5 h-full">
    <h1 class="w-full page-header">Profile settings</h1>

    <div class="mx-0 flex-1 flex w-full justify-between overflow-hidden">
      <el-tabs v-model="activeTab" stretch class="flex w-full h-full">
        <ProfileSettingsBodyDetailsTab />

        <ProfileSettingsProfileTab />
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { showNotification } from '@/helpers'

const pageLoading = ref(false)

const props = defineProps<{
  emailUpdated: boolean
  token?: string
  email?: string
}>()

const activeTab = ref('bodyDetails')

const router = useRouter()

onMounted(async () => {
  if (props.emailUpdated && props.token && props.email) {
    try {
      pageLoading.value = true

      await profileService.verifyAndUpdateEmail({
        email: props.email,
        token: props.token
      })

      showNotification('Email successfully updated!', 'Success', 'success')
      router.replace({ query: { emailUpdated: undefined, token: undefined, email: undefined } })
    } catch (error) {
      showNotification()
    } finally {
      pageLoading.value = false
    }
  }
})
</script>
