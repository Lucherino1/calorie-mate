<template>
  <el-card class="flex flex-col items-center text-center">
    <p class="font-bold text-lg">Breakfast</p>
    <el-progress type="circle" :percentage="75">
      <template #default>
        <div class="w-[55px] h-[55px] mx-auto">
          <img
            class="bg-gray w-full h-auto object-cover"
            :src="imageSrc"
            srcset="/src/assets/images/meals/breakfast.png 1x, /src/assets/images/meals/breakfast@2.png 2x"
            alt="Meal"
            loading="lazy"
          >
        </div>
      </template>
    </el-progress>
    <p class="font-semibold text-lg">568 cal</p>
    <p class="text-sm text-gray-500">6 items</p>
  </el-card>
</template>

<script lang="ts" setup>
const props = defineProps<{
  imageSrc: string
  percentage: number
}>()
</script>
