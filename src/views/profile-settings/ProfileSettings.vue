<template>
  <div class="app-container--compact flex flex-col gap-5 h-full">
    <h1 class="w-full page-header">Profile settings</h1>

    <div class="mx-0 flex-1 flex w-full justify-between overflow-hidden">
      <el-tabs v-model="activeTab" stretch class="flex w-full h-full">
        <ProfileSettingsBodyDetailsTab />

        <ProfileSettingsProfileTab />
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
const activeTab = ref('bodyDetails')
</script>
