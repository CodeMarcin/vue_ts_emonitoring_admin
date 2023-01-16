<script setup lang="ts">
import TheSiteMenu from "@/components/complex/TheSiteMenu/TheSiteMenu.vue";
import TheSiteMenuMobiel from "@/components/complex/TheSiteMenuMobile/TheSiteMenuMobile.vue";
import TheBreadcrumbs from "@/components/complex/TheBreadcrumbs/TheBreadcrumbs.vue";
import TheSiteFooter from "@/components/complex/TheSiteFooter/TheSiteFooter.vue";
</script>

<template>
  <div class="flex h-full w-full flex-col">
    <TheSiteMenu class="sm:flex" />
    <TheSiteMenuMobiel class="sm:hidden" />
    <TheBreadcrumbs class="mt-14 sm:mt-0" />
    <router-view />

    <TheSiteFooter />
  </div>
</template>
