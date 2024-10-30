<template>
  <div class="dashboard-container">
    <div class="flex justify-between">
      <div class="flex flex-col justify-between">
        <p class="font-bold text-gray-light text-[34px] leading-10">
          Hello, <span class="text-primary-dark">{{ userName }}!</span>
        </p>
        <div class="date-picker-wrapper w-full flex justify-between">
          <el-date-picker
            v-model="date"
            type="date"
            :clearable="false"
            start-placeholder="true"
            :size="$elComponentSize.large"
          />
        </div>
      </div>
      <el-card class="flex justify-center items-center max-w-[300px] h-[150px] weight-form-wrapper">
        <el-form
          ref="formRef"
          :model="currentWeightFormModel"
          :size="$elComponentSize.large"
          label-position="top"
        >
          <el-form-item label="Your weight is:" prop="currentWeight">
            <el-input-number
              v-model="currentWeightFormModel.currentWeight"
              :precision="1"
              :step="0.1"
            />
          </el-form-item>
          <div v-if="isWeightEditMode" class="flex items-center justify-end">
            <el-form-item class="flex items-center justify-end">
              <el-button :type="$elComponentType.danger" link>
                Cancel
              </el-button>
              <el-button native-type="submit" :type="$elComponentType.info" link>
                Save
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-card>
    </div>
    <div class="flex gap-5 mt-10">
      <el-card class="w-full h-auto flex-1">
        <p class="card-header">Total Calories:</p>
        <div class="flex justify-center items-center">
          <el-progress
            type="dashboard"
            class="py-8"
            :percentage="caloriesProgressPercentage"
            :stroke-width="12"
            :width="200"
            :color="colors"
          >
            <template #default>
              LEFT
            </template>
          </el-progress>
        </div>
      </el-card>
      <div class="flex flex-1 flex-col w-full justify-between">
        <el-card class="text-sm text-dark">
          <p class="text-primary-dark font-semibold">Carbs:</p>
          <el-progress class="py-[2px]" text-inside :stroke-width="15" :percentage="70" status="success" />
          <p class="text-sm text-gray-light">0/{{ userTargetNutrition.carbs }}g</p>
        </el-card>
        <el-card class="text-sm text-dark">
          <p class="text-primary-dark font-semibold">Proteins:</p>
          <el-progress class="py-[2px]" text-inside :stroke-width="15" :percentage="78" status="warning" />
          <p class="text-sm text-gray-light">0/{{ userTargetNutrition.proteins }}g</p>
        </el-card>
        <el-card class="text-sm text-dark">
          <p class="text-primary-dark font-semibold">Fats:</p>
          <el-progress class="py-[2px]" text-inside :stroke-width="15" :percentage="20" status="exception" />
          <p class="text-sm text-gray-light">0/{{ userTargetNutrition.fats }}g</p>
        </el-card>
      </div>
      <el-card
        class="w-full h-auto flex-1"
      >
        <div class="text-[34px] leading-10">
          <p class="card-header">Hydration:</p>
        </div>
      </el-card>
    </div>
    <div class="grid grid-cols-4 gap-5 mt-10">
      <el-card class="flex flex-col items-center text-center">
        <p class="font-bold text-lg">Breakfast</p>
        <el-progress type="circle" :percentage="75">
          <template #default>
            <div class="w-[55px] h-[55px] mx-auto">
              <img
                class="bg-gray overflow-hidden w-full h-auto object-cover"
                src="/src/assets/images/meals/breakfast.png"
                srcset="/src/assets/images/meals/breakfast.png 1x, /src/assets/images/meals/breakfast@2.png 2x"
                alt="Meal"
                loading="lazy"
              >
            </div>
          </template>
        </el-progress>
        <p class="font-semibold text-lg">568 cal</p>
        <p class="text-sm text-gray-500">6 items</p>
      </el-card>
      <el-card class="flex flex-col items-center text-center">
        <p class="font-bold text-lg">Breakfast</p>
        <el-progress type="circle" :percentage="75">
          <template #default>
            <div class="w-[55px] h-[55px] mx-auto">
              <img
                class="bg-gray overflow-hidden w-full h-auto object-cover"
                src="/src/assets/images/meals/breakfast.png"
                srcset="/src/assets/images/meals/breakfast.png 1x, /src/assets/images/meals/breakfast@2.png 2x"
                alt="Meal"
                loading="lazy"
              >
            </div>
          </template>
        </el-progress>
        <p class="font-semibold text-lg">568 cal</p>
        <p class="text-sm text-gray-500">6 items</p>
      </el-card>
      <el-card class="flex flex-col items-center text-center">
        <p class="font-bold text-lg">Breakfast</p>
        <el-progress type="circle" :percentage="75">
          <template #default>
            <div class="w-[55px] h-[55px] mx-auto">
              <img
                class="bg-gray overflow-hidden w-full h-auto object-cover"
                src="/src/assets/images/meals/breakfast.png"
                srcset="/src/assets/images/meals/breakfast.png 1x, /src/assets/images/meals/breakfast@2.png 2x"
                alt="Meal"
                loading="lazy"
              >
            </div>
          </template>
        </el-progress>
        <p class="font-semibold text-lg">568 cal</p>
        <p class="text-sm text-gray-500">6 items</p>
      </el-card>
      <el-card class="flex flex-col items-center text-center">
        <p class="font-bold text-lg">Breakfast</p>
        <el-progress type="circle" :percentage="75">
          <template #default>
            <div class="w-[55px] h-[55px] mx-auto">
              <img
                class="bg-gray w-full h-auto object-cover"
                src="/src/assets/images/meals/breakfast.png"
                srcset="/src/assets/images/meals/breakfast.png 1x, /src/assets/images/meals/breakfast@2.png 2x"
                alt="Meal"
                loading="lazy"
              >
            </div>
          </template>
        </el-progress>
        <p class="font-semibold text-lg">568 cal</p>
        <p class="text-sm text-gray-500">6 items</p>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const userName = computed(() => user.value?.firstName)

