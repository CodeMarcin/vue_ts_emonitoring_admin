<script setup lang="ts">
import { computed } from "@vue/reactivity";

export interface Button {
  type?: "basic" | "outline";
  color?: "primary" | "secondary";
  label: string;
  icon?: string;
  iconPosition?: "start" | "end";
}

const props = withDefaults(defineProps<Button>(), {
  type: "basic",
  color: "primary",
});

const buttonClass = computed(() => {
  let className: string;
  if (props.type === "basic") {
    className = props.color === "primary" ? "bg-primary-700 disabled:bg-primary-400 " : "bg-secondary-700 ";
    className += "text-white";
  } else {
    className = "bg-white border text-gray-800";
  }

  return className;
});
</script>

<template>
  <button :class="[buttonClass, ' button']">
    <i v-if="props.icon && props.iconPosition === 'start'" :class="[props.icon, 'text-lg font-semibold']"></i>
    <span>{{ label }}</span>
    <i v-if="props.icon && props.iconPosition === 'end'" :class="[props.icon, 'text-lg font-semibold']"></i>
  </button>
</template>
