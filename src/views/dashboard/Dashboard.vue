<template>
  <div v-loading.fullscreen="dashboardPageLoading" class="app-container--dashboard">
    <div class="flex flex-col gap-5">
      <p class="font-bold text-gray-light text-[34px] leading-10">
        Hello, <span class="text-primary-dark">{{ authStore.user.firstName }}!</span>
      </p>
      <div class="w-full flex justify-between">
        <el-date-picker
          v-model="date"
          type="date"
          :clearable="false"
          :size="$elComponentSize.large"
          @change="handleDateChange"
        />
      </div>
    </div>
    <div class="flex gap-5 mt-10 flex-wrap">
      <el-card class="w-full h-auto flex-1 min-w-[310px]">
        <p class="card-header">Total Calories:</p>
        <div class="flex justify-center items-center">
          <el-progress
            type="dashboard"
            class="py-8"
            :percentage="nutrientPercentage.calories"
            :stroke-width="12"
            :width="220"
          >
            <template #default>
              <p class="text-gray-light leading-7">
                <b class="text-primary-dark">{{ calculatedCalsRemaining }}</b>
                <br> cal left
              </p>
            </template>
          </el-progress>
        </div>
      </el-card>
      <div class="flex flex-1 flex-col w-full justify-between">
        <DashboardNutrientCard
          v-for="nutrient in nutrientData"
          :key="nutrient.label"
          :label="nutrient.label"
          :percentage="nutrient.percentage"
          :consumedAmount="nutrient.consumedAmount"
          :targetAmount="nutrient.targetAmount"
          :progress-color-type="nutrient.progressColorType"
        />
      </div>
      <div class="flex-1 gap-5 flex flex-col">
        <el-card class="flex justify-center text-center items-center min-h-[155px] weight-form-wrapper">
          <el-form
            ref="formRef"
            :model="bodyDetailsFormModel"
            :rules="formRules"
            :size="$elComponentSize.large"
            label-position="top"
            hide-required-asterisk
            :show-message="false"
            @submit.prevent="submitBodyDetails"
          >
            <el-form-item label="Your weight is:" prop="currentWeight">
              <el-input-number
                v-model="bodyDetailsFormModel.currentWeight"
                :precision="1"
                :step="0.1"
                @input="isEditWeightMode = true"
              >
                <template #suffix>kg</template>
              </el-input-number>
            </el-form-item>
            <transition name="fade">
              <div v-show="isEditWeightMode" class="flex items-center justify-center">
                <el-form-item class="flex items-center justify-end">
                  <el-button :type="$elComponentType.danger" link @click="cancelEditMode()">
                    Cancel
                  </el-button>
                  <el-button native-type="submit" :type="$elComponentType.info" link>
                    Save
                  </el-button>
                </el-form-item>
              </div>
            </transition>
          </el-form>
        </el-card>
        <el-card class="w-full h-auto flex-1">
          <div class="text-[34px] leading-10">
            <p class="card-header">Hydration:</p>
          </div>
        </el-card>
      </div>
    </div>
    <div class="grid grid-cols-4 gap-5 mt-10">
      <DashboardMealCard
        v-for="meal in mealData"
        :key="meal.label"
        :label="meal.label"
        :percentage="meal.percentage || 0"
        :caloriesConsumed="meal.caloriesConsumed"
        :itemsCount="meal.countedItems"
        :icon="meal.icon"
        :meal-type="meal.mealType"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { showNotification } from '@/helpers'
import { EProgressColorStatus } from '@/views/dashboard/dashboard.enums'

const date = ref(new Date().toISOString().split('T')[0])
const userDashboard = ref<IDashboard>(null)
const dashboardPageLoading = ref(false)

const authStore = useAuthStore()

const getUserDashboard = async (selectedDate: string) => {
  dashboardPageLoading.value = true
  userDashboard.value = await dashboardService.getUserDashboard(selectedDate, authStore.user.id)
  dashboardPageLoading.value = false
}

const handleDateChange = (newDate: string) => {
  const selectedDate = new Date(newDate)

  const year = selectedDate.getFullYear()
  const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
  const day = String(selectedDate.getDate()).padStart(2, '0')

  date.value = `${year}-${month}-${day}`
  getUserDashboard(date.value)
}