const userTargetNutrition = computed(() => {
  return { ...user.value?.targetNutritionDetails }
})

const userTargetNutritionByMeal = computed(() => {
  return { ...user.value?.targetNutritionDetailsByMeal }
})

const date = ref(new Date().toISOString().split('T')[0])

const isWeightEditMode = computed(() => {
  if (currentWeightFormModel.currentWeight !== user.value?.bodyDetails.currentWeight) {
    return true
  }
  return false
})

const formRef = useTemplateRef<TElementPlus['FormInstance']>('formRef')

const currentWeightFormModel = reactive<ICurrentWeight>({
  currentWeight: user.value?.bodyDetails.currentWeight
})

// Calories
const colors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#4318ff', percentage: 100 }
]

// Test for calories progress
const caloriesProgressPercentage = ref(90)

// MOCK!!!!!
const mockDashboards: IDashboard = {
  id: '1',
  date: '2024-10-01',
  userId: 'user_123',
  waterAmount: 2000,
  meals: [
    {
      products: [
        {
          id: 'product_1',
          name: 'Apple',
          nutritionDetails: {
            calories: 52,
            fats: 0.2,
            carbs: 14,
            proteins: 0.3
          },
          type: 'fruit',
          isVegan: true,
          userId: '',
          isUnderReview: false
        },
        {
          id: 'product_2',
          name: 'Peanut Butter',
          nutritionDetails: {
            calories: 94,
            fats: 8.2,
            carbs: 3,
            proteins: 4
          },
          type: 'nut',
          isVegan: true,
          userId: '',
          isUnderReview: false
        }
      ],
      recipes: [
        {
          id: 'recipe_1',
          name: 'Vegan Salad',
          userId: 'user_123',
          description: 'A refreshing vegan salad with mixed greens and nuts.',
          image: 'salad.jpg',
          portionWeight: 150,
          type: 'salad',
          isVegan: true,
          ingredients: [
            {
              id: 'product_3',
              name: 'Lettuce',
              nutritionDetails: {
                calories: 15,
                fats: 0.1,
                carbs: 3,
                proteins: 1
              },
              type: 'vegetable',
              isVegan: true,
              userId: '',
              isUnderReview: false
            }
          ],
          isUnderReview: false
        }
      ],
      type: 'breakfast'
    },
    {
      products: [
        {
          id: 'product_1',
          name: 'Apple',
          nutritionDetails: {
            calories: 52,
            fats: 0.2,
            carbs: 14,
            proteins: 0.3
          },
          type: 'fruit',
          isVegan: true,
          userId: '',
          isUnderReview: false
        },
        {
          id: 'product_2',
          name: 'Peanut Butter',
          nutritionDetails: {
            calories: 94,
            fats: 8.2,
            carbs: 3,
            proteins: 4
          },
          type: 'nut',
          isVegan: true,
          userId: '',
          isUnderReview: false
        }
      ],
      recipes: [
        {
          id: 'recipe_1',
          name: 'Vegan Salad',
          userId: 'user_123',
          description: 'A refreshing vegan salad with mixed greens and nuts.',
          image: 'salad.jpg',
          portionWeight: 150,
          type: 'salad',
          isVegan: true,
          ingredients: [
            {
              id: 'product_3',
              name: 'Lettuce',
              nutritionDetails: {
                calories: 15,
                fats: 0.1,
                carbs: 3,
                proteins: 1
              },
              type: 'vegetable',
              isVegan: true,
              userId: '',
              isUnderReview: false
            }
          ],
          isUnderReview: false
        }
      ],
      type: 'snacks'
    }
  ]
}

console.log(nutritionService.calculateMealCaloriesPercentage(mockDashboards, userTargetNutritionByMeal.value))
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
