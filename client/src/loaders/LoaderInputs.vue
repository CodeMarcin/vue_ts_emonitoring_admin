<script setup lang="ts">
import { reactive, onBeforeMount } from "vue";

const props = withDefaults(defineProps<{ arrLength?: number }>(), {
  arrLength: 5,
});

const lengthArr = reactive([]);

onBeforeMount(() => {
  lengthArr.length = props.arrLength;
});
</script>

<template>
  <div role="status" class="flex animate-pulse flex-col gap-y-5">
    <div v-for="item in arrLength" class="flex w-full gap-x-10">
      <div class="flex w-1/2">
        <div class="mb-2.5 flex h-2.5 w-full rounded-full bg-gray-300"></div>
      </div>
      <div class="flex w-1/2">
        <div class="mb-2.5 flex h-2.5 w-full rounded-full bg-gray-300"></div>
      </div>
    </div>
  </div>
</template>
