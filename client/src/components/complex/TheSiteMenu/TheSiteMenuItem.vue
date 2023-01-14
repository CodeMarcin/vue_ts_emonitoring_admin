<script setup lang="ts">
import { ref, computed } from "vue";
import type { Finally } from "@/data/objects/ObjectsTheSiteMenu";

interface Props {
  id: string;
  label: string;
  icon: string;
  items: Finally[] | undefined;
}

defineProps<Props>();
const showSubMenu = ref(false);

const toggleSubMenu = () => {
  showSubMenu.value = !showSubMenu.value;
};

const closeSubMenu = () => {
  if (showSubMenu.value) showSubMenu.value = false;
};

const activeIconClass = computed(() => (showSubMenu.value ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"));
</script>

<template>
  <div class="relative rounded px-2 py-1 text-sm transition-colors duration-500 hover:bg-gray-100" v-click-away="closeSubMenu">
    <span class="flex cursor-pointer items-center gap-x-2" @click="toggleSubMenu">
      <i :class="[icon, 'text-2xl font-normal']"></i>
      {{ label }}
      <i :class="[activeIconClass, 'text-lg font-bold']"></i>
    </span>
    <Transition
      enter-active-class="ease duration-300 transform"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="ease duration-300 transform"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="showSubMenu"
        class="absolute top-full left-0 z-30 mt-1 w-56 min-w-full cursor-default rounded border border-gray-300 bg-white text-sm shadow-md transition-all"
      >
        <span class="absolute top-0 left-0 -mt-1 ml-6 h-3 w-3 rotate-45 transform border bg-white" />

        <div class="relative z-10 flex min-w-fit flex-col rounded bg-white py-1">
          <router-link
            class="flex cursor-pointer items-center gap-x-2 py-2 pl-3 transition-all duration-500 hover:bg-neutral-100 hover:pl-4"
            v-for="subItem in items"
            :to="subItem.path!"
            @click="closeSubMenu"
          >
            <i v-if="subItem.icon" :class="[subItem.icon, 'text-xl font-medium text-purple-800']" />
            <span v-if="subItem.label" class="text-xs">{{ subItem.label }}</span>
          </router-link>
        </div>
      </div>
    </Transition>
  </div>
</template>
