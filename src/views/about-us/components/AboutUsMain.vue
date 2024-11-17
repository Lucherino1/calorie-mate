<template>
  <main class="flex flex-col justify-center items-center mt-[100px]">
    <p class="page-header w-full text-center mb-10">Discover Calorie Mate</p>

    <section class="flex flex-wrap gap-10 px-[20px] 2xl:px-[80px]">
      <AboutUsDiscoverCard
        v-for="(item, index) in discoverCardsData"
        :key="index"
        :image-src="item.imageSrc"
        :paragraph="item.paragraph"
        :title="item.title"
      />
    </section>

    <section class="text-center w-full mt-[150px]">
      <p class="page-header w-full mb-10">Our mission</p>
      <div class="relative">
        <div class="text-white bg-primary-dark py-8 w-full text-xl">
          <p class="font-bold text-2xl mb-5">
            We believe that taking control of your health shouldn’t be complicated.
          </p>

          <p class="font-light text-center px-2 lg:px-[250px]">
            Our mission is to provide a user-friendly platform that empowers
            you to make informed decisions about your nutrition and well-being.
          </p>
        </div>
      </div>

      <p class="page-header w-full mb-10 mt-[150px]">Success Stories</p>
      <div class="flex justify-center gap-10 px-5">
        <AboutUsSuccessCard
          v-for="(person, index) in peopleData"
          :key="index"
          :person="person"
        />
      </div>

      <div class="my-[100px]">
        <router-link
          :to="{ name: routeNames.signup }"
          class="flex items-center justify-center w-full"
        >
          <el-button
            class="w-[450px] p-8 text-xl"
            :size="$elComponentSize.large"
            :type="$elComponentType.primary"
          >
            Join Calorie Mate
          </el-button>
        </router-link>
        <p class="text-gray-dark mt-5">To achieve your goals</p>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { routeNames } from '@/router/route-names'

const discoverCardsData = [
  {
    imageSrc: '/images/about-us/main/calories-calculator.png',
    title: 'Calorie Tracker',
    paragraph: 'Track your daily calorie intake effortlessly, and stay on top of your progress with clear insights.'
  },
  {
    imageSrc: '/images/about-us/main/meal.png',
    title: 'Food Diary',
    paragraph: 'Record your meals and snacks, and gain a deeper understanding of your eating habits.'
  },
  {
    imageSrc: '/images/about-us/main/food.png',
    title: 'Product and Recipe Library',
    paragraph: 'Add your own foods and recipes, or browse through our database to find inspiration for balanced meals.'
  },
  {
    imageSrc: '/images/about-us/main/target.png',
    title: 'Goal Setting',
    paragraph: 'Define your personal health goals — whether it’s weight loss, muscle gain, or maintenance — and let us guide you every step.'
  }
]

const peopleData = [
  {
    name: 'Anna',
    age: '24',
    imageBefore: '/images/about-us/main/success-stories/anna-before.jpeg',
    imageAfter: '/images/about-us/main/success-stories/anna-after.jpg',
    weightBefore: '65 kg',
    weightAfter: '53 kg',
    quote: 'If you want to accomplish something, then you will accomplish it, regardless of how bumpy the road is. I always told myself: I can\'t go back and start from the beginning, but I can start today and follow a new path!'
  },
  {
    name: 'Stepan',
    age: '37',
    imageBefore: '/images/about-us/main/success-stories/james-before.jpeg',
    imageAfter: '/images/about-us/main/success-stories/james-after.jpeg',
    weightBefore: '85 kg',
    weightAfter: '75 kg',
    quote: 'Calorie Mate helped me stay consistent. I’ve learned that real change comes from small, steady improvements. With each step, I got closer to my goal.'
  },
  {
    name: 'Zac',
    age: '30',
    imageBefore: '/images/about-us/main/success-stories/zac-before.jpg',
    imageAfter: '/images/about-us/main/success-stories/zac-after.jpg',
    weightBefore: '60 kg',
    weightAfter: '81 kg',
    quote: 'I was often bullied, but now I’m strong enough to stand up for myself. Calorie Mate gave me the motivation to change and build confidence.'
  }
]
</script>
