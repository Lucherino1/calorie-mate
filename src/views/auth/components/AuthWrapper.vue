<template>
  <main class="app-container">
    <div class="flex">
      <div class="flex-1 flex flex-col justify-center items-center">
        <div class="flex flex-col justify-between py-10 h-full w-full max-w-[410px] px-2">
          <BackButton :button-text="'Back'" :route-name="$routeNames.aboutUs" />

          <div>
            <h2 class="text-4xl leading-[56px] font-bold">{{ titleText }}</h2>
            <slot />
            <div class="flex flex-col gap-3 mt-1">
              <div class="flex gap-1">
                <p>{{ authPromptText }}</p>
                <el-button link :type="$elComponentType.primary" @click="toggleAuthPage">
                  {{ toggleAuthPageBtnText }}
                </el-button>
              </div>
            </div>
          </div>
          <p class="font-medium text-sm leading-6 text-gray-light text-nowrap">
            © 2024 Calories Mate. All Rights Reserved. Made with love by <b>Good People</b>.
          </p>
        </div>
      </div>

      <div
        class="flex-1 flex justify-center items-center px-[5px] bg-[url('/public/auth-bg.jpg')]
        bg-cover bg-center h-screen rounded-bl-[120px] font-poppins"
      >
        <div class="flex flex-col w-full max-w-[410px] justify-center items-center">
          <div class="flex-shrink-0 h-[280px] w-[280px] mb-[40px]">
            <img
              class=" object-cover"
              src="/public/logo.png"
              alt="logo"
            >
          </div>
          <div class="flex justify-center items-center text-center mb-[100px]">
            <h1 class="text-5xl text-white"><b>CALORIE</b> MATE</h1>
          </div>

          <router-link
            :to="{ name: routeNames.aboutUs }"
            class="inline-block"
          >
            <button
              class="text-white text-lg leading-[18px] px-10 lg:px-[110px]
             py-[20px] border-2 border-gray-light rounded-[28px] sm:px-1 md:px-5
             hover:bg-white hover:text-primary transition-all duration-300"
            >
              <p class="text-nowrap leading-10">
                <b>Click here</b><br>to learn more about us
              </p>
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { routeNames } from '@/router/route-names'

defineProps<{
  titleText: string
  authPromptText: string
  toggleAuthPageBtnText: string
  toggleAuthPage: () => void
}>()
</script>
