<script setup lang="ts">
import TheSiteMenu from "@/components/complex/TheSiteMenu/TheSiteMenu.vue";
import TheSiteMenuMobiel from "@/components/complex/TheSiteMenuMobile/TheSiteMenuMobile.vue";
import TheSiteFooter from "@/components/complex/TheSiteFooter/TheSiteFooter.vue";
import Toast from "@/components/parts/Toast/Toast.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <div class="flex h-full w-full flex-col">
    <TheSiteMenu class="sm:flex" />
    <TheSiteMenuMobiel class="sm:hidden" />
    <router-view class="mt-20 sm:mt-10" :key="route.path" />
    <TheSiteFooter class="mt-10" />
    <Toast />
  </div>
</template>
