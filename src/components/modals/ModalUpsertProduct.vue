<template>
  <el-dialog
    v-model="isModalVisible"
    :validate-on-rule-change="false"
    :modal="true"
    :close-icon="IconClose"
    plain
    center
    :z-index="2000"
    :lock-scroll="true"
    close-on-press-escape
    :title="props.title"
    width="470px"
    class="rounded-xl"
  >
    <p class="text-center mx-0 text-sm mb-2">
      * All nutritional values should be based on 100 g of the product.
    </p>

    <el-form
      ref="formRef"
      :model="product"
      :rules="formRules"
      label-position="top"
      @submit.prevent="handleSave"
    >
      <div class="flex gap-20 justify-center pt-3">
        <div class="flex flex-col gap-3 max-w-[300px]">
          <el-form-item label="Name" prop="name">
            <el-input v-model="product.name" placeholder="Your product name is..." />
          </el-form-item>

          <el-form-item label="Type" required>
            <el-select v-model="product.type" class="min-w-[100px]">
              <el-option
                v-for="type in productTypes"
                :key="type"
                :label="normalizeStringLabel(type)"
                :value="type"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <div class="flex">
              <el-switch
                v-model="product.isVegan"
                size="large"
                active-text="Vegan"
                inactive-text="Not vegan"
              />
            </div>
          </el-form-item>

          <el-checkbox
            v-if="isCreating"
            v-model="submitForReview"
            class="self-start"
            :size="$elComponentSize.large"
          >
            <template #default>
              <div class="flex justify-center gap-1 items-center text-center">
                <p>Submit for review</p>

                <InfoTooltip
                  content="Submit for admin review to add this product to the public database."
                  :icon="IconInfo"
                  fill-class="fill-primary"
                />
              </div>
            </template>
          </el-checkbox>
        </div>

        <div class="flex flex-col justify-end items-end gap-2 min-w-[180px]">
          <el-form-item label="Carbs:">
            <el-input-number v-model="product.nutritionDetails.carbs" type="number" :min="0">
              <template #suffix>g</template>
            </el-input-number>
          </el-form-item>

          <el-form-item label="Proteins:">
            <el-input-number v-model="product.nutritionDetails.proteins" type="number" :min="0">
              <template #suffix>g</template>
            </el-input-number>
          </el-form-item>

          <el-form-item label="Fats:">
            <el-input-number v-model="product.nutritionDetails.fats" type="number" :min="0">
              <template #suffix>g</template>
            </el-input-number>
          </el-form-item>

          <p class="text-right text- font-semibold">
            Total Calories: {{ totalCalories }} kcal
          </p>
          <div class="flex justify-end items-center gap-4 mt-5">
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
