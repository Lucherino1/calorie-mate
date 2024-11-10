<template>
  <AppTable
    v-loading="tableLoading"
    :height="tableHeight"
    :headers="recipeHeaders"
    :empty-title="'No recipes added'"
    :table-data="tableData"
  >
    <template #image="{ row }">
      <div class="w-[100px] h-[100px] rounded-xl overflow-hidden">
        <!-- <img :src="row.image"> -->
        <SkeletonImage :key="row.image" v-model:src="row.image">
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
        <p><b>Calories:</b> {{ calculateTotalNutrition(row).calories }} kcal</p>
        <p><b>Carbs:</b> {{ calculateTotalNutrition(row).carbs }}g</p>
        <p><b>Proteins:</b> {{ calculateTotalNutrition(row).proteins }}g</p>
        <p><b>Fats:</b> {{ calculateTotalNutrition(row).fats }}g</p>
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
</template>

<script lang="ts" setup>
import { normalizeStringLabel } from '@/helpers'

defineProps<{
  tableData: IRecipe[]
  tableLoading: boolean
  tableHeight: string
}>()

const recipeHeaders: TTableHeadings<IRecipe> = [
  {
    label: 'Images',
    value: 'image'
  },
  {
    label: 'Recipe Name',
    value: 'name'
  },
  {
    label: 'Description',
    value: 'description',
    minWidth: 170
  },
  {
    label: 'Nutrition',
    value: 'nutrition',
    sort: true,
    minWidth: 170
  },
  {
    label: 'Weight (g)',
    value: 'portionWeight',
    sort: true,
    align: 'center'
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
    align: 'center'

  },
  {
    label: 'Actions',
    value: 'actions',
    align: 'center',
    width: 200

  }
]

function calculateTotalNutrition (recipe: IRecipe): INutritionDetails {
  return recipe.ingredients.reduce((totals, ingredient) => {
    const nutrition = nutritionService.calcNutritionPerGrams(ingredient.nutritionDetails, ingredient.grams || 100)

    Object.keys(nutrition).forEach(key => {
      totals[key] = (totals[key] || 0) + nutrition[key]
    })

    return totals
  }, { calories: 0, carbs: 0, proteins: 0, fats: 0 })
}
</script>
