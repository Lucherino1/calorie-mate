<template>
  <el-dialog
    v-model="isModalVisible"
    width="700px"
    :lock-scroll="true"
    class="text-center p-10 rounded-xl"
  >
    <template #default>
      <div class="flex flex-col gap-10">
        <el-card class="bg-primary-dark">
          <p class="text-lg font-semibold text-white">
            Your BMI is {{ bmi.toFixed(1) }}<br>
            <span class="text-sm font-normal">
              {{ weightStatus }}
            </span>
          </p>
        </el-card>

        <el-card class="bg-primary-dark">
          <p class="text-lg font-semibold text-white">
            Your daily calorie requirement is {{ tdee }} kcal<br>
            <span class="text-sm font-normal">
              This is the total daily energy expenditure based on your activity level.
            </span>
          </p>
        </el-card>

        <el-card class="bg-primary-dark">
          <p class="text-lg font-semibold text-white">
            Your ideal weight range is
            {{ idealWeightRange.min.toFixed(1) }} - {{ idealWeightRange.max.toFixed(1) }} kg<br>
            <span class="text-sm font-normal">
              Reach and maintain your ideal weight with your personalized plan from Calorie Mate.
            </span>
          </p>
        </el-card>
      </div>

      <div class="mt-10">
        <router-link
          :to="{ name: routeNames.signup }"
          class="flex items-center justify-center w-full"
        >
          <el-button
            size="large"
            class="w-full max-w-[300px]"
            plain
          >
            Join Calorie Mate
          </el-button>
        </router-link>
        <p class="text-gray-500 text-sm mt-3">And achieve your goals with us</p>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { routeNames } from '@/router/route-names'

const props = defineProps<{
  bodyMetrics: IBodyMetrics
}>()

const isModalVisible = defineModel<boolean>('visible')

const bmr = computed(() => {
  const { weight, height, age, sex } = props.bodyMetrics

  return nutritionService.calcBMR(weight, height, age, sex)
})

const tdee = computed(() => {
  return nutritionService.calcTDEE(bmr.value, props.bodyMetrics.activity)
})

const bmi = computed(() => {
  return props.bodyMetrics.weight / ((props.bodyMetrics.height / 100) ** 2)
})

const idealWeightRange = computed(() => {
  const heightInMeters = props.bodyMetrics.height / 100
  const minIdealWeight = 18.5 * heightInMeters ** 2
  const maxIdealWeight = 24.9 * heightInMeters ** 2

  return {
    min: minIdealWeight,
    max: maxIdealWeight
  }
})

const weightStatus = computed(() => {
  if (bmi.value < 18.5) {
    return 'According to your BMI, you might be underweight.'
  } else if (bmi.value >= 18.5 && bmi.value <= 24.9) {
    return 'Great! Your weight is within the healthy range.'
  } else {
    return 'According to your BMI, you might be obese.'
  }
})
</script>