const formRef = useTemplateRef<TElementPlus['FormInstance']>('formRef')

const formRules = { currentWeight: [useRequiredRule(), useCurrentWeightRule()] }

const bodyDetailsFormModel = { ...authStore.user.bodyDetails }

const isEditWeightMode = ref(false)

function cancelEditMode () {
  isEditWeightMode.value = false
  bodyDetailsFormModel.currentWeight = authStore.user.bodyDetails.currentWeight
}

function submitBodyDetails () {
  formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      cancelEditMode()
      try {
        await profileService.updateUserBodyDetails(authStore.user.id, { ...bodyDetailsFormModel })

        authStore.user.bodyDetails = bodyDetailsFormModel
        profileService.recalculateTargetNutrition(authStore.user)
        showNotification('Calories have been recalculated successfully', 'Recalculation Complete', 'success')
      } catch (error) {
        showNotification()
      }
    }
  })
}

const calculatedCalsRemaining = computed(() => {
  return nutritionService.calcRemainingCalories(userDashboard.value, authStore.user.targetNutritionDetails.calories)
})

const nutrientPercentage = computed(() => {
  return nutritionService.calcNutrientPercentage(userDashboard.value, authStore.user.targetNutritionDetails)
})

const calsEaten = computed(() => nutritionService.calcTotalNutritious(userDashboard.value))
const calsAndItemsEatenByMeal = computed(() => nutritionService.calcNutritiousByMeals(userDashboard.value))

const nutrientData = computed(() => {
  return [
    {
      label: 'Carbs',
      percentage: nutrientPercentage.value.carbs,
      targetAmount: authStore.user.targetNutritionDetails.carbs,
      consumedAmount: calsEaten.value.carbs,
      progressColorType: EProgressColorStatus.success
    },
    {
      label: 'Proteins',
      percentage: nutrientPercentage.value.proteins,
      targetAmount: authStore.user.targetNutritionDetails.proteins,
      consumedAmount: calsEaten.value.proteins,
      progressColorType: EProgressColorStatus.warning
    },
    {
      label: 'Fats',
      percentage: nutrientPercentage.value.fats,
      targetAmount: authStore.user.targetNutritionDetails.fats,
      consumedAmount: calsEaten.value.fats,
      progressColorType: EProgressColorStatus.exception
    }
  ]
})

const percentage = computed(() => {
  return nutritionService.calcMealCaloriesPercentage(userDashboard.value, authStore.user.targetNutritionDetailsByMeal)
})

const mealData = computed(() => {
  return [
    {
      label: 'Breakfast',
      mealType: 'breakfast',
      percentage: percentage.value.breakfast,
      caloriesConsumed: calsAndItemsEatenByMeal.value.breakfast.calories,
      icon: '🥞',
      countedItems: calsAndItemsEatenByMeal.value.breakfast.itemsCount
    },
    {
      label: 'Lunch',
      mealType: 'lunch',
      percentage: percentage.value.lunch,
      caloriesConsumed: calsAndItemsEatenByMeal.value.lunch.calories,
      icon: '🍲',
      countedItems: calsAndItemsEatenByMeal.value.lunch.itemsCount
    },
    {
      label: 'Dinner',
      mealType: 'dinner',
      percentage: percentage.value.dinner,
      caloriesConsumed: calsAndItemsEatenByMeal.value.dinner.calories,
      icon: '🥗',
      countedItems: calsAndItemsEatenByMeal.value.dinner.itemsCount
    },
    {
      label: 'Snacks',
      mealType: 'snacks',
      percentage: percentage.value.snacks,
      caloriesConsumed: calsAndItemsEatenByMeal.value.snacks.calories,
      icon: '🍎',
      countedItems: calsAndItemsEatenByMeal.value.snacks.itemsCount
    }
  ]
})

onBeforeMount(() => {
  if (date.value) {
    getUserDashboard(date.value)
  }
})
</script>

<style lang="scss" scoped>
.weight-form-wrapper ::v-deep {
  .el-form-item {
    @apply mb-1;
  }
  .el-form-item__label {
    @apply font-medium text-primary-dark text-lg leading-[24px] !important;
  }

  .el-input-number input {
    @apply font-bold text-primary-dark;
  }
}
</style>
