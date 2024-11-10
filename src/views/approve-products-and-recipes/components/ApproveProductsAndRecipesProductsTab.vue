<template>
  <el-card
    class="pt-5 h-full w-full card--no-shadow overflow-x-scroll"
  >
    <div class="flex flex-col items-center min-w-[1230px]">
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
              @click="rejectProduct(row.id)"
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
import { showNotification } from '@/helpers'

const products = ref<IProduct[]>([])
const tableLoading = ref(false)

async function getProducts () {
  tableLoading.value = false

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

async function rejectProduct (productId: string) {
  tableLoading.value = true
  try {
    await approveService.productReview({ id: productId, approve: false })

    products.value = products.value.filter(product => product.id !== productId)
    showNotification('Product was rejected successfully', 'Success', 'success')
  } catch (error) {
    showNotification()
  } finally {
    tableLoading.value = false
  }
}

onMounted(() => {
  getProducts()
})
</script>
