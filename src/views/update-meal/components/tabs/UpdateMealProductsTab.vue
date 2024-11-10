<template>
  <div class="rounded-lg">
    <div>
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
    </div>

    <div class="mt-8 flex flex-col gap-5 max-h-[500px] overflow-y-auto">
      <UpdateMealProductCard
        v-for="product in productsInMeal"
        :key="product.id"
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
  // userMeals: IMeals
}>()

const userMeals = defineModel<IMeals>('user-meals')

const productsInMeal = defineModel<IProduct[]>('productsInMeal')

const dashboardStore = useDashboardStore()

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
  const updatedProductsInMeal = [...productsInMeal.value]
  const index = updatedProductsInMeal.findIndex(product => product.id === updatedProduct.id)

  if (index !== -1) {
    updatedProductsInMeal[index] = { ...updatedProduct }
    productsInMeal.value = updatedProductsInMeal

    userMeals.value.products = updatedProductsInMeal

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
    showNotification('Product not found in meal', 'Error', 'error')
  }
}

async function handleProductRemove (productId: string) {
  const index = productsInMeal.value.findIndex(product => product.id === productId)

  if (index !== -1) {
    productsInMeal.value.splice(index, 1)

    try {
      await updateMealService.removeProduct({
        date: dashboardStore.date,
        mealType: props.mealType,
        productId,
        mealComponent: 'products'
      })
    } catch (error) {
      showNotification()
    }
  }
}

</script>
