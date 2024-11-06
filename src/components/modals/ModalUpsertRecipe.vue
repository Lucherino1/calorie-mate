<template>
  <el-dialog
    v-model="isModalVisible"
    :loading="modalLoading"
    :modal="true"
    plain
    center
    :z-index="2000"
    :lock-scroll="true"
    close-on-press-escape
    :title="props.title"
    width="1200px"
    class="rounded-xl"
  >
    <el-form :model="recipe">
      <div class="flex justify-between items-start pt-5">
        <div class="flex flex-col gap-4 flex-1 px-2">
          <div class="flex flex-col justify-center">
            <div class="flex gap-10 justify-start">
              <el-upload
                drag
                :show-file-list="false"
                list-type="picture-card"
                class="w-[150px] h-[150px]"
                :limit="1"
                :auto-upload="false"
                :on-remove="HandleImageRemove"
                :on-change="handleImageChange"
              >
                <img
                  v-if="uploadedImageUrl"
                  class="w-[140px] h-[140px] overflow-hidden object-cover"
                  :src="uploadedImageUrl"
                >
              </el-upload>
              <div class="flex flex-col justify-start">
                <el-form-item>
                  <div class="flex gap-2 min-w-[300px]">
                    <p class="font-semibold">Name:</p>
                    <el-input v-model="recipe.name" class="w-full" />
                  </div>
                </el-form-item>

                <el-form-item>
                  <div class="flex gap-2 items-center w-full">
                    <p class="font-semibold">Type:</p>
                    <el-select v-model="recipe.type" class="w-full">
                      <el-option
                        v-for="type in recipeTypes"
                        :key="type"
                        :label="type"
                        :value="type"
                      />
                    </el-select>
                  </div>
                </el-form-item>

                <el-form-item>
                  <div class="flex">
                    <el-switch
                      v-model="recipe.isVegan"
                      size="large"
                      active-text="Vegan"
                      inactive-text="Not vegan"
                    />
                  </div>
                </el-form-item>
              </div>
            </div>

            <div class="min-w-[400px]">
              <el-form-item>
                <div class="flex flex-col mx-0 justify-center items-center gap-2">
                  <p class="font-semibold">Description:</p>
                  <el-input
                    v-model="recipe.description"
                    class="min-w-[400px]"
                    type="textarea"
                    :resize="'none'"
                    :rows="4"
                    :minlength="10"
                    :maxlength="500"
                  />
                </div>
              </el-form-item>
            </div>
          </div>
          <div class="flex gap-5">
            <div class="flex flex-col" />

            <div class="flex">
              <el-card class="text-primary-dark">
                <h3 class="font-semibold mb-2 text-sm">Total Nutritional Details:</h3>
                <ul class="flex flex-wrap text-center gap-8 text-base">
                  <li class="">
                    <p class="truncate">Calories:</p>
                    <span class="truncate"><b>{{ calcedNutrition.calories }}</b> kcal
                    </span>
                  </li>

                  <li class="">
                    <p class="truncate">Carbs:</p>
                    <span class="truncate">
                      <b>{{ calcedNutrition.carbs }}</b> g
                    </span>
                  </li>

                  <li class="">
                    <p class="truncate">Proteins:</p>
                    <span class="truncate"><b>{{ calcedNutrition.proteins }}</b> g
                    </span>
                  </li>

                  <li class="">
                    <p class="truncate">Fats:</p>
                    <span class="truncate"><b>{{ calcedNutrition.fats }}</b> g
                    </span>
                  </li>
                </ul>
              </el-card>
            </div>
          </div>
        </div>

        <div class="flex flex-col justify-center items-center gap-4 flex-1">
          <div>
            <h3 class="font-semibold mb-1">Ingredients:</h3>
            <el-select
              v-model="searchQuery"
              class=" mb-6"
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
                @click="addProductToIngredients(product)"
              >
                <div class="flex justify-between w-full">
                  <span class="font-semibold">{{ product.name }}</span>
                  <p><b>{{ product.nutritionDetails.calories }}</b> kcal</p>
                </div>
              </el-option>
              <template #empty>No products match</template>
            </el-select>
            <div class="h-[300px] p-2 overflow-y-auto border-dashed border">
              <div v-for="(ingredient, index) in recipe.ingredients" :key="index" class="flex gap-4 mb-2">
                <ProductCardInRecipes
                  :product="ingredient"
                  @update-product="handleProductUpdate"
                  @remove-product="handleProductRemove"
                />
              </div>
              <el-empty
                v-if="!recipe.ingredients.length"
                class="text-xl text-gray-light font-bold"
                :image-size="140"
                description="No products added at the moment."
              />
            </div>
            <div class="flex justify-center items-center my-5">
              <el-form-item>
                <div class="flex gap-20">
                  <div class="flex justify-center items-center gap-4">
                    <p class="font-semibold">Number of portions:</p>
                    <el-input-number v-model="portions" type="number" :min="1" />
                  </div>
                  <div class="flex gap-2">
                    <p class="font-semibold">Portion Weight:</p>
                    <div>
                      {{ portionWeight }}
                    </div>
                  </div>
                </div>
              </el-form-item>
            </div>
          </div>
        </div>
      </div>
    </el-form>

    <template #footer>
      <div class="flex justify-end gap-4">
        <el-button @click="handleCancel">Cancel</el-button>
        <el-button :type="$elComponentType.primary" @click="handleSave">
          Save
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { UploadFile, UploadProps } from 'element-plus'

