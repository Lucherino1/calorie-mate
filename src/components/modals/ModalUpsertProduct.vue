<template>
  <el-dialog
    v-model="isModalVisible"
    :modal="true"
    :close-icon="IconClose"
    plain
    center
    :z-index="2000"
    :lock-scroll="true"
    close-on-press-escape
    :title="props.title"
    width="700px"
    class="rounded-xl pb-0"
  >
    <p class="text-center mx-0 text-sm mb-2">
      * All nutritional values should be based on 100 g of the product.
    </p>

    <el-form
      ref="formRef"
      :show-message="false"
      :model="product"
      :rules="formRules"
      @submit.prevent="handleSave"
    >
      <div class="flex gap-28 justify-center items-start py-10">
        <div class="flex flex-col gap-4 max-w-[300px]">
          <el-form-item prop="name">
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
                  :label="normalizeStringLabel(type)"
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

        <div class="flex flex-col justify-end items-end gap-4">
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
                    content="Submit for admin review to add this product to the public database."
                    placement="top"
                  >
                    <IconInfo class="w-[18px] h-[18px] my-0 fill-primary" />
                  </el-tooltip>
                </div>
              </template>
            </el-checkbox>
            <el-button @click="$emit('close')">Cancel</el-button>
            <div>
              <el-button
                :loading="modalButtonLoading"
                :type="$elComponentType.primary"
                native-type="submit"
              >
                Save
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { EProductType } from '@/types/products-and-recipes.enums'
import IconClose from '~icons/icon/close'
import IconInfo from '~icons/icon/info'
import { normalizeStringLabel, showNotification } from '@/helpers'

const props = defineProps<{
  title: string
  isCreating: boolean
  modalButtonLoading: boolean
}>()

const product = defineModel<IProduct>('product')
const isModalVisible = defineModel<boolean>('visible')

const productTypes = ref<TProductType[]>(Object.values(EProductType))

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', product: IProduct): void
}>()

const authStore = useAuthStore()

const formRef = useTemplateRef<TElementPlus['FormInstance']>('formRef')
const formRules = useElFormRules(
  {
    name: [useRequiredRule()]
  }
)

const submitForReview = ref(false)

function handleSave () {
  formRef.value?.validate(async (isValid) => {
    if (isValid) {
      if (!authStore.isUserAdmin) product.value.isUnderReview = submitForReview.value

      emit('save', product.value)
    } else {
      showNotification('Please fill in all required fields.', '', 'warning')
    }
  })
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
