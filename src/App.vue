<template>
  <AppLayout :layout="$route.meta.layout">
    <router-view />
  </AppLayout>
</template>

<script lang="ts" setup>
import AppLayout from './layouts/AppLayout.vue'
</script>
