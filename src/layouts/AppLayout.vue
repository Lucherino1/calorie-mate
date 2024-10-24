<template>
  <component :is="layouts[props.layout]">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { ELayouts } from '@/types/enums'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const props = withDefaults(defineProps<{
  layout?: keyof typeof ELayouts
}>(), {
  layout: 'default'
})

const layouts: Record<ELayouts, typeof BlankLayout | typeof DefaultLayout> = {
  blank: BlankLayout,
  default: DefaultLayout
}
</script>
