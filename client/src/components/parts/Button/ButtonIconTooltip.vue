<script setup lang="ts">
import { computed, defineEmits } from "vue";
export interface ButtonTooltip {
  id?: string;
  action?: string;
  showTooltip?: boolean;
  type?: "basic" | "outline";
  color?: "primary" | "secondary" | "error";
  icon?: string;
}

const props = withDefaults(defineProps<ButtonTooltip>(), {
  type: "basic",
  color: "primary",
});

const emit = defineEmits(["handleClick"]);

const handleClick = () => {
  if (props.id) emit("handleClick", [props.action, props.id]);
  else emit("handleClick");
};

const buttonClass = computed(() => {
  let className: string;
  if (props.type === "basic") {
    className =
      props.color === "primary" ? "bg-primary-700 disabled:bg-primary-400 " : props.color === "secondary" ? "bg-secondary-700 " : "bg-error-700 border-0 ";
    className += "text-white ";
  } else {
    className = "bg-white border text-gray-800";
  }

  return className;
});
</script>
<template>
  <button @click="handleClick" :class="[buttonClass, 'button-icon-tooltip']"><i :class="props.icon"></i></button>
</template>
