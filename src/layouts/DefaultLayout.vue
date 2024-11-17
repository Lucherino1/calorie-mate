<template>
  <div v-loading="loading" class="w-full h-full flex bg-gray-ultra-light">
    <Sidebar class="fixed z-50" />
    <div class="flex-1 h-full overflow-x-hidden ml-[310px]">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  loading: boolean
}>()
</script>
