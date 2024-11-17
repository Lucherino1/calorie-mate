<template>
  <div class="flex flex-col text-start">
    <p class="font-semibold text-base mb-1">{{ person.name }}, {{ person.age }}</p>
    <el-card class="flex flex-col items-center max-w-[300px]">
      <div class="flex rounded-xl gap-1 overflow-hidden relative h-[300px]">
        <div class="relative h-full w-1/2">
          <img
            class="object-cover w-full h-full"
            :src="person.imageBefore"
            alt="Before"
          >

          <div
            class="absolute bottom-2 left-1/2 transform -translate-x-1/2
                  bg-primary-dark text-white text-xs font-semibold py-1 px-2 rounded-full"
          >
            {{ person.weightBefore }}
          </div>
        </div>

        <div class="relative h-full w-1/2">
          <img
            class="object-cover w-full h-full"
            :src="person.imageAfter"
            alt="After"
          >

          <div
            class="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-nowrap
                  bg-white text-gray-800 text-xs font-semibold py-1 px-2 rounded-full flex items-center gap-1"
          >
            {{ person.weightAfter }}
          </div>
        </div>
      </div>

      <div class="flex flex-col items-start pt-5">
        <p class="text-start">
          <TruncatedTooltip :contentProp="person.quote" :multiline="5">
            <b>«</b>{{ person.quote }}<b>»</b>
          </TruncatedTooltip>
        </p>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  person: {
    name: string
    age: string
    imageBefore: string
    imageAfter: string
    weightBefore: string
    weightAfter: string
    quote: string
  }
}>()
</script>
