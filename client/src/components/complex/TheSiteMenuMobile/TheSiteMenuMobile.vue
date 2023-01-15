<script setup lang="ts">
import { ref, computed } from "vue";
import TheSiteMenuMobileItem from "./TheSiteMenuMobileItem.vue";

import { OBJECT__SITE_MENU } from "@/data/objects/ObjectsTheSiteMenu";

const showMobileMenu = ref(false);

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
  if (showMobileMenu.value) document.body.style.overflowY = "hidden";
  else document.body.style.overflowY = "auto";
};

const activeIconClass = computed(() => (showMobileMenu.value ? "ri-close-fill" : "ri-menu-fill"));
const activeContainerClass = computed(() => (showMobileMenu.value ? "h-full" : "shadow-md"));
</script>

<template>
  <div :class="[activeContainerClass, 'container fixed z-20 mx-auto flex w-full bg-white p-2']">
    <i :class="[activeIconClass, 'text-3xl']" @click="toggleMobileMenu"></i>

    <Transition
      enter-active-class="ease duration-300 transform"
      enter-from-class="opacity-0 -translate-x-full"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="ease duration-300 transform"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-full"
    >
      <div
        class="absolute top-12 left-0 z-20 flex h-[calc(100%_-_5rem)] w-full flex-col gap-y-4 overflow-y-scroll border-t-4 border-t-violet-900 bg-white px-2 py-4 sm:hidden"
        v-show="showMobileMenu"
      >
        <div v-for="item in OBJECT__SITE_MENU" class="flex flex-col" :key="item.id">
          <router-link v-if="item.path" :to="item.path" class="text-center" @click="toggleMobileMenu">
            <i :class="[item.icon, 'text-3xl']"></i>
          </router-link>
          <div v-else="item.items" class="flex flex-col gap-y-3 text-sm">
            <TheSiteMenuMobileItem
              :id="item.id"
              :label="item.label!"
              :icon="item.icon"
              :items="item.items"
              :is-menu-displayed="showMobileMenu"
              @handle-click="toggleMobileMenu"
            />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
