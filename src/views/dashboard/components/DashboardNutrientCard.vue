<template>
  <el-card class="text-sm text-dark">
    <p class="text-primary-dark font-semibold">{{ label }}:</p>
    <el-progress
      class="py-[2px]"
      :stroke-width="15"
      :percentage="percentage"
      :status="progressColorType"
      :show-text="false"
    />
    <p class="text-sm text-gray-light">{{ consumedAmount }}/{{ targetAmount }}g</p>
  </el-card>
</template>

<script lang="ts" setup>
import type { EProgressColorStatus } from '@/views/dashboard/dashboard.enums'

defineProps<{
  label: string
  percentage: number
  consumedAmount: number
  targetAmount: number
  progressColorType: keyof typeof EProgressColorStatus
}>()

</script>
