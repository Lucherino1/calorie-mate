<template>
  <component :is="layouts[props.layout]">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { ELayouts } from '@/types/enums'
import BlankLayout from './BlankLayout.vue'
import DefaultLayout from './DefaultLayout.vue'

const props = withDefaults(defineProps<{
  layout: ELayouts
}>(), {
  layout: ELayouts.default
})

const layouts = {
  [ELayouts.blank]: BlankLayout,
  [ELayouts.default]: DefaultLayout
}
</script>
