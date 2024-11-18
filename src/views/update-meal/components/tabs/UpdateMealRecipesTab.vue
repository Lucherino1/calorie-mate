<template>
  <div class="rounded-lg h-full flex flex-col gap-8">
    <el-select
      v-model="searchQuery"
      filterable
      :filter-method="filterRecipes"
      :size="$elComponentSize.large"
      placeholder="Enter a recipe name, e.g. 'chicken salad', 'strawberry cheesecake'"
      clearable
    >
      <el-option
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        :label="recipe.name"
        :value="recipe.name"
        @click="addRecipeToMeal(recipe)"
      >
        <p class="font-semibold">{{ recipe.name }}</p>
      </el-option>

      <template #empty>No recipes match</template>
    </el-select>

    <div class="flex flex-col gap-5 h-full overflow-y-auto">
      <UpdateMealRecipeCard
        v-for="recipe in recipesInMeal"
        :key="recipe.id"
        v-model:remove-button-loading="isButtonRemoveLoading[recipe.id]"
        :recipe="recipe"
        @update-recipe="handleRecipeUpdate"
        @remove-recipe="handleRecipeRemove"
      />

      <el-empty
        v-if="!recipesInMeal.length"
        class="text-2xl text-gray-light font-bold mt-10"
        description="No recipes added at the moment."
        :image-size="200"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { showNotification } from '@/helpers'

const props = defineProps<{
  mealType: TMealType
  allRecipes: IRecipe[]
}>()

const isButtonRemoveLoading = ref<Record<string, boolean>>({})

const recipesInMeal = defineModel<IRecipe[]>('recipesInMeal')
const userMeals = defineModel<IMeals>('user-meals')

const dashboardStore = useDashboardStore()

const searchQuery = ref('')
const filteredRecipes = ref<IRecipe[]>([])

function filterRecipes (searchQuery: string) {
  if (!searchQuery) {
    filteredRecipes.value = props.allRecipes
  } else {
    filteredRecipes.value = props.allRecipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }
}

async function addRecipeToMeal (recipe: IRecipe) {
  if (recipesInMeal.value.some(recip => recip.id === recipe.id)) {
    showNotification('You may just change your portion count', 'This recipe is already added to your meal.', 'warning')
    return
  }

  const newRecipe: IRecipe = { ...recipe, portions: 1 }
  recipesInMeal.value.push(newRecipe)
  userMeals.value.recipes.push(newRecipe)

  try {
    await updateMealService.updateMeal({
      date: dashboardStore.date,
      mealType: props.mealType,
      newItem: newRecipe,
      mealComponent: 'recipes'
    })
  } catch (error) {
    showNotification()
  }
}

async function handleRecipeUpdate (updatedRecipe: IRecipe) {
  const index = recipesInMeal.value.findIndex(recipe => recipe.id === updatedRecipe.id)

  if (index !== -1) {
    recipesInMeal.value[index] = { ...updatedRecipe }
    userMeals.value.recipes = [...recipesInMeal.value]

    try {
      await updateMealService.updateMeal({
        date: dashboardStore.date,
        mealType: props.mealType,
        newItem: updatedRecipe,
        mealComponent: 'recipes',
        currentMealData: userMeals.value
      })
    } catch (error) {
      showNotification()
    }
  } else {
    showNotification()
  }
}

async function handleRecipeRemove (recipeId: string) {
  isButtonRemoveLoading.value[recipeId] = true

  try {
    await updateMealService.removeProduct({
      date: dashboardStore.date,
      mealType: props.mealType,
      productId: recipeId,
      mealComponent: 'recipes'
    })

    recipesInMeal.value = recipesInMeal.value.filter(recipe => recipe.id !== recipeId)
  } catch (error) {
    showNotification()
  } finally {
    isButtonRemoveLoading.value[recipeId] = false
  }
}
</script>
