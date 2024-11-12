<template>
  <header class="app-container--main">
    <section class="flex justify-between px-[20px] 2xl:px-[80px] mt-[100px]">
      <div class="flex justify-around flex-col max-w-[410px]">
        <h1 class="font-bold leading-[60px] text-[55px]">
          Welcome to a Calorie Mate -
        </h1>

        <p class="text-[28px] leading-10 font-light mt-2 text-gray-dark">
          your personal companion on the journey to a healthier lifestyle.
        </p>
        <AboutUsGoalItems class="mt-[60px]" />
      </div>

      <div class="2xl:min-w-[610px] 2xl:min-h-[355px] min-w-[405px] min-h-[235px]">
        <SkeletonImage
          v-model:src="headerImage"
          img-contain-class="object-contain"
          class="w-full h-full max-w-full max-h-full"
        />
      </div>
    </section>
  </header>
</template>

<script lang="ts" setup>
const headerImage = '/src/assets/images/about-us/header/macbook_mockup.png'
</script>
