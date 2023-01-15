<script setup lang="ts">
import { defineEmits, computed } from "vue";

export type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
};

interface Checkbox {
  checked?: boolean;
}

const props = withDefaults(defineProps<Checkbox>(), {
  checked: true,
});

const emit = defineEmits(["handleChange"]);

const handleChange = computed(() => (e: HTMLElementEvent<HTMLInputElement>) => {
  emit("handleChange", e.target.checked);
});
</script>
<template>
  <label class="relative inline-flex cursor-pointer items-center">
    <input type="checkbox" class="peer sr-only" :checked="props.checked" @change="(e) => handleChange(e as HTMLElementEvent<HTMLInputElement>)" />
    <div class="checkbox peer"></div>
  </label>
</template>
