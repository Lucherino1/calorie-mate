<template>
  <div>
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

    <main class="flex flex-col justify-center items-center mt-[150px] px-[20px] 2xl:px-[80px]">
      <p class="page-header w-full text-center mb-10">Discover Calorie Mate</p>
      <div class="flex flex-wrap gap-10">
        <AboutUsDiscoverCard
          v-for="(item, index) in discoverCardsData"
          :key="index"
          :image-src="item.imageSrc"
          :paragraph="item.paragraph"
          :title="item.title"
        />
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
const headerImage = '/src/assets/images/about-us/header/macbook_mockup.png'

const discoverCardsData = ref([
  {
    imageSrc: '/src/assets/images/about-us/main/dashboard.png',
    title: 'Calorie Tracker',
    paragraph: 'Track your daily calorie intake effortlessly,f and stay on top of your progress with clear insights.'
  },
  {
    imageSrc: '/src/assets/images/about-us/main/meal.png',
    title: 'Food Diary',
    paragraph: 'Record your meals and snacks, and gain a deeper understanding of your eating habits.'
  },
  {
    imageSrc: '/src/assets/images/about-us/main/food.png',
    title: 'Product and Recipe Library',
    paragraph: 'Add your own foods and recipes, or browse through our database to find inspiration for balanced meals.'
  },
  {
    imageSrc: '/src/assets/images/about-us/main/target.png',
    title: 'Goal Setting',
    paragraph: 'Define your personal health goals — whether it’s weight loss, muscle gain, or maintenance — and let us guide you every step.'
  }
])
</script>
