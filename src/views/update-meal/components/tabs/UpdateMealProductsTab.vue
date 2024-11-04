<template>
  <div class="max-h-[600px] rounded-lg">
    <div class="mt-5">
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

    <div class="mt-8 flex flex-col gap-5">
      <UpdateMealProductCard
        v-for="product in productsInMeal"
        :key="product.id"
        :product="product"
        @update-product="handleProductUpdate"
        @remove-product="handleProductRemove"
      />
    </div>

    <div v-if="productsInMeal.length > productsPerPage" class="mt-5 w-full flex items-center justify-center">
      <el-button
        class="min-w-[600px]"
        type="primary"
        :size="$elComponentSize.large"
        @click="loadMoreProducts"
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
  allProducts: IProduct[]
  userMeals: IMeals
}>()

const productsInMeal = defineModel<IProduct[]>('productsInMeal')

const dashboardStore = useDashboardStore()

const authStore = useAuthStore()

const productsPerPage = ref(10)

function loadMoreProducts () {
  productsPerPage.value += 10
}

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

    productsInMeal.value.unshift(newProduct)
    try {
      await updateMealService.updateMeal(
        authStore.user.id,
        dashboardStore.date,
        props.mealType,
        { ...newProduct },
        'products',
        props.userMeals
      )
    } catch (error) {
      showNotification()
    }
  }
}

async function handleProductUpdate (updatedProduct: IProduct) {
  const index = productsInMeal.value.findIndex(product => product.id === updatedProduct.id)
  if (index !== -1) productsInMeal.value[index] = updatedProduct

  try {
    await updateMealService.updateMeal(
      authStore.user.id,
      dashboardStore.date,
      props.mealType,
      updatedProduct,
      'products',
      props.userMeals
    )
  } catch (error) {
    showNotification()
  }
}

async function handleProductRemove (productId: string) {
  const index = productsInMeal.value.findIndex(product => product.id === productId)
  if (index !== -1) {
    productsInMeal.value.splice(index, 1)

    try {
      await updateMealService.removeProduct(
        authStore.user.id,
        dashboardStore.date,
        props.mealType,
        productId,
        'products'
      )
    } catch (error) {
      showNotification()
    }
  }
}
</script>
