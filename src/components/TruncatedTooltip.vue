<template>
  <el-popover
    v-if="multiline > 1"
    :disabled="!state.showTooltip"
    :showAfter="300"
    :placement="placement"
    :popperClass="popperClass"
    trigger="hover"
  >
    <template #reference>
      <div
        ref="root"
        class="multi-truncate"
        v-bind="$attrs"
        :style="`--mt-lines: ${multiline}`"
        @mouseenter="checkVisibility"
      >
        <slot>{{ contentProp }}</slot>
      </div>
    </template>

    <slot>{{ prefix }}{{ contentProp }}</slot>
  </el-popover>

  <el-tooltip
    v-else
    :content="`${prefix}${state.content}`"
    :placement="placement"
    :showAfter="300"
    :popperClass="popperClass"
    :disabled="!state.showTooltip"
  >
    <div ref="root" class="truncate" v-bind="$attrs" @mouseenter="checkVisibility">
      <slot>{{ contentProp }}</slot>
    </div>
  </el-tooltip>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  multiline?: number
  placement?: string
  prefix?: string
  disabled?: boolean
  maxWidthClass?: string
  contentProp?: string | number
  noPointerEvents?: boolean
}>(), {
  multiline: 1,
  placement: 'top-start',
  disabled: false,
  maxWidthClass: '!max-w-[350px]',
  prefix: '',
  noPointerEvents: true
})

const state = reactive({
  showTooltip: false,
  content: ''
})

const root = ref()

const popperClass = computed(() => {
  let baseClass = props.maxWidthClass

  if (props.noPointerEvents) {
    baseClass += ' pointer-events-none'
  }

  return baseClass
})

watch(() => props.disabled, () => {
  checkVisibility()
}, { immediate: true })

function checkVisibility () {
  const el = root.value

  if (!el || props.disabled) {
    state.showTooltip = false
    return
  }

  if (props.multiline === 1) {
    state.showTooltip = el.scrollWidth > el.clientWidth
  } else {
    state.showTooltip = el.scrollHeight > el.clientHeight
  }

  state.content = el.innerText
}
</script>
