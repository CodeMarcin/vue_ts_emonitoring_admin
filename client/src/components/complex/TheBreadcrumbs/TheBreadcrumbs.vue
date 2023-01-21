<script setup lang="ts">
import { reactive, ref, computed, watch, watchEffect, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { RouteLocationMatched } from "vue-router";

interface Breadcrumbs {
  id: number;
  path: string;
  label: string;
}

interface RouterExtends extends RouteLocationMatched {
  props: { default: { label: string } };
}

const route = useRoute();

const breadCrumbs = reactive<Breadcrumbs[]>([]);

const createBreadcrumbs = () => {
  breadCrumbs.length = 0;
  (route.matched as RouterExtends[]).forEach((el, index) => {
    if (!breadCrumbs.some((bc) => bc.path === el.path)) breadCrumbs.push({ id: index, path: el.path, label: el.props.default.label });
  });
};
watch(
  route,
  () => {
    createBreadcrumbs();
  },
  { immediate: true }
);
</script>

<template>
  <div class="container mx-auto flex w-full p-2">
    <div class="flex w-full py-2 text-sm font-medium text-gray-700">
      <router-link to="/" v-if="breadCrumbs[0].path !== '/'" class="hover:text-primary-700 text-gray-700"><i class="ri-home-8-fill"></i></router-link>
      <span v-else><i class="ri-home-8-fill"></i></span>
      <i v-if="breadCrumbs[0].path !== '/'" class="ri-arrow-right-s-line"></i>
      <div class="flex items-center" v-for="item in breadCrumbs" :key="item.id">
        <router-link :to="item.path" v-if="item.id !== breadCrumbs.length - 1" class="hover:text-primary-700 text-gray-700">{{ item.label }} </router-link>
        <span v-else>{{ item.label }}</span>
        <i v-if="item.id !== breadCrumbs.length - 1" class="ri-arrow-right-s-line"></i>
      </div>
    </div>
  </div>
</template>
