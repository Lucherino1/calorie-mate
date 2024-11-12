<template>
  <header class="app-container--main">
    <section class="flex gap-[140px] px-[80px] mt-[100px]">
      <div class="flex justify-around flex-col">
        <h1 class="font-bold leading-[60px] text-[55px]">
          Welcome to a Calorie Mate -
        </h1>
        <p class="text-[28px] leading-10 font-light mt-2 text-gray-dark">
          your personal companion on the journey to a healthier lifestyle.
        </p>
        <AboutUsGoalItems class="mt-[60px]" />
      </div>
      <div class="flex-1 min-w-[610px] min-h-[355px]">
        <SkeletonImage v-model:src="headerImage" class="w-full h-full max-w-full max-h-full object-contain" />
      </div>
    </section>
  </header>
</template>

<script lang="ts" setup>
const headerImage = '/src/assets/images/about-us/macbook_mockup.png'
</script>
