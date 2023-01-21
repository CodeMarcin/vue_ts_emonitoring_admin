<script setup lang="ts">
import TheSiteSettings from "@/components/complex/TheSettings/TheSettingsSite.vue";
import LoaderInputs from "@/loaders/LoaderInputs.vue";
</script>

<template>
  <div class="container mx-auto flex flex-col px-2">
    <Suspense>
      <TheSiteSettings />

      <template #fallback>
        <LoaderInputs />
      </template>
    </Suspense>
  </div>
</template>
