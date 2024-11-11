<template>
  <el-tooltip
    popper-class="max-w-[200px]"
    :content="content"
    placement="top"
  >
    <component
      :is="icon"
      class="w-[18px] h-[18px] my-0"
      :class="fillClass"
    />
  </el-tooltip>
</template>

<script lang="ts" setup>
defineProps<{
  content: string
  icon: any
  fillClass: string
}>()
</script>
