<template>
  <router-link
    :to="{ name: routeName }"
    class="flex items-center gap-1 text-gray-light hover:text-gray-dark transition-colors duration-300"
  >
    <div class="w-6 h-6 flex justify-center items-center">
      <IconArrowLeft />
    </div>
    {{ buttonText }}
  </router-link>
</template>

<script lang="ts" setup>
defineProps<{
  routeName: string
  buttonText: string
}>()
</script>
