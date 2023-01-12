<script setup lang="ts">
import TheSiteMenuItem from "./TheSiteMenuItem.vue";

import { OBJECT__SITE_MENU } from "@/data/objects/ObjectsTheSiteMenu";
</script>

<template>
  <div class="container mx-auto hidden w-full items-center gap-x-4 p-2">
    <div v-for="item in OBJECT__SITE_MENU" class="flex w-fit font-semibold" :key="item.id">
      <router-link v-if="item.path" :to="item.path" class="rounded px-2 py-1 transition-colors duration-500 hover:bg-gray-100">
        <i :class="[item.icon, 'text-2xl']"></i>
      </router-link>

      <TheSiteMenuItem v-else="item.items" :id="item.id" :label="item.label!" :icon="item.icon" :items="item.items" />
    </div>
  </div>
</template>

<style scoped></style>
