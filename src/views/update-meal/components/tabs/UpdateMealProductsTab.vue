<template>
  <div class="rounded-lg h-full flex flex-col gap-8">
    <el-select
      v-model="searchQuery"
      filterable
      :filter-method="filterProducts"
      :size="$elComponentSize.large"
      placeholder="Enter a product name, e.g. 'bread', 'avocado', 'yogurt'"
      clearable
    >
      <el-option
        v-for="product in filteredProducts"
        :key="product.id"
        :label="product.name"
        :value="product.name"
        @click="addProductToMeal(product)"
      >
        <div class="flex justify-between w-full">
          <span class="font-semibold">{{ product.name }}</span>
          <p><b>{{ product.nutritionDetails.calories }}</b> kcal</p>
        </div>
      </el-option>
      <template #empty>No products match</template>
    </el-select>

    <div class="flex flex-col gap-5 h-full overflow-y-auto">
      <UpdateMealProductCard
        v-for="product in productsInMeal"
        :key="product.id"
        v-model:remove-button-loading="isButtonRemoveLoading[product.id]"
        :product="product"
        @update-product="handleProductUpdate"
        @remove-product="handleProductRemove"
      />

      <el-empty
        v-if="!productsInMeal.length"
        class="text-2xl text-gray-light font-bold mt-10"
        :image-size="200"
        description="No products added at the moment."
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { showNotification } from '@/helpers'

const props = defineProps<{
  mealType: TMealType
  allProducts: IProduct[]
}>()

const userMeals = defineModel<IMeals>('user-meals')

const productsInMeal = defineModel<IProduct[]>('productsInMeal')

const dashboardStore = useDashboardStore()

const isButtonRemoveLoading = ref<Record<string, boolean>>({})

const searchQuery = ref('')
const filteredProducts = ref<IProduct[]>([])

function filterProducts (searchQuery: string) {
  if (!searchQuery) {
    filteredProducts.value = props.allProducts
  } else {
    filteredProducts.value = props.allProducts.filter(recipe =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }
}

async function addProductToMeal (product: IProduct) {
  const isProductAlreadyInMeal = productsInMeal.value.some(prod => prod.id === product.id)

  if (isProductAlreadyInMeal) {
    showNotification('You may just change your grams', 'This product is already added to your meal.', 'warning')
  } else {
    const defaultGrams = 100
    const newProduct: IProduct = { ...product, grams: defaultGrams }

    productsInMeal.value.push(newProduct)
    userMeals.value.products.push(newProduct)
    try {
      await updateMealService.updateMeal({
        date: dashboardStore.date,
        mealType: props.mealType,
        newItem: newProduct,
        mealComponent: 'products'
      })
    } catch (error) {
      showNotification()
    }
  }
}

async function handleProductUpdate (updatedProduct: IProduct) {
  const index = productsInMeal.value.findIndex(product => product.id === updatedProduct.id)

  if (index !== -1) {
    productsInMeal.value[index] = { ...updatedProduct }
    userMeals.value.products = [...productsInMeal.value]

    try {
      await updateMealService.updateMeal({
        date: dashboardStore.date,
        mealType: props.mealType,
        newItem: updatedProduct,
        mealComponent: 'products',
        currentMealData: userMeals.value
      })
    } catch (error) {
      showNotification()
    }
  } else {
    showNotification()
  }
}

async function handleProductRemove (productId: string) {
  isButtonRemoveLoading.value[productId] = true

  try {
    await updateMealService.removeProduct({
      date: dashboardStore.date,
      mealType: props.mealType,
      productId,
      mealComponent: 'products'
    })
    productsInMeal.value = productsInMeal.value.filter(product => product.id !== productId)
  } catch (error) {
    showNotification()
  } finally {
    isButtonRemoveLoading.value[productId] = false
  }
}
</script>
