<template>
  <div v-loading.fullscreen="loading" class="w-full flex bg-gray-ultra-light">
    <Sidebar />
    <main class="w-full overflow-hidden">
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  loading: boolean
}>()
</script>
