<template>
  <el-progress
    :type="type"
    :percentage="percentage"
    :stroke-width="strokeWidth"
    :width="progressWidth"
  >
    <template #default>
      <slot />
    </template>
  </el-progress>
</template>

<script lang="ts" setup>
type TProgressType = 'dashboard' | 'circle'

defineProps<{
  type: TProgressType
  percentage: number
  strokeWidth?: number
  progressWidth: number
}>()
</script>
