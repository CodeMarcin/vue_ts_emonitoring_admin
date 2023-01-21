<script setup lang="ts">
import TheSettingsCompany from '@/components/complex/TheSettings/TheSettingsCompany.vue';
import LoaderInputs from '@/loaders/LoaderInputs.vue';
</script>

<template>
    <div class="container mx-auto flex flex-col px-2">
    <Suspense>
  <TheSettingsCompany />

      <template #fallback>
      <LoaderInputs />
      </template>
    </Suspense>

      
    </div>
</template>


