<template>
  <el-card
    :loading="tableLoading"
    class="pt-5 h-full w-full card--no-shadow overflow-x-scroll"
  >
    <div class="flex flex-col h-full items-center">
      <RecipesAndProductsRecipesTable
        table-height="650"
        :table-data="recipes"
        :table-loading="tableLoading"
      >
        <template #actions="{ row }">
          <div class="flex items-center justify-center">
            <el-button
              :type="$elComponentType.danger"
              :size="$elComponentSize.small"
              @click="rejectProduct(row.id, row.name)"
            >
              Reject
            </el-button>
            <el-button
              :type="$elComponentType.primary"
              :size="$elComponentSize.small"
              @click="approveProduct(row.id)"
            >
              Approve
            </el-button>
          </div>
        </template>
      </RecipesAndProductsRecipesTable>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { showConfirmationDialog, showNotification } from '@/helpers'

const recipes = ref<IRecipe[]>([])
const tableLoading = ref(false)

async function getRecipes () {
  tableLoading.value = true

  try {
    const data = await approveService.getPendingApprovalRecipes()

    recipes.value = data
  } catch (error) {
    showNotification()
  } finally {
    tableLoading.value = false
  }
}

async function approveProduct (productId: string) {
  tableLoading.value = true
  try {
    await approveService.recipeReview({ id: productId, approve: true })

    recipes.value = recipes.value.filter(product => product.id !== productId)

    showNotification('Recipe was approved successfully', 'Success', 'success')
  } catch (error) {
    showNotification()
  } finally {
    tableLoading.value = false
  }
}

async function rejectProduct (productId: string, recipeName: string) {
  try {
    await showConfirmationDialog({
      title: 'Recipe rejecting',
      message: `Are you sure you want to reject "${recipeName}"?`
    })

    tableLoading.value = true

    await approveService.recipeReview({ id: productId, approve: false })

    recipes.value = recipes.value.filter(product => product.id !== productId)
    showNotification('Recipe was rejected successfully', 'Success', 'success')
  } catch (error) {
    if (error !== 'cancel') {
      showNotification()
    }
  } finally {
    tableLoading.value = false
  }
}

onMounted(async () => {
  getRecipes()
})
</script>
