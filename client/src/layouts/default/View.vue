<script setup lang="ts">
import TheSiteMenu from "@/components/complex/TheSiteMenu/TheSiteMenu.vue";
import TheSiteMenuMobiel from "@/components/complex/TheSiteMenuMobile/TheSiteMenuMobile.vue";
import TheSiteFooter from "@/components/complex/TheSiteFooter/TheSiteFooter.vue";
</script>

<template>
  <div class="flex h-full w-full flex-col">
    <TheSiteMenu class="sm:flex" />
    <TheSiteMenuMobiel class="sm:hidden" />

    <router-view class="mt-14 sm:mt-8" />

    <TheSiteFooter />
  </div>
</template>
