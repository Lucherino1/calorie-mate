<template>
  <div v-loading.fullscreen="pageLoading" class="app-container--dashboard h-full">
    <div class="flex h-full">
      <div class="flex-col flex gap-5 w-full">
        <div class="flex items-center text-center justify-between">
          <div class="flex flex-col gap-5">
            <BackButton :button-text="'Back to dashboard'" :route-name="$routeNames.dashboard" />
            <h1 class="font-bold text-primary-dark text-[34px] leading-10">
              Update your {{ mealType }}
            </h1>
          </div>

          <el-card class="px-2">
            <div class="flex text-center items-center gap-5 ">
              <p class="capitalize font-bold text-primary-dark">TOTAL:</p>
              <el-progress type="circle" :width="80" :percentage="totalCaloriesPercentage">
                <template #default>
                  <div class="flex items-center justify-center text-center">
                    <span class="text-sm text-primary-dark">
                      <b>{{ totalNutrients.calories }}</b><br>
                      <p>kcal</p>
                    </span>
                  </div>
                </template>
              </el-progress>

              <ul class="flex flex-wrap text-center gap-8 text-gray-dark text-base">
                <li class="nutrition-list__item">
                  <p class="truncate">Carbs:</p>
                  <span class="truncate">
                    <b>{{ totalNutrients.carbs }}/
                      <span class="text-sm">
                        {{ authStore.user.targetNutritionDetailsByMeal[props.mealType].carbs }}
                      </span></b> g
                  </span>
                </li>

                <li class="nutrition-list__item">
                  <p class="truncate">Proteins:</p>
                  <span class="truncate"><b>{{ totalNutrients.proteins }}/
                    <span class="text-sm">
                      {{ authStore.user.targetNutritionDetailsByMeal[props.mealType].proteins }}
                    </span></b> g
                  </span>
                </li>

                <li class="nutrition-list__item">
                  <p class="truncate">Fats:</p>
                  <span class="truncate"><b>{{ totalNutrients.fats }}/
                    <span class="text-sm">
                      {{ authStore.user.targetNutritionDetailsByMeal[props.mealType].fats }}
                    </span></b> g
                  </span>
                </li>
              </ul>
            </div>
          </el-card>
        </div>

        <div class="mx-0">
          <el-tabs v-model="activeTab" stretch class="min-h-[500px] flex">
            <el-tab-pane label="Products" name="products" class="px-10 pb-10 overflow-y-scroll">
              <UpdateMealProductsTab
                v-model:products-in-meal="productsInMeal"
                :meal-type="mealType"
                :all-products="allProducts"
                :user-meals="userMeals"
              />

              <el-empty
                v-if="!productsInMeal.length"
                class="text-2xl text-gray-light font-bold mt-5"
                :image-size="200"
                description="No products added at the moment."
              />
            </el-tab-pane>

            <el-tab-pane class="px-10 pb-10 overflow-y-scroll" label="Recipes" name="recipes">
              <UpdateMealRecipesTab
                v-model:recipes-in-meal="recipesInMeal"
                :meal-type="mealType"
                :all-recipes="allRecipes"
                :user-meals="userMeals"
              />
              <el-empty
                v-if="!recipesInMeal.length"
                class="text-2xl text-gray-light font-bold mt-5"
                description="No recipes added at the moment."
                :image-size="200"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { showNotification } from '@/helpers'

const props = defineProps<{
  mealType?: TMealType
}>()

const route = useRoute()

const dashboardStore = useDashboardStore()

const authStore = useAuthStore()

const pageLoading = ref(false)
const activeTab = ref('products')

const date = computed(() => {
  if (dashboardStore.date) return dashboardStore.date
  return route.query.selectedDate.toString()
})

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

  if (!authStore.user || !targetNutrition) return 0

  const targetCalories = targetNutrition.calories
  const percentage = updateMealService.calculateCaloriesPercentage(targetCalories, totalNutrients.value.calories)
  return Math.min(percentage, 100)
})

const getUserMeals = async () => {
  try {
    const userMeal = await updateMealService.getUserMeals(authStore.user.id, date.value, props.mealType)

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
  @apply max-w-[80px] flex flex-col gap-2 text-primary-dark;
}
</style>
