<template>
  <div
    class="w-9 h-14 border-[3px] shadow-sm border-gray border-t-0 rounded-b-lg overflow-hidden cursor-pointer relative"
    @click="toggleFill"
  >
    <div
      class="filled-glass w-full absolute bottom-0 left-0 transition-all duration-500 ease-in-out"
      :style="{ height: isFilled ? '90%' : '0%' }"
    />
  </div>
</template>

<script setup>
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
