<template>
  <div v-loading.fullscreen="pageLoading" class="app-container--dashboard h-full">
    <div class="flex h-full">
      <div class="flex-col flex gap-5 w-full">
        <h1 class="font-bold text-primary-dark text-[34px] leading-10">
          Update your {{ mealType }}
        </h1>
        <div class="mx-0">
          <el-tabs
            v-model="activeTab"
            stretch
            class="min-h-[500px] flex"
          >
            <el-tab-pane
              label="Products"
              name="products"
              class="px-10 pb-10 overflow-y-scroll"
            >
              <div class="max-h-[600px] rounded-lg">
                <div class="mt-5">
                  <el-select
                    v-model="value"
                    filterable
                    :size="$elComponentSize.large"
                    placeholder=""
                    clearable
                  >
                    <el-option
                      v-for="product in allProducts"
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

                <div class="" />

                <div class="mt-8 flex flex-col gap-5">
                  <UpdateProductCard
                    v-for="product in productsInMeal"
                    :key="product.id"
                    :product="product"
                    :all-products="allProducts"
                    @update-product="handleProductUpdate"
                    @remove-product="handleProductRemove"
                  />
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Recipes" name="recipes">
              <UpdateRecipeCard />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { showNotification } from '@/helpers'

const props = defineProps<{
  mealType?: TMealType
}>()

const route = useRoute()
const authStore = useAuthStore()

const date = route.query.date.toString()

const pageLoading = ref(false)

const allProducts = ref<IProduct[]>()
const productsInMeal = ref<IUpdateProduct[]>([])

const getAllProducts = async () => {
  try {
    pageLoading.value = true

    const products = await productsAndRecipesService.getGlobalProducts()
    allProducts.value = products

    const userMeal = await updateMealService.getUserMeals(authStore.user.id, date, props.mealType)

    productsInMeal.value = userMeal.products.map(userProduct => ({ ...userProduct }))

    pageLoading.value = false

    return products
  } catch (error) {
    console.error(error)
    showNotification()
  }
}

const allRecipes = ref<IRecipe[]>([])

const getAllRecipes = async () => {
  try {
    pageLoading.value = true

    const recipes = await productsAndRecipesService.getGlobalRecipes()
    allRecipes.value = recipes

    pageLoading.value = false

    return recipes
  } catch (error) {
    showNotification()
  }
}

const value = ref('')

const activeTab = ref('products')

async function addProductToMeal (product: IProduct) {
  const isProductAlreadyInMeal = productsInMeal.value.some(p => p.id === product.id)

  if (isProductAlreadyInMeal) {
    showNotification('You may just change your grams', 'This product is already added to your meal.', 'warning')
  } else {
    const defaultGrams = 100
    const newProduct: IUpdateProduct = { ...product, grams: defaultGrams }
    productsInMeal.value.push(newProduct)
    try {
      await updateMealService.updateMeal(authStore.user.id, date, props.mealType, { ...newProduct }, 'products')
    } catch (error) {
      showNotification()
    }
  }
}

async function handleProductUpdate (updatedProduct: IUpdateProduct) {
  const index = productsInMeal.value.findIndex(product => product.id === updatedProduct.id)
  if (index !== -1) productsInMeal.value[index] = updatedProduct

  try {
    await updateMealService.updateMeal(authStore.user.id, date, props.mealType, updatedProduct, 'products')
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
        date,
        props.mealType,
        productId,
        'products'
      )
    } catch (error) {
      showNotification(error)
    }
  }
}

console.log(productsInMeal)

watch(activeTab, (newTab) => {
  if (newTab === 'recipes' && !allRecipes.value.length) {
    getAllRecipes()
  }
})

onBeforeMount(() => {
  getAllProducts()
})
</script>

<style lang="scss" scoped>
.nutrition-list__item {
  @apply max-w-[80px] flex flex-col gap-5;
}
</style>
