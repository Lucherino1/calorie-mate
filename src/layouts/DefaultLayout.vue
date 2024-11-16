<template>
  <div v-loading.fullscreen="loading" class="w-full h-full flex bg-gray-ultra-light">
    <Sidebar v-if="!loading" class="fixed z-50" />
    <div v-if="!loading" class="flex-1 h-full overflow-x-hidden ml-[310px]">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  loading: boolean
}>()
</script>
