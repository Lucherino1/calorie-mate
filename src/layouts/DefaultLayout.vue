<template>
  <div v-loading.fullscreen="loading" class="w-full flex bg-gray-ultra-light">
    <Sidebar />
    <main class="w-full">
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  loading: boolean
}>()
</script>
