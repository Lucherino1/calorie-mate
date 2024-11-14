<template>
  <div class="app-container--main flex flex-col justify-center items-center gap-10">
    <CalculatorsModal v-model:visible="isModalVisible" :body-metrics="bodyMetrics" />
    <div class="w-full flex flex-col gap-5">
      <h1 class="page-header">Health & Nutrition Calculators</h1>
      <p class="text-gray-light text-xl">For accurate calculation, we need some basic info about you</p>
    </div>

    <div class="mt-[50px] flex gap-10 flex-1 flex-wrap justify-center items-center">
      <div class="flex gap-10 flex-wrap max-w-[800px] w-full">
        <el-card class="flex flex-col text-center justify-center flex-1 min-w-[250px]">
          <p class="text-lg w-full font-semibold">What is your sex?</p>

          <div class="flex flex-col justify-center h-full pt-5">
            <el-radio-group v-model="bodyMetrics.sex" class="flex justify-around items-center">
              <label class="flex flex-col justify-center items-center gap-8 hover:cursor-pointer">
                <p class="text-[3rem]">👨</p>

                <el-radio-button class="separate-radio" value="male">
                  Male
                </el-radio-button>
              </label>

              <label class="flex flex-col justify-center items-center gap-8 hover:cursor-pointer">
                <p class="text-[3rem]">👩</p>

                <el-radio-button class="separate-radio" value="female">
                  Female
                </el-radio-button>
              </label>
            </el-radio-group>
          </div>
        </el-card>

        <el-card
          class="flex flex-col text-center items-center flex-1 min-w-[250px] min-h-[200px]"
          :class="isAgeError ? 'border-red-600' : 'border'"
        >
          <p class="text-lg font-semibold">How old are you?</p>
          <div class="h-full flex items-center">
            <el-input-number
              v-model="bodyMetrics.age"
              :step="1"
              placeholder="18"
              :min="1"
              :size="$elComponentSize.large"
              @focus="isAgeError = false"
            >
              <template #suffix>y.o.</template>
            </el-input-number>
          </div>
        </el-card>

        <el-card
          class="flex flex-col text-center items-center flex-1 min-w-[250px] min-h-[200px]"
          :class="isHeightError ? 'border-red-600' : 'border'"
        >
          <p class="text-lg font-semibold">How tall are you?</p>
          <div class="h-full flex items-center">
            <el-input-number
              v-model="bodyMetrics.height"
              :step="1"
              placeholder="180"
              :min="1"
              :size="$elComponentSize.large"
              @focus="isHeightError = false"
            >
              <template #suffix>cm</template>
            </el-input-number>
          </div>
        </el-card>

        <el-card
          class="flex flex-col text-center items-center flex-1 min-w-[250px] min-h-[200px]"
          :class="isWeightError ? 'border-red-600' : 'border'"
        >
          <p class="text-lg font-semibold">What is your weight?</p>
          <div class="h-full flex items-center">
            <el-input-number
              v-model="bodyMetrics.weight"
              :step="1"
              placeholder="70"
              :min="1"
              :size="$elComponentSize.large"
              @focus="isWeightError = false"
            >
              <template #suffix>kg</template>
            </el-input-number>
          </div>
        </el-card>
      </div>

      <div class="flex-1 min-w-[450px] max-w-[800px]">
        <el-card class="h-full w-full flex flex-col items-center">
          <h2 class="text-xl font-semibold mx-auto">How active are you on daily basis?</h2>

          <el-radio-group v-model="bodyMetrics.activity" class="py-10">
            <label class="grid grid-cols-[120px_auto_32px] items-center gap-4 py-4 border-b border-gray-200 w-full">
              <el-radio-button v-model="bodyMetrics.activity" :value="1.2" label="Medium" class="separate-radio">
                Low
              </el-radio-button>

              <span class="grid grid-cols-2 justify-start w-full whitespace-nowrap text-sm text-gray-dark ">
                <p class="text-regular font-semibold">
                  Mostly sitting
                </p>

                <p class="text-sm font-light">
                  (e.g. office worker)
                </p>
              </span>
              <div class="text-[2rem] justify-self-end">👨‍💻</div>
            </label>

            <label class="grid grid-cols-[120px_auto_32px] items-center gap-4 py-4 border-b border-gray-200 w-full">
              <el-radio-button v-model="bodyMetrics.activity" :value="1.55" label="Medium" class="separate-radio">
                Medium
              </el-radio-button>

              <span class="grid grid-cols-2 justify-start w-full whitespace-nowrap text-sm text-gray-dark ">
                <p class="text-regular font-semibold">
                  Mostly standing
                </p>

                <p class="text-sm font-light">
                  (e.g. teacher)
                </p>
              </span>
              <div class="text-[2rem] justify-self-end">👨‍🏫</div>
            </label>

            <label class="grid grid-cols-[120px_auto_32px] items-center gap-4 py-4 border-b border-gray-200 w-full">
              <el-radio-button v-model="bodyMetrics.activity" :value="1.725" label="Medium" class="separate-radio">
                Active
              </el-radio-button>

              <span class="grid grid-cols-2 justify-start w-full whitespace-nowrap text-sm text-gray-dark ">
                <p class="text-regular font-semibold">
                  Mostly walking
                </p>

                <p class="text-sm font-light">
                  (e.g. sales, server)
                </p>
              </span>
              <div class="text-[2rem] justify-self-end">🚶</div>
            </label>

            <label class="grid grid-cols-[120px_auto_32px] items-center gap-4 py-4 border-b border-gray-200 w-full">
              <el-radio-button v-model="bodyMetrics.activity" :value="1.9" label="Medium" class="separate-radio">
                Very active
              </el-radio-button>

              <span class="grid grid-cols-2 justify-start w-full whitespace-nowrap text-sm text-gray-dark ">
                <p class="text-regular font-semibold">
                  Physical job
                </p>

                <p class="text-sm font-light">
                  (e.g. builder)
                </p>
              </span>
              <div class="text-[2rem] justify-self-end">🏋️</div>
            </label>
          </el-radio-group>
        </el-card>
      </div>
    </div>

    <span class="flex gap-10 font-bold">
      Body Mass Index (BMI)
      <span>|</span>
      Ideal Body Weight
      <span>|</span>
      Daily Calorie Intake
    </span>

    <div class="flex w-full justify-center items-center mt-5">
      <el-button
        :type="$elComponentType.primary"
        :size="$elComponentSize.large"
        class="w-full max-w-[300px]"
        :disabled="isInputDisabled"
        @click="showModal"
      >
        Calculate
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { showNotification } from '@/helpers'

const isModalVisible = ref(false)

const isAgeError = ref(false)
const isHeightError = ref(false)
const isWeightError = ref(false)

const bodyMetrics = ref<IBodyMetrics>({
  sex: 'male',
  age: null,
  height: null,
  weight: null,
  activity: 1.2
})

const isInputDisabled = computed(() => isAgeError.value || isHeightError.value || isWeightError.value)

function showModal () {
  isAgeError.value = !bodyMetrics.value.age
  isWeightError.value = !bodyMetrics.value.weight
  isHeightError.value = !bodyMetrics.value.height

  const hasError = isAgeError.value || isWeightError.value || isHeightError.value

  if (hasError) {
    showNotification('Please enter valid details', 'Oops! Something went wrong.', 'warning')
  } else {
    isModalVisible.value = true
  }
}
</script>
