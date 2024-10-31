<template>
  <el-card class="flex flex-col items-center text-center">
    <p class="font-bold text-lg">{{ label }}</p>
    <el-progress class="py-[10px]" type="circle" :percentage="percentage">
      <template #default>
        <div class="w-[55px] h-[55px] mx-auto relative">
          <img
            :src="image"
            class="bg-gray overflow-hidden w-full h-auto object-cover"
            :alt="label"
            loading="lazy"
          >
          <div class="w-[30px] h-[30px] absolute left-12">
            <el-button circle type="info" @click="redirectToUpdateMeal">
              <IconPlus />
            </el-button>
          </div>
        </div>
      </template>
    </el-progress>
    <p class="font-semibold text-lg">
      {{ caloriesConsumed }}
      <span class="font-thin"> cal</span>
    </p>
    <p class="text-sm text-gray-500">
      {{ itemsCount }}
      <span>{{ countedItemsText }}</span>
    </p>
  </el-card>
</template>

<script lang="ts" setup>
import { routeNames } from '@/router/route-names'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  label: string
  percentage: number
  caloriesConsumed: number
  itemsCount: number
  image: string
  mealType: string
}>()

const countedItemsText = computed(() => {
  return props.itemsCount === 1 ? 'item' : 'items'
})

const redirectToUpdateMeal = () => {
  router.push({ name: routeNames.updateMeal, params: { mealType: props.mealType } })
}
</script>
