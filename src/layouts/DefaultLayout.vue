<template>
  <div v-loading.fullscreen="loading" class="grid grid-cols-[310px_1fr] bg-gray-ultra-light">
    <Sidebar />
    <main>
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  loading: boolean
}>()
</script>
