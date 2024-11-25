<template>
  <div v-loading.fullscreen="dashboardPageLoading" class="app-container--main">
    <div class="flex flex-col gap-5">
      <p class="page-header text-gray-light">
        Hello, <span class="text-primary-dark">{{ authStore.user.firstName }}!</span>
      </p>

      <div class="w-full flex justify-between">
        <el-date-picker
          v-model="dashboardStore.date"
          type="date"
          :clearable="false"
          :size="$elComponentSize.large"
          @change="handleDateChange"
        />
      </div>
    </div>

    <div class="flex gap-5 mt-10 flex-wrap">
      <el-card class="w-full h-auto flex-1 min-w-[310px]">
        <p class="section-header mb-2">Total Calories:</p>
        <div class="flex justify-center items-center">
          <ProgressCalories
            class="py-8"
            :type="'dashboard'"
            :percentage="nutrientPercentage.calories || 0"
            :stroke-width="12"
            :progress-width="220"
          >
            <template #default>
              <p class="text-gray-light leading-9">
                <b class="text-primary-dark">
                  {{ calculatedCalsRemaining < 0 ? `+${Math.abs(calculatedCalsRemaining)}` : calculatedCalsRemaining }}
                </b>
                <br>
                {{ calculatedCalsRemaining < 0 ? 'kcal over' : 'kcal left' }}
              </p>
            </template>
          </ProgressCalories>
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

      <div class="flex-1 gap-5 flex flex-col max-w-[400px]">
        <el-card class="flex justify-center text-center relative items-center min-h-[155px] weight-form-wrapper">
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
            <el-form-item prop="currentWeight">
              <div class="flex flex-col items-center">
                <p class="section-header mb-1">Your weight is:</p>
                <el-input-number
                  v-model="bodyDetailsFormModel.currentWeight"
                  :precision="1"
                  :step="0.1"
                  @input="isEditWeightMode = true"
                >
                  <template #suffix>kg</template>
                </el-input-number>
              </div>
            </el-form-item>

            <transition name="fade">
              <div v-show="isEditWeightMode" class="w-full flex justify-center items-center">
                <el-form-item class="flex items-center justify-end">
                  <el-button
                    :size="$elComponentSize.small"
                    :type="$elComponentType.danger"
                    link
                    @click="cancelEditMode()"
                  >
                    Cancel
                  </el-button>

                  <el-button
                    :size="$elComponentSize.small"
                    native-type="submit"
                    :type="$elComponentType.info"
                    link
                  >
                    Save
                  </el-button>
                </el-form-item>
              </div>
            </transition>
          </el-form>
        </el-card>

        <DashboardHydrationCard
          v-model:water-amount="waterAmount"
          :selected-date="selectedDate"
        />
      </div>
    </div>

    <div class="grid grid-cols-4 gap-5 mt-10">
      <DashboardMealCard
        v-for="meal in mealData"
        :key="meal.label"
        :label="meal.label"
        :percentage="meal.percentage || 0"
        :caloriesConsumed="meal.caloriesConsumed"
        :caloriesLimit="meal.caloriesLimit"
        :itemsCount="meal.countedItems"
        :icon="meal.icon"
        :meal-type="meal.mealType"
        :selected-date="selectedDate"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { showNotification } from '@/helpers'
import { EProgressColorStatus } from '@/views/dashboard/dashboard.enums'

const route = useRoute()

const dashboardStore = useDashboardStore()

const selectedDate = ref(new Date().toISOString().split('T')[0])

const waterAmount = ref(0)

const userDashboard = ref<IDashboard>(null)
const dashboardPageLoading = ref(false)

const authStore = useAuthStore()

const getUserDashboard = async (selectedDate: string) => {
  try {
    dashboardPageLoading.value = true
    userDashboard.value = await dashboardService.getUserDashboard(selectedDate)

    waterAmount.value = userDashboard.value.waterAmount

    dashboardPageLoading.value = false
  } catch (error) {
    showNotification()
  }
}

const handleDateChange = (newDate: string) => {
  const newSelectedDate = new Date(newDate)

  const year = newSelectedDate.getFullYear()
  const month = String(newSelectedDate.getMonth() + 1).padStart(2, '0')
  const day = String(newSelectedDate.getDate()).padStart(2, '0')

  selectedDate.value = `${year}-${month}-${day}`
  route.query.date = newSelectedDate.toString()
  dashboardStore.date = selectedDate.value
  getUserDashboard(dashboardStore.date)
}

const formRef = useTemplateRef<TElementPlus['FormInstance']>('formRef')

const formRules = { currentWeight: [useRequiredRule(), useCurrentWeightRule()] }

const bodyDetailsFormModel = reactive({ ...authStore.user.bodyDetails })

const isEditWeightMode = ref(false)

function cancelEditMode () {
  bodyDetailsFormModel.currentWeight = authStore.user.bodyDetails.currentWeight

  isEditWeightMode.value = false
  formRef.value?.resetFields()
}

async function submitBodyDetails () {
  formRef.value?.validate(async (isValid: boolean) => {
    if (!isValid) {
      showNotification('For accurate tracking, please enter a weight between 35 kg and 700 kg.', 'Invalid Weight', 'warning')
      return
    }

    isEditWeightMode.value = false
    try {
      await profileService.updateUserBodyDetails({ ...bodyDetailsFormModel })

      authStore.user.bodyDetails.currentWeight = bodyDetailsFormModel.currentWeight

      const {
        targetNutritionDetails,
        targetNutritionDetailsByMeal
      } = profileService.recalculateTargetNutrition(authStore.user)

      await Promise.all([
        profileService.updateUserTargetNutrition({ ...targetNutritionDetails }),
        profileService.updateUserTargetNutritionByMeal({ ...targetNutritionDetailsByMeal })
      ])

      showNotification('Calories have been recalculated successfully', 'Recalculation Complete', 'success')
    } catch (error) {
      showNotification()
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
      caloriesLimit: authStore.user.targetNutritionDetailsByMeal.breakfast.calories,
      icon: '🥞',
      countedItems: calsAndItemsEatenByMeal.value.breakfast.itemsCount
    },
    {
      label: 'Lunch',
      mealType: 'lunch',
      percentage: percentage.value.lunch,
      caloriesConsumed: calsAndItemsEatenByMeal.value.lunch.calories,
      caloriesLimit: authStore.user.targetNutritionDetailsByMeal.lunch.calories,
      icon: '🍲',
      countedItems: calsAndItemsEatenByMeal.value.lunch.itemsCount
    },
    {
      label: 'Dinner',
      mealType: 'dinner',
      percentage: percentage.value.dinner,
      caloriesConsumed: calsAndItemsEatenByMeal.value.dinner.calories,
      caloriesLimit: authStore.user.targetNutritionDetailsByMeal.dinner.calories,
      icon: '🥗',
      countedItems: calsAndItemsEatenByMeal.value.dinner.itemsCount
    },
    {
      label: 'Snacks',
      mealType: 'snacks',
      percentage: percentage.value.snacks,
      caloriesConsumed: calsAndItemsEatenByMeal.value.snacks.calories,
      caloriesLimit: authStore.user.targetNutritionDetailsByMeal.snacks.calories,
      icon: '🍎',
      countedItems: calsAndItemsEatenByMeal.value.snacks.itemsCount
    }
  ]
})

onBeforeMount(() => {
  if (dashboardStore.date) {
    getUserDashboard(dashboardStore.date)
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
