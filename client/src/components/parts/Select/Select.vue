<script setup lang="ts">
import { computed } from "vue";
export interface SelectInterface {
  name?: string;
  selected?: string;
  options?: {
    value?: string;
    label?: string;
  }[];
}

export type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
};

const props = defineProps<SelectInterface>();

const emit = defineEmits(["handleChange"]);

const handleChange = computed(() => (e: HTMLElementEvent<HTMLSelectElement>) => {
  emit("handleChange", e.target.value);
});
</script>

<template>
  <select
    :id="props.name"
    :name="props.name"
    class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
    @change="(e) => handleChange(e as HTMLElementEvent<HTMLSelectElement>)"
  >
    <option v-for="option in options" :key="option.value" :selected="props.selected === option.value" :value="option.value">{{ option.label }}</option>
  </select>
</template>
