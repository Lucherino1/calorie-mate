<template>
  <div class="grid grid-cols-[290px_1fr] bg-gray-ultra-light">
    <Sidebar :menu-list="menuList" />

    <slot name="main" />
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  menuList: TSidebarMenuList
}>()
</script>
