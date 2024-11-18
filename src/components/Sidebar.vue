<template>
  <aside class="h-auto min-h-screen bg-white flex flex-col z-50 min-w-[310px] max-w-[310px]">
    <a href="/" class="pt-14 pb-12 font-poppins text-[26px] text-center border-b">
      <b>CALORIE</b> MATE
    </a>
    <ul class="flex flex-col gap-6 flex-1 pl-5 pt-10">
      <li
        v-for="item in filteredMenuList"
        :key="item.routeName"
        class="font-medium leading-[30px] w-full text-gray-light
              hover:font-medium hover:text-primary-dark relative"
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
    <div v-if="user" class="px-5 py-5 flex flex-col w-full">
      <el-button :loading="isLoading" @click="logout">Logout</el-button>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import IconHome from '~icons/icon/home'
import IconProfile from '~icons/icon/profile'
import IconSignIn from '~icons/icon/sign-in'
import IconRecipesAndProducts from '~icons/icon/recipes-and-products'
import IconHealthAndNutrition from '~icons/icon/health-and-nutrition'
import IconApprove from '~icons/icon/approve'
import IconAboutUs from '~icons/icon/about-us'

import type { ERoles } from '@/views/auth/auth.enums'

const authStore = useAuthStore()
const { signout, user } = useAuthStore()

const recipesAndProductsTitle = computed(() => {
  return authStore.isUserAdmin ? 'Recipes and Products' : 'My Recipes and Products'
})

const isLoading = ref(false)

interface ISidebarMenuItem {
  label: string
  routeName: string
  icon: Component
  requiresAuth?: boolean
  roles?: keyof typeof ERoles
  hiddenWhenLoggedIn?: boolean
}

const menuConfig: ISidebarMenuItem[] = [
  {
    label: 'Dashboard',
    routeName: 'dashboard',
    icon: IconHome,
    requiresAuth: true
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
    label: recipesAndProductsTitle.value,
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
