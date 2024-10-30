<template>
  <div v-loading.fullscreen="dashboardPageLoading" class="dashboard-container">
    <div class="flex flex-col gap-5">
      <p class="font-bold text-gray-light text-[34px] leading-10">
        Hello, <span class="text-primary-dark">{{ user?.firstName }}!</span>
      </p>
      <div class="date-picker-wrapper w-full flex justify-between">
        <el-date-picker
          v-model="date"
          type="date"
          :clearable="false"
          start-placeholder="true"
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
            :percentage="nutrientPersentage.calories"
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
        <NutrientCard
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
            class=""
            :model="bodyDetailsFormModel"
            :rules="formRules"
            :size="$elComponentSize.large"
            label-position="top"
            hide-required-asterisk
            @submit.prevent="submit"
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
                  <el-button :type="$elComponentType.danger" link @click="isEditWeightMode = false">
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
        <el-card
          class="w-full h-auto flex-1"
        >
          <div class="text-[34px] leading-10">
            <p class="card-header">Hydration:</p>
          </div>
        </el-card>
      </div>
    </div>
    <div class="grid grid-cols-4 gap-5 mt-10">
      <MealCard
        v-for="meal in mealData"
        :key="meal.label"
        :label="meal.label"
        :percentage="meal.percentage || 0"
        :caloriesConsumed="meal.caloriesConsumed"
        :itemsCount="meal.countedItems"
        :image="meal.image"
        :meal-type="meal.mealType"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { EProgressColorStatus } from '@/views/dashboard/dashboard.enums'

const dashboardStore = useDashboardStore()
const { getUserDashboard } = dashboardStore
const { userDashboard, date, dashboardPageLoading, calsEaten, calsAndItemsEatenByMeal } = storeToRefs(dashboardStore)

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const handleDateChange = (newDate: string) => {
  const selectedDate = new Date(newDate)

  const year = selectedDate.getFullYear()
  const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
  const day = String(selectedDate.getDate()).padStart(2, '0')

  date.value = `${year}-${month}-${day}`
  getUserDashboard(date.value)
}

const formRef = useTemplateRef<TElementPlus['FormInstance']>('formRef')

const formRules = reactive({
  age: [useRequiredRule(), useMinAgeRule()],
  sex: useRequiredRule(),
  activityLevel: useRequiredRule(),
  height: [useRequiredRule(), useHeightRangeRule()],
  currentWeight: [useRequiredRule(), useCurrentWeightRule()],
  goalWeight: [
    useRequiredRule(),
    useGoalWeightRule()
  ]
})

const bodyDetailsFormModel = reactive<IBodyDetails>({
  age: user.value?.bodyDetails.age ?? 0,
  sex: user.value?.bodyDetails.sex ?? 'male',
  activityLevel: user.value?.bodyDetails.activityLevel ?? 1.2,
  height: user.value?.bodyDetails.height ?? 0,
  currentWeight: user.value?.bodyDetails.currentWeight ?? 0,
  goalWeight: user.value?.bodyDetails.goalWeight ?? 0
})

const isEditWeightMode = ref(false)

function submit () {
  isEditWeightMode.value = false
  formRef.value?.validate(async (isValid: boolean) => {
    if (!bodyDetailsFormModel) return
    if (isValid) {
      try {
        if (!user.value?.id) {
          return
        }
        profileService.recalculateTargetNutrition(user.value)

        await profileService.updateUserBodyDetails(user.value?.id, { ...bodyDetailsFormModel })

        user.value.bodyDetails = bodyDetailsFormModel
      } catch (error) {
        console.error(error)
      }
    }
  })
}

const userTargetNutrition = computed(() => {
  if (user.value?.targetNutritionDetails !== undefined) {
    return { ...user.value?.targetNutritionDetails }
  }
  return {
    calories: 0,
    carbs: 0,
    proteins: 0,
    fats: 0
  }
})

const userTargetNutritionByMeal = computed(() => {
  if (user.value === undefined) return {}
  return { ...user.value?.targetNutritionDetailsByMeal }
})

const calculatedCalsRemaining = computed(() => {
  return nutritionService.calcRemainingCalories(userDashboard.value, userTargetNutrition.value.calories)
})

const nutrientPersentage = computed(() => {
  return nutritionService.calcNutrientPercentage(userDashboard.value, userTargetNutrition.value)
})

const nutrientData = computed(() => {
  return [
    {
      label: 'Carbs',
      percentage: nutrientPersentage.value.carbs,
      targetAmount: userTargetNutrition.value.carbs,
      consumedAmount: calsEaten.value.carbs,
      image: '/src/assets/images/nutrients/carbs.png',
      progressColorType: EProgressColorStatus.success
    },
    {
      label: 'Proteins',
      percentage: nutrientPersentage.value.proteins,
      targetAmount: userTargetNutrition.value.proteins,
      consumedAmount: calsEaten.value.proteins,
      image: '/src/assets/images/nutrients/proteins.png',
      progressColorType: EProgressColorStatus.warning
    },
    {
      label: 'Fats',
      percentage: nutrientPersentage.value.fats,
      targetAmount: userTargetNutrition.value.fats,
      consumedAmount: calsEaten.value.fats,
      image: '/src/assets/images/nutrients/fats.png',
      progressColorType: EProgressColorStatus.exception
    }
  ]
})

const mealData = computed(() => {
  const percentage = nutritionService.calcMealCaloriesPercentage(userDashboard.value, userTargetNutritionByMeal.value)

  return [
    {
      label: 'Breakfast',
      mealType: 'breakfast',
      percentage: percentage.breakfast,
      caloriesConsumed: calsAndItemsEatenByMeal.value.breakfast.calories,
      image: '/src/assets/images/meals/breakfast.png',
      countedItems: calsAndItemsEatenByMeal.value.breakfast.itemsCount
    },
    {
      label: 'Lunch',
      mealType: 'lunch',
      percentage: percentage.lunch,
      caloriesConsumed: calsAndItemsEatenByMeal.value.lunch.calories,
      image: '/src/assets/images/meals/lunch.png',
      countedItems: calsAndItemsEatenByMeal.value.lunch.itemsCount
    },
    {
      label: 'Dinner',
      mealType: 'dinner',
      percentage: percentage.dinner,
      caloriesConsumed: calsAndItemsEatenByMeal.value.dinner.calories,
      image: '/src/assets/images/meals/dinner.png',
      countedItems: calsAndItemsEatenByMeal.value.dinner.itemsCount
    },
    {
      label: 'Snacks',
      mealType: 'snacks',
      percentage: percentage.snacks,
      caloriesConsumed: calsAndItemsEatenByMeal.value.snacks.calories,
      image: '/src/assets/images/meals/snack.png',
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
.date-picker-wrapper ::v-deep {
  .el-input__wrapper {
    @apply bg-primary;
  }

  .el-input__prefix,
  .el-input__inner,
  .el-input__inner::placeholder,
  .el-input__suffix {
    @apply text-white font-normal text-base text-center;
  }
}

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
