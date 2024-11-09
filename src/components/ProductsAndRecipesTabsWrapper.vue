<template>
  <div v-loading.fullscreen="loading" class="app-container--main flex-col flex h-full">
    <div class="flex items-center text-center justify-between">
      <div class="flex flex-col gap-5">
        <BackButton v-if="backButton" :button-text="'Back to dashboard'" :route-name="$routeNames.dashboard" />
        <h1 class="font-bold text-[34px] leading-10">
          {{ pageTitle }}
        </h1>
      </div>

      <slot name="header" />
    </div>

    <div class="mx-0 h-full overflow-hidden">
      <el-tabs v-model="modelValue" stretch class="min-h-[500px] flex w-full h-full">
        <el-tab-pane label="Products" name="products" class="w-full overflow-y-scroll h-full pt-5">
          <slot name="products" />
        </el-tab-pane>

        <el-tab-pane class="w-full h-full overflow-y-scroll pt-5" label="Recipes" name="recipes">
          <slot name="recipes" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  pageTitle: string
  loading: boolean
  backButton?: boolean
}>()

const modelValue = defineModel<string>('active-tab')
</script>
