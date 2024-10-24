<template>
  <aside class="h-screen bg-white">
    <div class="pt-14 pb-12 font-poppins text-[26px] leading-[26px] text-primary-dark text-center border-b">
      <h1><b>CALORIE</b>MATE</h1>
    </div>
    <div class="pl-5 pt-10">
      <ul class="flex flex-col gap-5">
        <li
          v-for="item in menuList"
          :key="item.routeName"
          class="font-medium leading-[30px] w-full block
          text-gray-light hover:font-medium hover:text-primary-dark relative"
        >
          <router-link
            class="w-full truncate flex items-center"
            :to="{ name:item.routeName }"
            active-class="dsidebar__link--active"
            exact-active-class="sidebar__link--active"
          >
            <component :is="item.icon" class="mr-2 menu-icon" />
            {{ item.label }}
          </router-link>
        </li>
      </ul>
      <div class="pr-5 mt-20 flex flex-col w-full">
        <el-button @click="logout">Logout</el-button>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import IconHome from '~icons/icon/home'
import IconProfile from '~icons/icon/profile'
import IconSignIn from '~icons/icon/sign-in'
import IconRecepiesAndProducts from '~icons/icon/recepies-and-products'
import IconAdjustMeal from '~icons/icon/adjust-meal'
import IconHealthAndNutrition from '~icons/icon/health-and-nutrition'
import IconApprove from '~icons/icon/approve'
import IconAboutUs from '~icons/icon/about-us'
import IconSignUp from '~icons/icon/sign-up'

import type { FunctionalComponent } from 'vue'
import type { routeNames } from '@/router/route-names'

type TRouteNames = Extract<keyof typeof routeNames, string>

interface ISidebarMenuList {
  label: string
  icon?: FunctionalComponent
  routeName: TRouteNames
}

const menuList: ISidebarMenuList[] = [
  {
    label: 'Dashboard',
    routeName: 'dashboard',
    icon: IconHome
  },
  {
    label: 'Profile',
    routeName: 'profileSettings',
    icon: IconProfile
  },
  {
    label: 'Sign Up',
    routeName: 'signup',
    icon: IconSignUp
  },
  {
    label: 'Sign In',
    routeName: 'signin',
    icon: IconSignIn
  },
  {
    label: 'Adjust Meal',
    routeName: 'updateMeal',
    icon: IconAdjustMeal
  },
  {
    label: 'Recepies and products',
    routeName: 'recepiesAndProducts',
    icon: IconRecepiesAndProducts
  },
  {
    label: 'Approve products and recepies',
    routeName: 'productRecipeApproval',
    icon: IconApprove
  },
  {
    label: 'Health & Nutrition Calculators',
    routeName: 'calculators',
    icon: IconHealthAndNutrition
  },
  {
    label: 'Get to Know Us',
    routeName: 'aboutUs',
    icon: IconAboutUs
  }
]
// will be done in further
function logout () {}
</script>

<style lang="scss" scoped>
.sidebar__link--active {

.menu-icon {
  @apply fill-primary
}
  &::after {
    content: '';
    @apply block absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-9 bg-primary rounded-full;
  };

  @apply font-bold text-primary-dark fill-primary;
}
</style>
