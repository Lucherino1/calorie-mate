<template>
  <aside class="h-screen bg-white">
    <div class="pt-14 pb-12 font-poppins text-[26px] leading-[26px] text-primary-dark text-center border-b">
      <h1><b>CALORIE</b>MATE</h1>
    </div>
    <div class="pl-9 pt-10">
      <ul class="flex flex-col gap-5">
        <li
          v-for="item in menuList"
          :key="item.routeName"
          class="font-medium leading-[30px] block w-full
          text-gray-light hover:font-medium hover:text-primary-dark relative"
        >
          <router-link
            class="w-full block"
            :to="{ name:item.routeName }"
            active-class="sidebar__link--active"
          >
            {{ item.label }}
          </router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { routeNames } from '@/router/route-names'

type TRouteNames = keyof typeof routeNames

interface ISidebarMenuList {
  label: string
  routeName: TRouteNames
}

const menuList: ISidebarMenuList[] = [
  {
    label: 'Dashboard',
    routeName: 'dashboard'
  },
  {
    label: 'Profile',
    routeName: 'profileSettings'
  },
  {
    label: 'Adjust Meal',
    routeName: 'updateMeal'
  },
  {
    label: 'Recepies and products',
    routeName: 'recepiesAndProducts'
  },
  {
    label: 'Health & Nutrition Calculators',
    routeName: 'calculators'
  },
  {
    label: 'Get to Know Us',
    routeName: 'aboutUs'
  }
]
</script>

<style lang="scss" scoped>
.sidebar__link--active {
  &::after {
    content: '';
    @apply block absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-9 bg-primary rounded-full;
  };

  @apply font-bold text-primary-dark;
}
</style>
