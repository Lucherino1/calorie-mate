<template>
  <el-dialog
    v-model="isModalVisible"
    :modal="true"
    plain
    center
    :z-index="2000"
    :lock-scroll="true"
    close-on-press-escape
    :title="props.title"
    width="700px"
    class="rounded-xl"
  >
    <el-form :model="product">
      <div class="flex gap-28 justify-center items-start py-10">
        <div class="flex flex-col gap-4 max-w-[300px]">
          <el-form-item>
            <div class="flex gap-2">
              <p class="font-semibold">Name:</p>
              <el-input v-model="product.name" />
            </div>
          </el-form-item>

          <el-form-item>
            <div class="flex w-full gap-2">
              <p class="font-semibold">Type:</p>
              <el-select v-model="product.type" class="min-w-[100px]">
                <el-option
                  v-for="type in productTypes"
                  :key="type"
                  :label="type"
                  :value="type"
                />
              </el-select>
            </div>
          </el-form-item>

          <el-form-item>
            <div class="flex justify-center items-center">
              <el-switch
                v-model="product.isVegan"
                size="large"
                active-text="Vegan"
                inactive-text="Not vegan"
              />
            </div>
          </el-form-item>
        </div>

        <div class="flex flex-col gap-4">
          <el-form-item>
            <div class="flex min-w-[230px] justify-between">
              <p class="font-semibold">Carbs:</p>
              <el-input-number v-model="product.nutritionDetails.carbs" type="number" :min="1">
                <template #suffix>g</template>
              </el-input-number>
            </div>
          </el-form-item>

          <el-form-item>
            <div class="flex min-w-[230px] justify-between">
              <p class="font-semibold">Proteins:</p>
              <el-input-number v-model="product.nutritionDetails.proteins" type="number" :min="1">
                <template #suffix>g</template>
              </el-input-number>
            </div>
          </el-form-item>

          <el-form-item>
            <div class="flex min-w-[230px] justify-between">
              <p class="font-semibold">Fats:</p>
              <el-input-number v-model="product.nutritionDetails.fats" type="number" :min="1">
                <template #suffix>g</template>
              </el-input-number>
            </div>
          </el-form-item>

          <p class="text-right text- font-semibold">
            Total Calories: {{ totalCalories }} kcal
          </p>
        </div>
      </div>
    </el-form>

    <template #footer>
      <div class="flex justify-between">
        <el-button @click="$emit('close')">Cancel</el-button>
        <div>
          <el-button :type="$elComponentType.danger" @click="handleDelete">
            Delete
          </el-button>
          <el-button :type="$elComponentType.primary" @click="handleSave">
            Save
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { EProductType } from '@/types/products-and-recipes.enums'

const props = defineProps<{
  title: string
}>()

const product = defineModel<IProduct>('product')
const isModalVisible = defineModel<boolean>('visible')

const productTypes = ref<TProductType[]>(Object.values(EProductType))

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', product: IProduct): void
  (e: 'delete', productId: string): void
}>()

function handleSave () {
  if (product.value) {
    emit('save', product.value)
  }
}

function handleDelete () {
  if (product.value) {
    emit('delete', product.value.id)
  }
}

const totalCalories = computed(() => {
  return nutritionService.calcCaloriesByCPF(product.value)
})

watch(
  () => [product.value?.nutritionDetails.proteins,
    product.value?.nutritionDetails.fats,
    product.value?.nutritionDetails.carbs],
  () => {
    if (product.value) {
      product.value.nutritionDetails.calories = totalCalories.value
    }
  }
)

</script>
