<template>
  <div
    ref="intersectionTargetRef"
    class="w-full h-full bg-gray-ultra-light relative"
    :class="{'flex items-center justify-center': imageHasError}"
  >
    <el-skeleton v-if="isSkeletonLoading" class="w-full h-full absolute" animated>
      <template #template>
        <el-skeleton-item class="w-full h-full absolute" />
      </template>
    </el-skeleton>

    <img
      v-if="observedImgSrc && imageLoadingStarted"
      class="object-cover w-full h-full absolute"
      :src="observedImgSrc"
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
// const props = defineProps<{
//   imgSrc: string
// }>()

const imgSrc = defineModel<string>('src')

const intersectionTargetRef = ref<HTMLElement | null>(null)
const observedImgSrc = ref<string | null>(null)

const imageHasError = ref(false)
const isSkeletonLoading = ref(true)
const imageLoadingStarted = ref(false)
const isLoaded = ref(false)

const onLoad = () => {
  if (imgSrc.value === '') {
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
  if (!imgSrc.value || imgSrc.value === null) {
    imageHasError.value = true
    isSkeletonLoading.value = false
    return
  }
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        imageLoadingStarted.value = true
        observedImgSrc.value = imgSrc.value
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
