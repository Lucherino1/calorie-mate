<template>
  <AppLayout :loading="userProfileLoading" :layout="route.meta.layout">
    <router-view #default="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </AppLayout>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const authStore = useAuthStore()
const route = useRoute()

const { userProfileLoading } = storeToRefs(authStore)
</script>
