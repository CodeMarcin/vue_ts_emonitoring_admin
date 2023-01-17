<script setup lang="ts">
import { computed } from "@vue/reactivity";
import Spinner from "../Spinner/Spinner.vue";

export interface Button {
  type?: "basic" | "outline";
  color?: "primary" | "secondary";
  label: string;
  icon?: string;
  iconPosition?: "start" | "end";
  isLoading?: boolean;
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

const emit = defineEmits(["handleClick"]);

const handleClick = () => {
  emit("handleClick");
};
</script>

<template>
  <button :class="[buttonClass, ' button']" @click="handleClick" :disabled="props.isLoading">
    <Spinner v-if="props.isLoading && props.iconPosition === 'start'" />
    <i v-if="props.icon && props.iconPosition === 'start' && !props.isLoading" :class="[props.icon, 'text-lg font-semibold']"></i>
    <span>{{ label }}</span>
    <Spinner v-if="props.isLoading && props.iconPosition === 'end'" />
    <i v-if="props.icon && props.iconPosition === 'end' && !props.isLoading" :class="[props.icon, 'text-lg font-semibold']"></i>
  </button>
</template>
