<template>
  <el-card
    :loading="tableLoading"
    class="pt-5 h-full w-full card--no-shadow overflow-x-scroll"
  >
    <div class="flex flex-col items-center h-full">
      <RecipesAndProductsProductsTable
        table-height="650"
        :table-data="products"
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
      </RecipesAndProductsProductsTable>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { showConfirmationDialog, showNotification } from '@/helpers'

const products = ref<IProduct[]>([])
const tableLoading = ref(false)

async function getProducts () {
  tableLoading.value = true

  try {
    const data = await approveService.getPendingApprovalProducts()

    products.value = data
  } catch (error) {
    showNotification()
  } finally {
    tableLoading.value = false
  }
}

async function approveProduct (productId: string) {
  tableLoading.value = true
  try {
    await approveService.productReview({ id: productId, approve: true })

    products.value = products.value.filter(product => product.id !== productId)

    showNotification('Product was approved successfully', 'Success', 'success')
  } catch (error) {
    showNotification()
  } finally {
    tableLoading.value = false
  }
}

async function rejectProduct (productId: string, productName: string) {
  try {
    await showConfirmationDialog({
      title: 'Product rejecting',
      message: `Are you sure you want to reject "${productName}"?`
    })

    tableLoading.value = true

    await approveService.productReview({ id: productId, approve: false })

    products.value = products.value.filter(product => product.id !== productId)
    showNotification('Product was rejected successfully', 'Success', 'success')
  } catch (error) {
    if (error !== 'cancel') {
      showNotification()
    }
  } finally {
    tableLoading.value = false
  }
}

onMounted(() => {
  getProducts()
})
</script>
