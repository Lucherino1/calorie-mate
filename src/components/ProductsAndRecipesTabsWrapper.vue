<template>
  <div v-loading.fullscreen="loading" class="app-container--main h-full">
    <div class="flex h-full">
      <div class="flex-col flex gap-5 w-full">
        <div class="flex items-center text-center justify-between">
          <div class="flex flex-col gap-5">
            <BackButton v-if="backButton" :button-text="'Back to dashboard'" :route-name="$routeNames.dashboard" />
            <h1 class="font-bold text-[34px] leading-10">
              {{ pageTitle }}
            </h1>
          </div>

          <slot name="header" />
        </div>

        <div class="mx-0">
          <el-tabs v-model="modelValue" stretch class="min-h-[500px] flex">
            <el-tab-pane label="Products" name="products" class="w-full overflow-y-scroll">
              <slot name="products" />
            </el-tab-pane>

            <el-tab-pane class="overflow-y-scroll" label="Recipes" name="recipes">
              <slot name="recipes" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
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
