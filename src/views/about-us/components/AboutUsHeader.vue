<template>
  <header class="app-container--main">
    <section class="flex justify-between px-[20px] 2xl:px-[80px] mt-[100px]">
      <div class="flex justify-around flex-col max-w-[410px]">
        <h1 class="font-bold leading-[60px] text-[55px]">
          Welcome to a Calorie Mate —
        </h1>

        <p class="text-[28px] leading-10 font-light mt-2 text-gray-dark">
          your personal companion on the journey to a healthier lifestyle.
        </p>
        <AboutUsGoalItems class="mt-[60px]" />
      </div>

      <div class="2xl:max-w-[610px] 2xl:max-h-[355px] max-w-[405px] max-h-[235px]">
        <img
          src="/images/about-us/header/macbook_mockup.png"
          class="w-full h-full object-contain"
          alt="macbook mockup"
        >
      </div>
    </section>
  </header>
</template>
