<template>
  <div class="rounded-lg">
    <div class="mt-5">
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
          <div class="flex justify-between w-full">
            <p class="font-semibold">{{ recipe.name }}</p>
            <p>portion weight: <b>{{ recipe.portionWeight }}</b> g</p>
          </div>
        </el-option>
        <template #empty>No recipes match</template>
      </el-select>
    </div>

    <div class="mt-8 flex flex-col gap-5 max-h-[500px] overflow-y-scroll">
      <UpdateMealRecipeCard
        v-for="recipe in recipesInMeal"
        :key="recipe.id"
        :recipe="recipe"
        @update-recipe="handleRecipeUpdate"
        @remove-recipe="handleRecipeRemove"
      />
    </div>

    <div v-if="recipesInMeal.length > recipesPerPage" class="mt-5">
      <el-button
        type="primary"
        @click="loadMoreRecipes"
      >
        See more
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { showNotification } from '@/helpers'

const props = defineProps<{
  mealType: TMealType
  allRecipes: IRecipe[]
  userMeals?: IMeals // добавлено поле для передачи текущих данных о приемах пищи
}>()

const recipesInMeal = defineModel<IRecipe[]>('recipesInMeal')

const dashboardStore = useDashboardStore()
const authStore = useAuthStore()

const recipesPerPage = ref(5)

function loadMoreRecipes () {
  recipesPerPage.value += 5
}

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
  const isRecipeAlreadyInMeal = recipesInMeal.value.some(recip => recip.id === recipe.id)

  if (isRecipeAlreadyInMeal) {
    showNotification('You may just change your portion count', 'This recipe is already added to your meal.', 'warning')
  } else {
    const defaultPortion = 1
    const newRecipe: IRecipe = { ...recipe, portions: defaultPortion }

    recipesInMeal.value.unshift(newRecipe)
    try {
      await updateMealService.updateMeal(authStore.user.id, dashboardStore.date, props.mealType, newRecipe, 'recipes')
    } catch (error) {
      showNotification()
    }
  }
}

async function handleRecipeUpdate (updatedRecipe: IRecipe) {
  const index = recipesInMeal.value.findIndex(recipe => recipe.id === updatedRecipe.id)
  if (index !== -1) recipesInMeal.value[index] = updatedRecipe

  try {
    await updateMealService.updateMeal(
      authStore.user.id,
      dashboardStore.date,
      props.mealType,
      updatedRecipe,
      'recipes',
      props.userMeals
    )
  } catch (error) {
    showNotification()
  }
}

async function handleRecipeRemove (recipeId: string) {
  const index = recipesInMeal.value.findIndex(recipe => recipe.id === recipeId)
  if (index !== -1) {
    recipesInMeal.value.splice(index, 1)

    try {
      await updateMealService.removeProduct(
        authStore.user.id,
        dashboardStore.date,
        props.mealType,
        recipeId,
        'recipes'
      )
    } catch (error) {
      showNotification()
    }
  }
}
</script>
