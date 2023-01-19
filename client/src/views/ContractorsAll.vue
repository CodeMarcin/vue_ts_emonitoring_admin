<script setup lang="ts">
import TheContractorsAll from "@/components/complex/TheContractorsAll/TheContractorsAll.vue";
import LoaderAllContractors from "@/loaders/LoaderAllContractors.vue";
</script>
<template>
  <div class="container mx-auto flex flex-col px-2">
    <Suspense>
      <TheContractorsAll />

      <template #fallback>
        <LoaderAllContractors />
      </template>
    </Suspense>
  </div>
</template>
