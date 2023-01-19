<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useToggleBodyScroll } from "@/use/useToggleBodyScroll";

interface Modal {
  showClosIcon?: boolean;
  closeModalFnc?(): void;
}

const props = withDefaults(defineProps<Modal>(), {
  showClosIcon: true,
});

onMounted(() => {
  useToggleBodyScroll(true);
});
onUnmounted(() => {
  useToggleBodyScroll(false);
});
</script>

<template>
  <Teleport to="#app">
    <div class="fixed top-0 left-0 z-50 h-screen min-h-screen w-screen gap-y-10 backdrop-blur-sm">
      <div class="absolute top-1/2 left-1/2 flex w-11/12 max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col rounded-md border bg-white p-4 shadow-lg md:w-1/2">
        <div class="relative flex flex-col gap-y-2">
          <div class="absolute right-0" v-if="props.showClosIcon"><i class="ri-close-line cursor-pointer text-2xl" @click="props.closeModalFnc"></i></div>
          <div class="flex w-full justify-center text-4xl">
            <slot name="icon"> </slot>
          </div>
          <div class="flex w-full justify-center text-sm text-gray-600">
            <slot name="content"></slot>
          </div>
          <slot name="bottom"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>
