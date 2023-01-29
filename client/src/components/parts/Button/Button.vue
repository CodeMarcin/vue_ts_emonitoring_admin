<script setup lang="ts">
import { ref, computed } from "@vue/reactivity";

import Spinner from "../Spinner/Spinner.vue";

export interface Button {
  id?: string;
  type?: "basic" | "icon" | "tooltip";
  color?: "primary" | "secondary" | "error";
  outline?: boolean;
  label?: string;
  icon?: string;
  iconPosition?: "start" | "end";
  isLoading?: boolean;
  hoverTooltipText?: string;
}

const props = withDefaults(defineProps<Button>(), {
  type: "basic",
  color: "primary",
});

const showTooltip = ref(false);
const showHoverTooltipText = ref(false);

const toggleHoverTooltipText = () => {
  if (props.hoverTooltipText) showHoverTooltipText.value = !showHoverTooltipText.value;
};

const buttonClass = computed(() => {
  let className: string;

  if (!props.outline) {
    if (props.color === "primary") className = "bg-primary-700 text-white disabled:bg-primary-400 ";
    else if (props.color === "secondary") className = "bg-secondary-700 text-white disabled:bg-secondary-400 ";
    else if (props.color === "error") className = "bg-error-700 text-white disabled:bg-error-400 ";
    else className = "";
  } else className = "bg-white border text-gray-800 ";

  if (props.type === "basic") className += "button-basic ";
  else if (props.type === "icon") className += "button-icon ";
  else if (props.type === "tooltip") className += "button-tooltip ";

  return className;
});

const emit = defineEmits(["handleClick"]);

const handleClick = () => {
  if (props.type === "basic" || props.type === "icon") emit("handleClick");
  else if (props.type === "tooltip") showTooltip.value = !showTooltip.value;
};

const closeTooltip = () => {
  if (showTooltip.value) showTooltip.value = !showTooltip.value;
};
</script>

<template>
  <button v-if="props.type === 'basic'" :class="buttonClass" @click="handleClick" @mouseenter="toggleHoverTooltipText" @mouseleave="toggleHoverTooltipText">
    <Spinner v-if="props.isLoading" />
    <i v-if="props.icon && props.iconPosition === 'start' && !props.isLoading" :class="[props.icon, 'text-lg']"></i>
    <span v-if="!props.isLoading">{{ label }}</span>
    <i v-if="props.icon && props.iconPosition === 'end' && !props.isLoading" :class="[props.icon, 'text-lg ']"></i>

    <div
      v-show="showHoverTooltipText"
      class="absolute -top-[150%] -left-[50%] z-10 inline-block min-w-max rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow-sm"
    >
      {{ props.hoverTooltipText }}
    </div>
  </button>

  <button v-else-if="props.type === 'icon'" :class="buttonClass" @click="handleClick" @mouseenter="toggleHoverTooltipText" @mouseleave="toggleHoverTooltipText">
    <Spinner v-if="props.isLoading" />
    <i v-else :class="props.icon"></i>
    <div
      v-show="showHoverTooltipText"
      class="absolute -top-[150%] -left-[50%] z-10 inline-block min-w-max rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow-sm"
    >
      {{ props.hoverTooltipText }}
    </div>
  </button>

  <div v-else-if="props.type === 'tooltip'" class="relative" v-click-away="closeTooltip">
    <button :class="buttonClass" @click="handleClick">
      <i v-if="props.icon && props.iconPosition === 'start' && !props.isLoading" :class="[props.icon, 'text-lg font-semibold']"></i>
      <span v-if="props.label">{{ label }}</span>
      <span v-else-if="!props.label && props.icon"><i :class="props.icon"></i></span>
      <i v-if="props.icon && props.iconPosition === 'end' && !props.isLoading" :class="[props.icon, 'text-lg font-semibold']"></i>
    </button>
    <Transition
      enter-active-class="ease duration-300 transform"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="ease duration-300 transform"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="showTooltip"
        class="absolute top-full right-0 z-30 mt-1 min-w-full cursor-default border border-gray-300 bg-white text-sm shadow-md transition-all"
      >
        <span class="absolute top-0 right-2 -mt-1 h-3 w-3 rotate-45 transform border bg-white" />
        <div class="relative z-10 flex min-w-max flex-col bg-white">
          <slot name="tooltip"></slot>
        </div>
      </div>
    </Transition>
  </div>
</template>
