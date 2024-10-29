<template>
  <component :is="layouts[props.layout] " :loading="loading">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { ELayouts } from '@/types/enums'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const props = withDefaults(defineProps<{
  layout?: keyof typeof ELayouts
  loading: boolean
}>(), {
  layout: 'default'
})

const layouts: Record<ELayouts, Component> = {
  blank: BlankLayout,
  default: DefaultLayout
}
</script>
