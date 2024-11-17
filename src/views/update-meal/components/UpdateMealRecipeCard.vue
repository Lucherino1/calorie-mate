<template>
  <div class="w-full h-full flex flex-col">
    <el-card class="p-5 rounded-3x card--no-shadow">
      <div class="flex gap-10 min-h-[200px]">
        <div class="w-[200px] h-[200px] bg-gray-200 rounded-3xl overflow-hidden">
          <SkeletonImage v-model:src="localRecipe.image">
            <template #placeholder>
              <IconErrorRecipe class="fill-gray-dark" />
            </template>
          </SkeletonImage>
        </div>

        <div class="flex flex-col justify-between flex-1">
          <div class="flex justify-between items-start">
            <div>
              <div class="flex items-center">
                <p class="text-2xl font-bold truncate max-w-[500px]">
                  {{ recipe.name }}
                </p>
                <span v-if="recipe.isVegan" class="flex items-center fill-success w-[20px] h-[20px] ml-2">
                  <IconVegan class="w-full h-full" />
                </span>
              </div>
              <p class="text-gray-500 mt-1">{{ recipe.description }}</p>
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <span class="text-base text-gray-500">Amount:</span>
                <el-input-number
                  ref="recipeInput"
                  v-model="portions"
                  :min="1"
                  :size="$elComponentSize.default"
                  @input="handleInputChange"
                />
              </div>
              <p class="text-gray-light text-right text-sm">
                Portion weight: <b class="text-gray-dark text-base">{{ recipe.portionWeight }}</b>g
              </p>
            </div>
          </div>

          <ul class="flex lg:gap-10 xl:gap-14 mt-5">
            <li class="text-center">
              <p class="text-gray-light">
                Carbs:<br><b class="text-primary-dark text-xl">{{ calcedNutrition.carbs }}</b>
                <span class="text-primary-dark"> g</span>
              </p>
            </li>

            <li class="text-center">
              <p class="text-gray-light">
                Proteins:<br><b class="text-primary-dark text-xl">{{ calcedNutrition.proteins }}</b>
                <span class="text-primary-dark"> g</span>
              </p>
            </li>

            <li class="text-center">
              <p class="text-gray-light">
                Fats:<br><b class="text-primary-dark text-xl">{{ calcedNutrition.fats }}</b>
                <span class="text-primary-dark"> g</span>
              </p>
            </li>

            <li class="text-center">
              <p class="text-gray-light">
                Calories:<br><b class="text-primary-dark text-xl">{{ calcedNutrition.calories }}</b>
                <span class="text-primary-dark"> kcal</span>
              </p>
            </li>
          </ul>

          <div class="flex justify-between mt-3">
            <el-button ref="buttonRef" v-click-outside="onClickOutside">
              Show ingredients
            </el-button>

            <el-popover
              ref="popoverRef"
              :virtual-ref="buttonRef"
              trigger="click"
              title="Ingredients:"
              virtual-triggering
            >
              <div
                v-for="ingredient in recipe.ingredients"
                :key="ingredient.id"
                class="flex flex-col gap-1"
              >
                <p>- {{ ingredient.name }}</p>
              </div>
            </el-popover>

            <div class="flex justify-end w-[180px]">
              <el-button
                :type="$elComponentType.danger"
                @click="removeRecipe"
              >
                Remove
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import debounce from 'lodash/debounce'
import { ClickOutside as vClickOutside } from 'element-plus'
import IconErrorRecipe from '~icons/icon/error-recipe'

const props = defineProps<{
  recipe: IRecipe
}>()

const emit = defineEmits<{
  (e: 'update-recipe', updatedRecipe: IRecipe)
  (e: 'remove-recipe', recipeId: string)
}>()

const recipeInput = ref<HTMLInputElement | null>(null)

const originalRecipe = ref({ ...props.recipe })
const localRecipe = ref({ ...props.recipe })
const portions = ref(localRecipe.value.portions)

const calcedNutrition = computed(() => {
  return nutritionService.calcIngredientsNutrition(originalRecipe.value.ingredients, portions.value)
})

const saveChangesDebounce = debounce(() => {
  localRecipe.value.portions = portions.value
  emit('update-recipe', { ...localRecipe.value })
}, 500)

function handleInputChange () {
  saveChangesDebounce()
}

function removeRecipe () {
  emit('remove-recipe', localRecipe.value.id)
}

const buttonRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}

onMounted(async () => {
  await nextTick()
  if (recipeInput.value) {
    recipeInput.value.focus()
  }
})
</script>
