<template>
  <div class="flex gap-5">
    <div class="m-5">
      <p class="text-primary font-bold">Element Plus:</p>
      <UIElementExample />
    </div>
    <UITailwindSetup />
  </div>
</template>

<script setup lang="ts">
import UIElementExample from './components/UIElementExample.vue'
import UITailwindSetup from './components/UITailwindSetup.vue';
</script>
