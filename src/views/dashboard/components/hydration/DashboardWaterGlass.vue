<template>
  <div
    class="w-9 h-14 border-[3px] shadow-sm border-gray border-t-0
    rounded-b-lg overflow-hidden cursor-pointer relative group"
    @click="toggleFill"
  >
    <div
      class="filled-glass w-full absolute bottom-0 left-0 transition-all duration-500 ease-in-out"
      :class="{ 'h-[90%]': isFilled, 'h-0': !isFilled }"
    />

    <div
      class="absolute inset-0 flex items-center justify-center opacity-0
      transition-opacity duration-300 group-hover:opacity-100"
    >
      <component :is="isFilled ? IconMinus : IconPlus" class="w-4 h-4 text-gray fill-primary-dark" />
    </div>
  </div>
</template>

<script setup>
import IconPlus from '~icons/icon/plus'
import IconMinus from '~icons/icon/minus'
const isFilled = defineModel('isFilled', { type: Boolean, default: false })

const toggleFill = () => {
  isFilled.value = !isFilled.value
}
</script>

<style scoped>
.filled-glass {
  background-color: #00c9ff;
}
</style>
