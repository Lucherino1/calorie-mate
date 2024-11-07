<template>
  <el-dialog
    v-model="isModalVisible"
    :modal="true"
    plain
    :close-icon="IconClose"
    center
    :z-index="2000"
    :lock-scroll="true"
    close-on-press-escape
    :title="props.title"
    width="1200px"
    class="rounded-xl pb-0"
  >
    <el-form
      ref="formRef"
      :model="recipe"
      :rules="formRules"
      @submit.prevent="handleSave"
    >
      <div class="flex justify-between items-start pt-5">
        <div class="flex flex-col gap-4 flex-1 px-2">
          <div class="flex flex-col justify-center">
            <div class="flex gap-10 justify-start">
              <div class="relative w-[150px] h-[150px] hover:opacity-60">
                <el-upload
                  v-model:file-list="fileList"
                  drag
                  action="#"
                  :show-file-list="false"
                  list-type="picture"
                  class="w-[150px] h-[150px]"
                  :limit="1"
                  :auto-upload="false"
                  :on-remove="handleImageRemove"
                  :on-change="handleImageChange"
                >
                  <template #default>
                    <div v-if="uploadedImageUrl" class="w-[150px] h-[150px]">
                      <img
                        class="object-cover w-full h-full"
                        :src="uploadedImageUrl"
                      >
                    </div>
                    <div
                      v-else
                      class="hover:text-primary flex flex-col items-center justify-center
                    text-gray-light text-center w-[150px] h-[150px]"
                    >
                      <span><IconAdjustMeal /></span>
                      <p>Click or drop your <br>image here</p>
                    </div>
                  </template>
                </el-upload>
                <div
                  v-if="uploadedImageUrl"
                  class="absolute inset-0 bg-black bg-opacity-50 flex items-center
                  justify-center opacity-0 hover:opacity-100 transition-opacity"
                >
                  <el-icon class="text-white cursor-pointer opacity-100" @click.stop="handleImageRemove">
                    <Delete />
                  </el-icon>
                </div>
              </div>

              <div class="flex flex-col justify-start">
                <el-form-item required :show-message="false" prop="name">
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
                        :label="normalizeStringLabel(type)"
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

            <div class="flex">
              <el-form-item :show-message="false" prop="description">
                <div class="flex flex-col mx-0 justify-center gap-2">
                  <p class="font-semibold">Description:</p>
                  <el-input
                    v-model="recipe.description"
                    required
                    class="min-w-[500px] rounded-3xl"
                    type="textarea"
                    :resize="'none'"
                    :rows="4"
                    :maxlength="500"
                  />
                </div>
              </el-form-item>
            </div>
          </div>

          <div class="flex justify-start">
            <el-card class="text-primary-dark">
              <h3 class="font-semibold text-sm mb-2">Nutritional Details:</h3>
              <ul class="flex flex-wrap text-center gap-8 text-base">
                <li class="">
                  <p class="truncate">Calories:</p>
                  <span class="truncate"><b>{{ calcedNutrition.calories }}</b> kcal</span>
                </li>
                <li class="">
                  <p class="truncate">Carbs:</p>
                  <span class="truncate"><b>{{ calcedNutrition.carbs }}</b> g</span>
                </li>
                <li class="">
                  <p class="truncate">Proteins:</p>
                  <span class="truncate"><b>{{ calcedNutrition.proteins }}</b> g</span>
                </li>
                <li class="">
                  <p class="truncate">Fats:</p>
                  <span class="truncate"><b>{{ calcedNutrition.fats }}</b> g</span>
                </li>
              </ul>
            </el-card>
          </div>
        </div>

        <div class="flex flex-col justify-center items-center gap-4 flex-1">
          <div class="min-w-[600px]">
            <h3 class="font-semibold mb-1">Ingredients:</h3>
            <el-select
              v-model="searchQuery"
              class=" mb-6 max-w-[600px]"
              filterable
              :filter-method="filterProducts"
              :size="$elComponentSize.large"
              placeholder="Enter a product name, e.g. 'bread', 'avocado', 'yogurt'"
              clearable
            >
              <el-option
                v-for="product in filteredProducts"
                :key="product.id"
                class="max-w-[600px]"
                :label="product.name"
                :value="product.name"
                @click="addProductToIngredients(product)"
              >
                <div class="flex justify-between">
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
            <p class="font-semibold mt-4">Portion Weight:  {{ portionWeight }}</p>
            <div class="flex justify-end items-center my-5 w-full">
              <el-form-item>
                <div class="flex justify-end items-center gap-4 mt-5">
                  <el-checkbox
                    v-if="isCreating"
                    v-model="submitForReview"
                    :size="$elComponentSize.large"
                  >
                    <template #default>
                      <div class="flex justify-center gap-1 items-center text-center">
                        <p>Submit for review</p>

                        <el-tooltip
                          content="Submit for admin review to add this recipe to the public database."
                          placement="top"
                        >
                          <IconInfo class="w-[18px] h-[18px] my-0 fill-primary" />
                        </el-tooltip>
                      </div>
                    </template>
                  </el-checkbox>
                  <el-button @click="handleCancel">Cancel</el-button>
                  <div>
                    <el-button
                      :loading="buttonLoading"
                      :type="$elComponentType.primary"
                      native-type="submit"
                    >
                      Save
                    </el-button>
                  </div>
                </div>
              </el-form-item>
            </div>
          </div>
        </div>
      </div>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { UploadUserFile, UploadProps, UploadFile } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import IconAdjustMeal from '~icons/icon/adjust-meal'
