<template>
  <aside class="h-screen bg-white flex flex-col">
    <div class="pt-14 pb-12 font-poppins text-[26px]  text-primary-dark text-center border-b">
      <h1><b>CALORIE</b> MATE</h1>
    </div>
    <div class="flex-1 pl-5 pt-10">
      <ul class="flex flex-col gap-6">
        <li
          v-for="item in filteredMenuList"
          :key="item.routeName"
          class="font-medium leading-[30px] w-full
          text-gray-light hover:font-medium hover:text-primary-dark relative"
        >
          <router-link
            class="w-full truncate flex items-center"
            :to="{ name: item.routeName }"
            active-class="sidebar__link--active"
            exact-active-class="sidebar__link--active"
          >
            <div class="w-[30px] h-[30px] flex justify-center items-center">
              <component :is="item.icon" class="menu-icon" />
            </div>
            <span class="ml-2">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div v-if="user" class="px-5 py-5 mt-auto flex flex-col w-full">
      <el-button :loading="isLoading" @click="logout">Logout</el-button>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import IconHome from '~icons/icon/home'
import IconProfile from '~icons/icon/profile'
import IconSignIn from '~icons/icon/sign-in'
import IconRecipesAndProducts from '~icons/icon/recipes-and-products'
import IconAdjustMeal from '~icons/icon/adjust-meal'
import IconHealthAndNutrition from '~icons/icon/health-and-nutrition'
import IconApprove from '~icons/icon/approve'
import IconAboutUs from '~icons/icon/about-us'

import type { FunctionalComponent } from 'vue'
import type { ERoles } from '@/views/auth/auth.enums'

const { signout, user } = useAuthStore()
const isLoading = ref(false)

interface ISidebarMenuItem {
  label: string
  routeName: string
  icon: FunctionalComponent
  requiresAuth?: boolean
  roles?: keyof typeof ERoles
  hiddenWhenLoggedIn?: boolean
}

const menuConfig: ISidebarMenuItem[] = [
  {
    label: 'Dashboard',
    routeName: 'dashboard',
    icon: IconHome
  },
  {
    label: 'Profile',
    routeName: 'profileSettings',
    icon: IconProfile,
    requiresAuth: true
  },
  {
    label: 'Sign In',
    routeName: 'signin',
    icon: IconSignIn,
    hiddenWhenLoggedIn: true
  },
  {
    label: 'Adjust Meal',
    routeName: 'updateMeal',
    icon: IconAdjustMeal,
    requiresAuth: true
  },
  {
    label: 'Receipts and products',
    routeName: 'recipesAndProducts',
    icon: IconRecipesAndProducts,
    requiresAuth: true
  },
  {
    label: 'Approve products and recipes',
    routeName: 'productRecipeApproval',
    icon: IconApprove,
    requiresAuth: true,
    roles: 'admin'
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

const filteredMenuList = computed(() => {
  return menuConfig.filter(item => {
    if (item.requiresAuth && !user) return false

    if (item.hiddenWhenLoggedIn && user) return false

    if (item.roles && (!user || !item.roles.includes(user.role))) return false
    return true
  })
})

async function logout () {
  isLoading.value = true
  await signout()
  isLoading.value = false
}
</script>

<style lang="scss" scoped>
.sidebar__link--active {
  @apply font-bold text-primary-dark fill-primary;
  .menu-icon {
    @apply fill-primary
  }
  &::after {
    content: '';
    @apply block absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-9 bg-primary rounded-full;
  };
}
</style>
