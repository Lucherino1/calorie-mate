<template>
  <el-card class="flex-1 flex flex-col text-start bg-white">
    <p class="section-header">
      Hydration:
      <span class="text- font-normal text-base text-gray-light">
        {{ waterAmount }}/{{ targetWaterAmount }} ml
      </span>
      <InfoTooltip
        content="Using this menu you may control your hydration. 2 liters per day is the basic recommended water
          intake for an average adult. Feel free to drink more if desired!
          Each glass in the menu represents 250 ml."
        fill-class="fill-info"
        :icon="IconTooltipInfo"
      />
    </p>
    <div class="flex items-center gap-10 justify-center w-full">
      <div class="grid grid-cols-4 gap-x-6 gap-y-2 pt-4">
        <DashboardWaterGlass
          v-for="index in totalGlasses"
          :key="index"
          :isFilled="filledStates[index - 1]"
          @click="updateWaterAmount(index)"
        />
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import IconTooltipInfo from '~icons/icon/info-tooltip'

const waterAmount = defineModel<number>('water-amount')

const filledStates = computed(() => {
  const filledCount = Math.floor(waterAmount.value / glassVolume)
  return Array.from({ length: totalGlasses }, (_, i) => i < filledCount)
})

const emits = defineEmits<{
  (e: 'update-water-amount', value: number): void
}>()

const totalGlasses = 8
const targetWaterAmount = 2000
const glassVolume = 250

function updateWaterAmount (index: number) {
  const clickedGlassAmount = index * glassVolume

  const newWaterAmount = waterAmount.value >= clickedGlassAmount
    ? (index - 1) * glassVolume
    : clickedGlassAmount

  emits('update-water-amount', newWaterAmount)
}
</script>
