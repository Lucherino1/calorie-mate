<template>
  <div class="grid grid-cols-[290px_1fr] bg-gray-ultra-light">
    <Sidebar :menu-list="menuList" />
    <main>
      <slot name="main" />
    </main>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  menuList: TSidebarMenuList
}>()
</script>
