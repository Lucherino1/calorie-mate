<template>
  <el-card class="flex flex-col items-center text-center">
    <p class="section-header">{{ label }}</p>
    <el-progress class="py-[10px]" type="circle" :percentage="percentage">
      <template #default>
        <div class="w-full h-full flex justify-center items-center relative">
          <span class="text-[4rem]">{{ icon }}</span>

          <div class="w-[30px] h-[30px] absolute -bottom-3 right-1">
            <el-button circle type="info" @click="redirectToUpdateMeal">
              <IconPlus />
            </el-button>
          </div>
        </div>
      </template>
    </el-progress>

    <p class="font-semibold text-lg justify-center flex items-center">
      {{ caloriesConsumed }}
      <span class="font-thin text-gray-dark">/</span>
      <span class="text-base leading-7">{{ caloriesLimit }}</span>
    </p>

    <span class="font-thin">kcal</span>

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
  icon: string
  mealType: string
  caloriesLimit: number
  selectedDate: string
}>()

const countedItemsText = computed(() => {
  return props.itemsCount === 1 ? 'item' : 'items'
})

const redirectToUpdateMeal = () => {
  router.push(
    {
      name: routeNames.updateMeal,
      params: { mealType: props.mealType },
      query: { date: props.selectedDate.toString() }
    })
}
</script>
