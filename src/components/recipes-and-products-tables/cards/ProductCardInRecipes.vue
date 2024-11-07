<template>
  <div class="w-full max-h-[100px]">
    <el-card class="max-h-[80px]">
      <div class="flex items-center justify-between">
        <div class="flex min-w-[200px] items-center justify-between">
          <div class="flex justify-center items-center">
            <div class="min-w-[110px] text-left flex flex-col items-start">
              <div class="flex justify-center items-center mr-2">
                <span class="max-w-[80px] truncate font-bold text-[12px] text-primary-dark">
                  <TruncatedTooltip :maxWidthClass="'!max-w-[80px]'" :contentProp="product.name" :multiline="1">
                    {{ product.name }}
                  </TruncatedTooltip>
                </span>
                <span v-if="product.isVegan" class="flex items-center fill-success w-[10px] h-[10px] ml-2">
                  <IconVegan class="w-full h-full" />
                </span>
              </div>
              <span class="text-[12px] text-gray-light capitalize">{{ product.type }}</span>
            </div>
          </div>
          <el-input-number
            ref="productInput"
            v-model="grams"
            :min="1"
            :size="$elComponentSize.small"
            @input="handleInputChange"
          >
            <template #suffix>g</template>
          </el-input-number>
        </div>

        <ul class="flex text-center gap-5 text-gray-dark text-[12px] ml-2">
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

        <div class="my-0 flex justify-end ml-2">
          <el-button
            link
            :size="$elComponentSize.small"
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