import IconInfo from '~icons/icon/info'
import IconClose from '~icons/icon/close'
import { normalizeStringLabel, showNotification } from '@/helpers'
import { ERecipeType } from '@/types/products-and-recipes.enums'

const props = defineProps<{
  title: string
  isCreating: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', recipe: IRecipe): void
}>()

const authStore = useAuthStore()

const formRef = useTemplateRef<TElementPlus['FormInstance']>('formRef')
const formRules = useElFormRules(
  {
    name: [useRequiredRule()],
    type: [useRequiredRule()],
    ingredients: [useRequiredRule()]
  }
)

const submitForReview = ref(false)

const recipe = defineModel<IRecipe>('recipe')
const isModalVisible = defineModel<boolean>('visible')

const buttonLoading = ref(false)

const allProducts = ref<IProduct[]>([])

const recipeTypes = ref<TRecipesType[]>(Object.values(ERecipeType))

const fileList = ref<UploadUserFile[]>([])
const uploadedImageUrl = ref<string>(null)

const searchQuery = ref<string>(null)
const filteredProducts = ref<IProduct[]>([])

const handleImageChange: UploadProps['onChange'] = (uploadFile) => {
  uploadedImageUrl.value = uploadFile.url
}

const handleImageRemove: UploadProps['onRemove'] = () => {
  fileList.value = []
  uploadedImageUrl.value = null
  recipe.value.image = null
}

const uploadImage = async () => {
  try {
    if (fileList.value.length > 0) {
      const file = fileList.value[0] as UploadFile

      const data = await filesService.uploadRecipeImage(file)
      console.log(data.productUrl)
      if (data) {
        console.log(data)
        uploadedImageUrl.value = data.productUrl
      }
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
  formRef.value?.validate(async (isValid) => {
    if (isValid) {
      try {
        buttonLoading.value = true

        if (fileList.value.length > 0 && uploadedImageUrl.value) {
          await uploadImage()
          recipe.value.image = uploadedImageUrl.value
        }

        if (!authStore.isUserAdmin) {
          recipe.value.isUnderReview = submitForReview.value
        }

        recipe.value.portionWeight = portionWeight.value

        emit('save', recipe.value)
        fileList.value = []
        buttonLoading.value = false
        uploadedImageUrl.value = null
      } catch (error) {
        showNotification()
      }
    } else {
      showNotification('Please fill in all required fields.', 'warning')
    }
  })
}

function handleCancel () {
  fileList.value = []
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
  recipe.value.ingredients[index] = { ...updatedProduct }
}

function handleProductRemove (productId: string) {
  const index = recipe.value?.ingredients.findIndex(ing => ing.id === productId)
  recipe.value.ingredients.splice(index, 1)
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
    Object.entries(totalNutrition).map(([key, value]) => [key, Math.round(value)])
  )
})

const portionWeight = computed(() => {
  if (!recipe.value?.ingredients.length) return 0

  const totalWeight = recipe.value.ingredients.reduce((sum, ingredient) => {
    return sum + (ingredient.grams || 0)
  }, 0)

  return Math.round(totalWeight)
})

const getAllProducts = async () => {
  try {
    buttonLoading.value = true

    const [userProducts, products] = await Promise.all([
      productsAndRecipesService.getUserProduct(),
      productsAndRecipesService.getGlobalProducts()
    ])

    allProducts.value = [...userProducts, ...products]
    buttonLoading.value = false
  } catch (error) {
    showNotification()
  }
}

watch(isModalVisible, (newVal) => {
  if (newVal) {
    fileList.value = []
    uploadedImageUrl.value = null
    getAllProducts()
  } else {
    fileList.value = []
    uploadedImageUrl.value = null
  }
})
</script>
