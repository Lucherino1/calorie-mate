<template>
  <div class="flex items-center justify-end gap-5 w-full mb-5">
    <el-input
      v-model="searchQuery"
      :prefix-icon="IconSearchFood"
      :size="$elComponentSize.large"
      :disabled="isSearchAndInputDisabled"
      class="w-full"
      :placeholder="searchPlaceholder"
      clearable
      @input="onSearchInput"
    />
    <el-select
      v-model="selectedType"
      multiple
      collapse-tags-tooltip
      :tag-type="$elComponentType.primary"
      :disabled="isSearchAndInputDisabled"
      collapse-tags
      :max-collapse-tags="1"
      :size="$elComponentSize.large"
      clearable
      class="max-w-[200px]"
      :placeholder="selectPlaceholder"
      @change="onFilterChange"
    >
      <el-option
        v-for="type in optionTypes"
        :key="type"
        class="capitalize"
        :label="normalizeStringLabel(type)"
        :value="type"
      />
    </el-select>
    <el-button
      :type="$elComponentType.primary"
      :size="$elComponentSize.large"
      @click="onAddNewProduct"
    >
      {{ buttonText }}
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import IconSearchFood from '~icons/icon/search-food'
import { normalizeStringLabel } from '@/helpers'

defineProps<{
  isSearchAndInputDisabled: boolean
  optionTypes: TProductType[] | TRecipesType[]
  selectPlaceholder: string
  searchPlaceholder: string
  buttonText: string
}>()

const emit = defineEmits<{
  (e: 'search-input', value: string): void
  (e: 'filter-change', value: TProductType[]): void
  (e: 'add-new-product'): void
}>()

const searchQuery = defineModel<string>('search-query')
const selectedType = defineModel<TProductType[]>('selected-type')

function onSearchInput (value: string) {
  emit('search-input', value)
}

function onFilterChange (value: TProductType[]) {
  emit('filter-change', value)
}

function onAddNewProduct () {
  emit('add-new-product')
}

</script>
