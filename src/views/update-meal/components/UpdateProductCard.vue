<template>
  <el-card class="px-2">
    <div class="flex items-center justify-between min-h-[80px]">
      <div class="flex min-w-[320px] items-center justify-between">
        <div class="flex justify-center items-center">
          <div>
            <p class="text-wrap truncate font-bold text-base text-primary-dark">{{ product.name }}</p>
            <span class="text-sm text-gray-light">- {{ product.type }}</span>
          </div>
          <span v-if="product.isVegan" class="fill-success w-[30px] h-[30px] ml-1">
            <IconVegan class="w-full h-full" />
          </span>
        </div>
        <el-input-number
          v-model="grams"
          :min="1"
          :size="$elComponentSize.default"
          @input="isEditMode = true"
        >
          <template #suffix>g</template>
        </el-input-number>
      </div>
      <ul class="flex flex-wrap gap-5 text-gray-dark text-base">
        <li class="nutrition-list__item">
          <p class="truncate">Carbs</p>
          <span class="truncate"><b>{{ calculatedNutrition.carbs }}</b> g</span>
        </li>
        <li class="nutrition-list__item">
          <p class="truncate">Proteins</p>
          <span class="truncate"><b>{{ calculatedNutrition.proteins }}</b> g</span>
        </li>
        <li class="nutrition-list__item">
          <p class="truncate">Fats</p>
          <span class="truncate"><b>{{ calculatedNutrition.fats }}</b> g</span>
        </li>
        <li class="nutrition-list__item">
          <p class="truncate">Calories</p>
          <span class="truncate"><b>{{ calculatedNutrition.calories }}</b> kcal</span>
        </li>
      </ul>

      <div class="my-0 flex justify-end w-[180px]">
        <el-button
          v-if="isEditMode"
          :type="$elComponentType.success"
          @click="saveChanges"
        >
          Save
        </el-button>
        <el-button
          :type="$elComponentType.danger"
          @click="removeProduct"
        >
          Remove
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import IconVegan from '~icons/icon/vegan'

const props = defineProps<{
  product: IUpdateProduct
  allProducts: IProduct[]
}>()

const emit = defineEmits<{
  (e: 'update-product', updatedProduct: IUpdateProduct)
  (e: 'remove-product', productId: string)
}>()

const isEditMode = ref(false)

const localProduct = ref({ ...props.product })
const grams = ref(localProduct.value.grams)
const calculatedNutrition = ref({ ...localProduct.value.nutritionDetails })

function saveChanges () {
  isEditMode.value = false
  localProduct.value.grams = grams.value
  localProduct.value.nutritionDetails = { ...calculatedNutrition.value }

  emit('update-product', { ...localProduct.value })
}

function removeProduct () {
  emit('remove-product', localProduct.value.id)
}

watch(grams, () => {
  calculatedNutrition.value = nutritionService.calcNutritionPerGrams(props.product.nutritionDetails, grams.value)
  isEditMode.value = grams.value !== props.product.grams
})
</script>
