<template>
  <div class="rounded-lg">
    <div>
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
    </div>

    <div class="mt-8 flex flex-col gap-5 max-h-[500px] overflow-y-auto">
      <UpdateMealRecipeCard
        v-for="recipe in recipesInMeal"
        :key="recipe.id"
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
    showNotification('Failed to add the recipe to the meal.', 'error')
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
      showNotification('Failed to update the recipe in the meal.', 'error')
    }
  } else {
    showNotification('Recipe not found in meal', 'Error', 'error')
  }
}

async function handleRecipeRemove (recipeId: string) {
  const index = recipesInMeal.value.findIndex(recipe => recipe.id === recipeId)
  if (index !== -1) {
    recipesInMeal.value.splice(index, 1)
    try {
      await updateMealService.removeProduct({
        date: dashboardStore.date,
        mealType: props.mealType,
        productId: recipeId,
        mealComponent: 'recipes'
      })
    } catch (error) {
      showNotification()
    }
  }
}
</script>
