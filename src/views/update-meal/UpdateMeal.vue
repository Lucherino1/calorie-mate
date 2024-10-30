<template>
  <div>
    <h1>Update {{ mealType }}</h1>
    <p>Here you can update details for {{ mealType }}</p>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ mealType?: string }>()
</script>
