<template>
  <div v-loading.fullscreen="loading" class="w-full h-full flex bg-gray-ultra-light">
    <Sidebar class="fixed z-50" />
    <main class="flex-1 h-full overflow-x-hidden ml-[310px]">
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  loading: boolean
}>()
</script>
