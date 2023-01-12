<script setup lang="ts">
import { ref, watchEffect, watch, computed } from "vue";
import type { Finally } from "@/data/objects/ObjectsTheSiteMenu";

interface Props {
  id: string;
  label: string;
  icon: string;
  isMenuDisplayed: boolean;
  items: Finally[] | undefined;
}

const props = defineProps<Props>();
const showSubMenu = ref(false);

const emit = defineEmits(["handleClick"]);

const toggleSubMenu = () => (showSubMenu.value = !showSubMenu.value);

const emitClick = () => {
  emit("handleClick");
};

watchEffect(() => {
  if (props.isMenuDisplayed) showSubMenu.value = false;
});

const activeIconClass = computed(() => (showSubMenu.value ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"));
</script>

<template>
  <div class="text-md flex items-center gap-x-1 font-medium text-stone-900" @click="toggleSubMenu">
    <i :class="[icon, 'text-2xl']"></i>
    {{ label }}
    <i :class="[activeIconClass, 'text-lg font-bold']"></i>
  </div>
  <router-link v-show="showSubMenu" v-for="subItem in items" :to="subItem.path!" class="ml-6 flex items-center gap-x-4 font-medium" @click="emitClick">
    <i :class="[subItem.icon, 'text-2xl text-purple-800']"></i>
    {{ subItem.label }}
  </router-link>
</template>
