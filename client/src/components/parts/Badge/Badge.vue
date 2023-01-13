<script setup lang="ts">
import { computed } from "vue";

type Type = "primary" | "secondary" | "warning" | "success" | "error";

interface Props {
  type?: Type;
  sizeLarge?: boolean;
  border?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "primary",
  sizeLarge: false,
  border: false,
});

const badgeClass = computed(() => {
  let badgeClass: string;
  switch (props.type) {
    case "primary":
      badgeClass = `bg-primary-100 text-primary-800 ${props.border ? "border-primary-400" : ""} `;
      break;
    case "secondary":
      badgeClass = `bg-secondary-100 text-secondary-800 ${props.border ? "border-secondary-400" : ""} `;
      break;
    case "warning":
      badgeClass = `bg-warning-100 text-warning-800 ${props.border ? "border-warning-400" : ""} `;
      break;
    case "success":
      badgeClass = `bg-success-100 text-success-800 ${props.border ? "border-success-400" : ""} `;
      break;
    case "error":
      badgeClass = `bg-error-100 text-error-800 ${props.border ? "border-error-400" : ""} `;
      break;
  }
  badgeClass += `${props.border ? "border " : ""} `;
  badgeClass += `${props.sizeLarge ? "text-sm" : "text-xs"} `;

  return badgeClass;
});
</script>
<template>
  <span :class="[badgeClass, 'badge']"><slot></slot></span>
</template>
