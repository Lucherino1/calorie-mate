<template>
  <AppLayout :layout="$route.meta.layout">
    <router-view #default="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </AppLayout>
</template>

<script lang="ts" setup>
import AppLayout from './layouts/AppLayout.vue'
</script>
