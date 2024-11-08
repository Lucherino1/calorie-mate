<template>
  <div class="overflow-x-auto w-full">
    <div class="w-full">
      <AppTable
        v-loading="tableLoading"
        :height="'550'"
        :headers="recipeHeaders"
        :empty-title="'No recipes added'"
        :table-data="tableData"
      >
        <template #image="{ row }">
          <div class="w-[100px] h-[100px] rounded-xl overflow-hidden">
            <SkeletonImage :img-src="row.image">
              <template #placeholder>
                <IconErrorRecipe class="fill-gray-dark" />
              </template>
            </SkeletonImage>
          </div>
        </template>

        <template #name="{ row }">
          <TruncatedTooltip :maxWidthClass="'!max-w-[80px]'" :contentProp="row.name" :multiline="2">
            <b>{{ row.name }}</b>
          </TruncatedTooltip>
        </template>

        <template #description="{ row }">
          <TruncatedTooltip :maxWidthClass="'!max-w-[80px]'" :contentProp="row.description" :multiline="4">
            {{ row.description }}
          </TruncatedTooltip>
        </template>

        <template #nutrition="{ row }">
          <div>
            <p><b>Calories:</b> {{ calculateTotalCalories(row) }} kcal</p>
            <p><b>Carbs:</b> {{ calculateTotalCarbs(row) }}g</p>
            <p><b>Proteins:</b> {{ calculateTotalProteins(row) }}g</p>
            <p><b>Fats:</b> {{ calculateTotalFats(row) }}g</p>
          </div>
        </template>

        <template #ingredients="{ row }">
          <el-popover
            placement="top"
            width="auto"
            trigger="hover"
          >
            <ul class="flex gap-5 w-auto">
              <li v-for="(ingredient, index) in row.ingredients" :key="index">
                <b>{{ ingredient.name }}</b>: <br>
                {{ ingredient.grams }}g <br>
              </li>
            </ul>
            <template #reference>
              <el-button link :size="$elComponentSize.small">show</el-button>
            </template>
          </el-popover>
        </template>

        <template #isVegan="{ row }">
          <span v-if="row.isVegan" class="fill-success">
            <IconVegan class="w-[30px] h-[30px]" />
          </span>
          <span v-else>No</span>
        </template>

        <template #actions="{ row }">
          <slot name="actions" :row />
        </template>
      </AppTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { normalizeStringLabel } from '@/helpers'

defineProps<{
  tableData: IRecipe[]
  tableLoading: boolean
}>()

const recipeHeaders: TTableHeadings<IRecipe> = [
  {
    label: 'Images',
    value: 'image',
    fixed: 'left'
  },
  {
    label: 'Recipe Name',
    value: 'name'
  },
  {
    label: 'Description',
    value: 'description',
    width: 150
  },
  {
    label: 'Nutrition',
    value: 'nutrition',
    sort: true
  },
  {
    label: 'Weight (g)',
    value: 'portionWeight',
    sort: true,
    align: 'center',
    width: 130
  },
  {
    label: 'Type',
    value: 'type',
    align: 'center',
    formatter: (row) => normalizeStringLabel(row.type)
  },
  {
    label: 'Vegan',
    value: 'isVegan',
    sort: true,
    align: 'center'
  },
  {
    label: 'Ingredients',
    value: 'ingredients',
    align: 'center',
    formatter: (row) => Math.round(nutritionService.calcTotalRecipeCalories(row))
  },
  {
    label: 'Actions',
    value: 'actions',
    align: 'center',
    width: 200
  }
]

function calculateTotalCarbs (recipe: IRecipe): number {
  return Math.round(recipe.ingredients.reduce((sum, ingredient) => sum + ingredient.nutritionDetails.carbs, 0))
}

function calculateTotalProteins (recipe: IRecipe): number {
  return Math.round(recipe.ingredients.reduce((sum, ingredient) => sum + ingredient.nutritionDetails.proteins, 0))
}

function calculateTotalFats (recipe: IRecipe): number {
  return Math.round(recipe.ingredients.reduce((sum, ingredient) => sum + ingredient.nutritionDetails.fats, 0))
}

function calculateTotalCalories (recipe: IRecipe): number {
  return nutritionService.calculateTotalCalories(recipe)
}

</script>