import { ERecipeType } from '@/types/products-and-recipes.enums'
import { showNotification } from '@/helpers'

const props = defineProps<{
  title: string
}>()

const modalLoading = ref(false)

const recipe = defineModel<IRecipe>('recipe')
const isModalVisible = defineModel<boolean>('visible')

const allProducts = ref<IProduct[]>([])

const portions = ref(1)
const recipeTypes = ref<TRecipesType[]>(Object.values(ERecipeType))

const file = ref<UploadFile>(null)
const uploadedImageUrl = ref<string | null | undefined>(null)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', recipe: IRecipe): void
}>()

const searchQuery = ref<string>('')
const filteredProducts = ref<IProduct[]>([])

const handleImageChange: UploadProps['onChange'] = (uploadFile) => {
  file.value = uploadFile
  uploadedImageUrl.value = uploadFile.url
}

const HandleImageRemove: UploadProps['onRemove'] = () => {
  file.value = null
  uploadedImageUrl.value = recipe.value.image
}

const uploadImage = async () => {
  try {
    if (file.value) {
      const data = await filesService.uploadRecipeImage(file.value)

      if (!data) {
        return
      }

      uploadedImageUrl.value = data.productUrl
    }
  } catch (error) {
    showNotification()
  }
}

function filterProducts (searchQuery: string) {
  if (!searchQuery) {
    filteredProducts.value = allProducts.value
  } else {
    filteredProducts.value = allProducts.value.filter(recipe =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }
}

async function handleSave () {
  try {
    modalLoading.value = true
    await uploadImage()

    recipe.value.image = uploadedImageUrl.value

    const { portions, ...rest } = recipe.value
    const updatedRecipe = { ...rest }

    emit('save', updatedRecipe)
    modalLoading.value = false
  } catch (error) {
    showNotification()
  }
}

function handleCancel () {
  file.value = null
  uploadedImageUrl.value = null
  emit('close')
}

function addProductToIngredients (product: IProduct) {
  const isProductAlreadyInIngredients = recipe.value?.ingredients.some(ing => ing.id === product.id)
  if (isProductAlreadyInIngredients) {
    showNotification('This product is already in the ingredients list.', 'Duplicate product.', 'warning')
  } else {
    const defaultGrams = 100
    const newProduct: IProduct = { ...product, grams: defaultGrams }

    recipe.value?.ingredients.push(newProduct)
  }
}

function handleProductUpdate (updatedProduct: IProduct) {
  const index = recipe.value?.ingredients.findIndex(ing => ing.id === updatedProduct.id)
  if (index !== undefined && index !== -1) {
    recipe.value.ingredients[index] = { ...updatedProduct }
  }
}

function handleProductRemove (productId: string) {
  console.log(productId)
  const index = recipe.value?.ingredients.findIndex(ing => ing.id === productId)
  if (index !== undefined && index !== -1) {
    recipe.value!.ingredients.splice(index, 1)
  }
}

const calcedNutrition = computed(() => {
  const totalNutrition = recipe.value.ingredients.reduce((total, ingredient) => {
    const ingredientNutrition = nutritionService.calcNutritionPerGrams(
      ingredient.nutritionDetails,
      ingredient.grams || 100
    )
    Object.entries(ingredientNutrition).forEach(([key, value]) => {
      total[key] += value
    })
    return total
  }, { calories: 0, carbs: 0, proteins: 0, fats: 0 })

  return Object.fromEntries(
    Object.entries(totalNutrition).map(([key, value]) => [key, Math.round(value / portions.value)])
  )
})

const portionWeight = computed(() => {
  if (!recipe.value?.ingredients.length) return 0

  return recipe.value.ingredients.reduce((sum, ingredient) => {
    return sum + (ingredient.grams || 0)
  }, 0)
})

const getAllProducts = async () => {
  try {
    modalLoading.value = true

    const [userProducts, products] = await Promise.all([
      productsAndRecipesService.getUserProduct(),
      productsAndRecipesService.getGlobalProducts()
    ])

    allProducts.value = [...userProducts, ...products]
    modalLoading.value = false
  } catch (error) {
    showNotification()
  }
}

watch(isModalVisible, (newVal) => {
  if (newVal) {
    getAllProducts()
  }
})
</script>
