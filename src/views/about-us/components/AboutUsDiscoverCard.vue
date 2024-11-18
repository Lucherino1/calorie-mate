<template>
  <el-card class="max-w-[270px] mx-auto">
    <div class="flex flex-col justify-center items-center text-center">
      <span class="w-[100px] h-[100px] mb-5 flex justify-center items-center">
        <img
          :src="imageSrc"
          class="w-full h-full object-cover overflow-hidden"
          alt="discover image"
        >
      </span>

      <p class="font-bold pb-1">{{ title }}</p>
      <p class="font-light">{{ paragraph }}</p>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
defineProps<{
  imageSrc: string
  title: string
  paragraph: string
}>()
</script>
