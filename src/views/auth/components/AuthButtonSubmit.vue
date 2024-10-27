<template>
  <el-button
    native-type="submit"
    class="w-full"
    :type="$elComponentType.primary"
    :size="$elComponentSize.large"
  >
    {{ submitBtnText }}
  </el-button>
</template>

<script lang="ts" setup>
defineProps<{
  submitBtnText: string
}>()
</script>
