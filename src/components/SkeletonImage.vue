<template>
  <div
    ref="intersectionTargetRef"
    class="w-full h-full relative flex"
    :class="{'flex items-center justify-center bg-gray-ultra-light': imageHasError}"
  >
    <el-skeleton v-if="isSkeletonLoading" class="w-full h-full absolute" animated>
      <template #template>
        <el-skeleton-item class="w-full h-full absolute" />
      </template>
    </el-skeleton>

    <img
      v-if="computedImgSrc && imageLoadingStarted"
      class="w-full h-full absolute"
      :class="imgContainClass"
      :src="computedImgSrc"
      @load="onLoad"
      @error="onError"
    >

    <slot v-if="imageHasError" name="placeholder">
      <IconErrorRecipe class="fill-gray-dark" />
    </slot>
  </div>
</template>

<script lang="ts" setup>
import IconErrorRecipe from '~icons/icon/error-recipe'

const props = withDefaults(
  defineProps<{
    imgContainClass?: 'object-contain' | 'object-cover'
    imgSrcProp?: string
  }>(),
  {
    imgContainClass: 'object-cover'
  }
)

const imgSrc = defineModel<string>('src')

const intersectionTargetRef = ref<HTMLElement | null>(null)
const observedImgSrc = ref<string | null>(null)

const imageHasError = ref(false)
const isSkeletonLoading = ref(true)
const imageLoadingStarted = ref(false)
const isLoaded = ref(false)

const computedImgSrc = computed(() => props.imgSrcProp || imgSrc.value)

const onLoad = () => {
  if (computedImgSrc.value === '') {
    imageHasError.value = true
    isLoaded.value = true
    isSkeletonLoading.value = false
    return
  }
  isLoaded.value = true
  imageHasError.value = false
  isSkeletonLoading.value = false
  imageLoadingStarted.value = true
}

const onError = () => {
  imageHasError.value = true
  isSkeletonLoading.value = false
  imageLoadingStarted.value = false
}

let observer: IntersectionObserver | null = null

const observeImage = () => {
  if (!computedImgSrc.value) {
    imageHasError.value = true
    isSkeletonLoading.value = false
    return
  }
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        imageLoadingStarted.value = true
        observedImgSrc.value = computedImgSrc.value
        observer?.disconnect()
      }
    },
    {
      rootMargin: '300px'
    }
  )
  if (intersectionTargetRef.value) {
    observer.observe(intersectionTargetRef.value)
  }
}

onMounted(() => {
  observeImage()
})

onUnmounted(() => {
  if (observer && intersectionTargetRef.value) {
    observer.disconnect()
  }
})
</script>
