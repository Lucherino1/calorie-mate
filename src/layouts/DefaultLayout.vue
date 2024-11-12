<template>
  <div v-loading.fullscreen="loading" class="w-full flex bg-gray-ultra-light">
    <Sidebar class="fixed z-50" />
    <main class="flex-1 overflow-hidden min-h-screen ml-[310px]">
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  loading: boolean
}>()
</script>
