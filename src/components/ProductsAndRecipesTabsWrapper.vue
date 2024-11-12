<template>
  <div class="app-container--main flex-col gap-3 flex h-full">
    <div class="flex items-center text-center justify-between">
      <div class="flex flex-col gap-5">
        <BackButton v-if="backButton" :button-text="'Back to dashboard'" :route-name="$routeNames.dashboard" />
        <h1 class="font-bold text-[34px] leading-10">
          {{ pageTitle }}
        </h1>
      </div>

      <slot name="header" />
    </div>

    <div class="mx-0 flex-1 overflow-hidden">
      <el-tabs v-model="modelValue" stretch class="gap-3 flex w-full h-full">
        <el-tab-pane lazy label="Products" name="products" class="h-full">
          <slot name="products" />
        </el-tab-pane>

        <el-tab-pane lazy class="h-full" label="Recipes" name="recipes">
          <slot name="recipes" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  pageTitle: string
  backButton?: boolean
}>()

const modelValue = defineModel<string>('active-tab')
</script>
