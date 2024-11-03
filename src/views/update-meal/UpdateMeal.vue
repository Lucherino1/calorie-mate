<template>
  <div v-loading.fullscreen="pageLoading" class="app-container--dashboard h-full">
    <div class="flex h-full">
      <div class="flex-col flex gap-5 w-full">
        <h1 class="font-bold text-primary-dark text-[34px] leading-10">
          Update your {{ mealType }}
        </h1>

        <div class="mx-0">
          <el-tabs v-model="activeTab" stretch class="min-h-[500px] flex">
            <el-tab-pane label="Products" name="products" class="px-10 pb-10 overflow-y-scroll">
              <UpdateMealProductsTab
                v-model:products-in-meal="productsInMeal"
                :meal-type="mealType"
                :all-products="allProducts"
              />
            </el-tab-pane>

            <el-tab-pane class="px-10 pb-10 overflow-y-scroll" label="Recipes" name="recipes">
              <UpdateMealRecipesTab
                v-model:recipes-in-meal="recipesInMeal"
                :meal-type="mealType"
                :all-recipes="allRecipes"
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

const dashboardStore = useDashboardStore()

const authStore = useAuthStore()

const pageLoading = ref(false)
const activeTab = ref('products')

const userMeals = ref<IMeals>(null)
const allProducts = ref<IProduct[]>([])
const productsInMeal = ref<IProduct[]>([])

const allRecipes = ref<IRecipe[]>([])
const recipesInMeal = ref<IRecipe[]>([])

const getUserMeals = async () => {
  try {
    const userMeal = await updateMealService.getUserMeals(authStore.user.id, dashboardStore.date, props.mealType)
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
  @apply max-w-[80px] flex flex-col gap-5;
}
</style>
