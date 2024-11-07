<template>
  <ProductsAndRecipesTabsWrapper
    v-model:active-tab="activeTab"
    :back-button="true"
    :page-title="`Update your ${mealType}`"
    :loading="pageLoading"
  >
    <template #header>
      <el-card class="px-2">
        <div class="flex text-center items-center gap-5 ">
          <p class="capitalize font-bold text-primary-dark">TOTAL:</p>
          <ProgressCalories
            :type="'circle'"
            :percentage="totalCaloriesPercentage || 0"
            :progress-width="80"
          >
            <template #default>
              <div class="flex items-center justify-center text-center">
                <span class="text-sm text-primary-dark">
                  <b>{{ totalNutrients.calories }}</b><br>
                  <p>kcal</p>
                </span>
              </div>
            </template>
          </ProgressCalories>

          <ul class="flex flex-wrap text-center gap-8 text-gray-dark text-base">
            <li class="nutrition-list__item">
              <p class="truncate">Carbs:</p>
              <span class="truncate">
                <b>{{ totalNutrients.carbs }}/
                  {{ authStore.user.targetNutritionDetailsByMeal[props.mealType].carbs }}
                </b> g
              </span>
            </li>

            <li class="nutrition-list__item">
              <p class="truncate">Proteins:</p>
              <span class="truncate"><b>{{ totalNutrients.proteins }}/
                {{ authStore.user.targetNutritionDetailsByMeal[props.mealType].proteins }}
              </b> g
              </span>
            </li>

            <li class="nutrition-list__item">
              <p class="truncate">Fats:</p>
              <span class="truncate"><b>{{ totalNutrients.fats }}/
                {{ authStore.user.targetNutritionDetailsByMeal[props.mealType].fats }}
              </b> g
              </span>
            </li>
          </ul>
        </div>
      </el-card>
    </template>

    <template #products>
      <UpdateMealProductsTab
        v-model:products-in-meal="productsInMeal"
        :meal-type="mealType"
        :all-products="allProducts"
        :user-meals="userMeals"
      />
    </template>

    <template #recipes>
      <UpdateMealRecipesTab
        v-model:recipes-in-meal="recipesInMeal"
        :meal-type="mealType"
        :all-recipes="allRecipes"
        :user-meals="userMeals"
      />
    </template>
  </ProductsAndRecipesTabsWrapper>
</template>

<script lang="ts" setup>
import { showNotification } from '@/helpers'

const props = defineProps<{
  mealType?: TMealType
}>()

const dashboardStore = useDashboardStore()

const authStore = useAuthStore()

const pageLoading = ref(false)
const activeTab = ref('products')

const userMeals = ref<IMeals>(null)

const allProducts = ref<IProduct[]>([])
const productsInMeal = ref<IProduct[]>([])

const allRecipes = ref<IRecipe[]>([])
const recipesInMeal = ref<IRecipe[]>([])

const totalNutrients = computed(() => {
  return updateMealService.calculateTotalNutrients(productsInMeal.value, recipesInMeal.value)
})

const totalCaloriesPercentage = computed(() => {
  const targetNutrition = authStore.user.targetNutritionDetailsByMeal[props.mealType]
  const targetCalories = targetNutrition.calories

  const percentage = updateMealService.calculateCaloriesPercentage(targetCalories, totalNutrients.value.calories)
  return Math.min(percentage, 100)
})

const getUserMeals = async () => {
  try {
    const userMeal = await updateMealService.getUserMeals(dashboardStore.date, props.mealType)

    userMeals.value = userMeal

    productsInMeal.value = userMeal.products.map(userProduct => ({ ...userProduct })).reverse()
    recipesInMeal.value = userMeal.recipes.map(userRecipe => ({ ...userRecipe })).reverse()
    return userMeal
  } catch (error) {
    showNotification()
  }
}

const getAllProducts = async () => {
  try {
    pageLoading.value = true

    if (!userMeals.value) {
      await getUserMeals()
    }

    const [userProducts, products] = await Promise.all([
      productsAndRecipesService.getUserProduct(),
      productsAndRecipesService.getGlobalProducts()
    ])

    allProducts.value = [...userProducts, ...products]
    pageLoading.value = false
  } catch (error) {
    showNotification()
  }
}

const getAllRecipes = async () => {
  try {
    pageLoading.value = true

    if (!userMeals.value) {
      await getUserMeals()
    }

    const [userRecipes, recipes] = await Promise.all([
      productsAndRecipesService.getUserRecipes(),
      productsAndRecipesService.getGlobalRecipes()
    ])

    allRecipes.value = [...userRecipes, ...recipes]
    pageLoading.value = false
  } catch (error) {
    showNotification()
  }
}

watch(activeTab, (newTab) => {
  if (newTab === 'recipes' && !allRecipes.value.length) {
    getAllRecipes()
  }
})

onBeforeMount(() => {
  getAllProducts()
})
</script>

<style lang="scss" scoped>
.nutrition-list__item {
  @apply max-w-[80px] flex gap-2 flex-col text-sm text-primary-dark;
}
</style>
