<template>
  <ProductsAndRecipesTabsWrapper
    v-model:active-tab="activeTab"
    :page-title="'Recipes and Products'"
    :loading="pageLoading"
  >
    <template #products>
      <div class="product-table-container">
        <el-table
          :data="paginatedProducts"
          style="width: 100%"
          stripe
          border
        >
          <el-table-column
            prop="name"
            label="Product Name"
            width="180"
          />
          <el-table-column
            prop="calories"
            label="Calories (kcal)"
            width="150"
          />
          <el-table-column
            prop="carbs"
            label="Carbs (g)"
            width="120"
          />
          <el-table-column
            prop="proteins"
            label="Proteins (g)"
            width="120"
          />
          <el-table-column
            prop="fats"
            label="Fats (g)"
            width="120"
          />
        </el-table>

        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="totalProducts"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </template>

    <template #recipes>
      <div class="recipe-table-container">
        <el-table
          :data="paginatedRecipes"
          style="width: 100%"
          stripe
          border
        >
          <el-table-column
            prop="name"
            label="Recipe Name"
            width="180"
          />
          <el-table-column
            prop="calories"
            label="Calories (kcal)"
            width="150"
          />
          <el-table-column
            prop="carbs"
            label="Carbs (g)"
            width="120"
          />
          <el-table-column
            prop="proteins"
            label="Proteins (g)"
            width="120"
          />
          <el-table-column
            prop="fats"
            label="Fats (g)"
            width="120"
          />
        </el-table>

        <el-pagination
          v-model:current-page="currentRecipePage"
          :page-size="pageSize"
          :total="totalRecipes"
          layout="prev, pager, next"
          @current-change="handleRecipePageChange"
        />
      </div>
    </template>
  </ProductsAndRecipesTabsWrapper>
</template>

<script lang="ts" setup>
import { showNotification } from '@/helpers'

const pageLoading = ref(false)
const activeTab = ref('products')

const currentPage = ref(1)
const currentRecipePage = ref(1)
const pageSize = ref(10)

const totalProducts = ref(0)
const totalRecipes = ref(0)

const productPagesCache = ref<{ [key: number]: IProduct[] }>({})
const recipePagesCache = ref<{ [key: number]: IRecipe[] }>({})

const products = ref<IProduct[]>([])
const recipes = ref<IRecipe[]>([])

const paginatedProducts = computed(() => products.value)
const paginatedRecipes = computed(() => recipes.value)

const getPaginatedProducts = async (page: number) => {
  if (productPagesCache.value[page]) {
    products.value = productPagesCache.value[page]
    return
  }

  try {
    pageLoading.value = true
    const offset = (page - 1) * pageSize.value
    const { data, count } = await productsAndRecipesService.getPaginatedProducts(pageSize.value, offset)
    products.value = data
    totalProducts.value = count

    productPagesCache.value[page] = data
    console.log(data)
    console.log(productPagesCache.value[page])
    console.log(productPagesCache.value)
    pageLoading.value = false
  } catch (error) {
    showNotification()
  }
}

const getPaginatedRecipes = async (page: number) => {
  if (recipePagesCache.value[page]) {
    recipes.value = recipePagesCache.value[page]
    return
  }

  try {
    pageLoading.value = true
    const offset = (page - 1) * pageSize.value
    const { data, count } = await productsAndRecipesService.getPaginatedRecipes(pageSize.value, offset)
    recipes.value = data
    totalRecipes.value = count

    recipePagesCache.value[page] = data

    pageLoading.value = false
  } catch (error) {
    showNotification()
  }
}

function handlePageChange (page: number) {
  getPaginatedProducts(page)
}

function handleRecipePageChange (page: number) {
  getPaginatedRecipes(page)
}

onMounted(() => {
  getPaginatedProducts(currentPage.value)
  getPaginatedRecipes(currentRecipePage.value)
})
</script>

<style scoped>
.product-table-container,
.recipe-table-container {
  margin-bottom: 20px;
}
</style>
