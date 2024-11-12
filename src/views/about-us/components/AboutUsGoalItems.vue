<template>
  <div class="grid grid-cols-2 gap-x-4 gap-y-2">
    <div
      v-for="(goal, index) in goalHeaders"
      :key="index"
      class="flex items-center text-[20px] space-x-2"
    >
      <IconCheck class="w-[30px] h-[30px]" />
      <span class="font-semibold">{{ goal }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconCheck from '~icons/icon/check'
const goalHeaders = ['Lose weight', 'Eat healthier', 'Build muscle', 'Keep your form']
</script>
