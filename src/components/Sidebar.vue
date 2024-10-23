<template>
  <aside class="h-screen bg-white">
    <div class="pt-14 pb-12 font-poppins text-[26px] leading-[26px] text-primary-dark text-center border-b">
      <h1 class="font-bold">CALORIE <span class="font-normal">MATE</span></h1>
    </div>
    <div class="pl-9 pt-10">
      <ul class="flex flex-col gap-5">
        <li
          v-for="item in menuList"
          :key="item.routeName"
          class="font-medium leading-[30px] block w-full text-gray-light hover:font-medium hover:text-primary-dark"
        >
          <router-link
            class="w-full block"
            :to="{name:item.routeName}"
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
// add more sidebar menuList options in the Future.
interface ISidebarMenuList {
  label: string
  routeName: string
}

const menuList: ISidebarMenuList[] = []
</script>

<style lang="scss" scoped>
@import '/src/assets/styles/variables/colors';

li {
  position: relative;
}

.sidebar__link--active {
  &::after {
    content: '';
    display: block;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 36px;
    background-color: $primary;
    border-radius: 25px;
  };

  @apply font-bold text-primary-dark;
}
</style>
