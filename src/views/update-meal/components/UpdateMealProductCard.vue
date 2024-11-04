<template>
  <div class="w-full h-full">
    <el-card class="px-2 lg:px-0">
      <div class="flex items-center justify-between min-h-[80px]">
        <div class="flex min-w-[320px] items-center justify-between">
          <div class="flex justify-center items-center">
            <div>
              <div class="flex justify-center items-center">
                <p class="text-wrap truncate font-bold text-base text-primary-dark">{{ product.name }}</p>
                <span v-if="product.isVegan" class="flex items-center fill-success w-[20px] h-[20px] ml-2">
                  <IconVegan class="w-full h-full" />
                </span>
              </div>
              <span class="text-sm text-gray-light capitalize">{{ product.type }}</span>
            </div>
          </div>
          <el-input-number
            ref="productInput"
            v-model="grams"
            :min="1"
            :size="$elComponentSize.default"
            @input="handleInputChange"
          >
            <template #suffix>g</template>
          </el-input-number>
        </div>

        <ul class="flex text-center gap-5 text-gray-dark text-base">
          <li class="nutrition-list__item">
            <p class="truncate">Carbs:</p>
            <span class="truncate text-primary-dark"><b>{{ calculatedNutrition.carbs }}</b> g</span>
          </li>

          <li class="nutrition-list__item">
            <p class="truncate">Proteins:</p>
            <span class="truncate text-primary-dark"><b>{{ calculatedNutrition.proteins }}</b> g</span>
          </li>

          <li class="nutrition-list__item">
            <p class="truncate">Fats:</p>
            <span class="truncate text-primary-dark"><b>{{ calculatedNutrition.fats }}</b> g</span>
          </li>

          <li class="nutrition-list__item">
            <p class="truncate">Calories:</p>
            <span class="truncate text-primary-dark"><b>{{ calculatedNutrition.calories }}</b> kcal</span>
          </li>
        </ul>

        <div class="my-0 flex justify-end w-[180px]">
          <el-button
            :type="$elComponentType.danger"
            @click="removeProduct"
          >
            Remove
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue'
import IconVegan from '~icons/icon/vegan'
import debounce from 'lodash/debounce'

const props = defineProps<{
  product: IProduct
}>()

const emit = defineEmits<{
  (e: 'update-product', updatedProduct: IProduct)
  (e: 'remove-product', productId: string)
}>()

const productInput = ref<HTMLInputElement | null>(null)

const localProduct = ref({ ...props.product })
const grams = ref(localProduct.value.grams)

const calculatedNutrition = computed(() => {
  return nutritionService.calcNutritionPerGrams(props.product.nutritionDetails, grams.value)
})

const saveChangesDebounce = debounce(() => {
  localProduct.value.grams = grams.value
  emit('update-product', { ...localProduct.value })
}, 500)

function handleInputChange () {
  saveChangesDebounce()
}

function removeProduct () {
  emit('remove-product', localProduct.value.id)
}

onMounted(async () => {
  await nextTick()
  if (productInput.value) {
    productInput.value.focus()
  }
})
</script>
