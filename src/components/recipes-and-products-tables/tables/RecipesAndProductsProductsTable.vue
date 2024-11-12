<template>
  <AppTable
    v-loading="tableLoading"
    :height="tableHeight"
    empty-title="No products added"
    :headers="productHeaders"
    :table-data="tableData"
    @sort-change="handleSortChange"
  >
    <template #name="{ row }">
      <TruncatedTooltip :maxWidthClass="'!max-w-[80px]'" :contentProp="row.name" :multiline="2">
        <b>{{ row.name }}</b>
      </TruncatedTooltip>
    </template>

    <template #isVegan="{ row }">
      <span v-if="row.isVegan" class="fill-success">
        <IconVegan />
      </span>
      <span v-else>No</span>
    </template>=

    <template #actions="{ row }">
      <slot name="actions" :row="row" />
    </template>
  </AppTable>
</template>

<script lang="ts" setup>
import { normalizeStringLabel } from '@/helpers'

defineProps<{
  tableData: IProduct[]
  tableLoading: boolean
  tableHeight: string
  handleSortChange?: () => IProduct[]
}>()

const productHeaders: TTableHeadings<IProduct> = [
  {
    label: 'Product Name',
    value: 'name',
    minWidth: 200
  },
  {
    label: 'Calories (kcal)',
    value: 'nutritionDetails.calories',
    sort: true,
    align: 'center',
    formatter: (row) => Math.round(row.nutritionDetails.calories),
    minWidth: 200
  },
  {
    label: 'Carbs (g)',
    value: 'nutritionDetails.carbs',
    sort: true,
    align: 'center',
    formatter: (row) => Math.round(row.nutritionDetails.carbs),
    minWidth: 120
  },
  {
    label: 'Proteins (g)',
    value: 'nutritionDetails.proteins',
    sort: true,
    align: 'center',
    formatter: (row) => Math.round(row.nutritionDetails.proteins),
    minWidth: 180
  },
  {
    label: 'Fats (g)',
    value: 'nutritionDetails.fats',
    sort: true,
    align: 'center',
    formatter: (row) => Math.round(row.nutritionDetails.fats),
    minWidth: 120
  },
  {
    label: 'Type',
    value: 'type',
    formatter: (row) => normalizeStringLabel(row.type),
    minWidth: 120
  },
  {
    label: 'Vegan',
    value: 'isVegan',
    sort: true,
    align: 'center',
    minWidth: 120
  },
  {
    label: 'Actions',
    value: 'actions',
    align: 'center',
    minWidth: 200
  }
]
</script>
