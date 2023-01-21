<script setup lang="ts">
import TheContractorsAll from "@/components/complex/TheContractorsAll/TheContractorsAll.vue";
import LoaderList from "@/loaders/LoaderList.vue";

</script>
<template>
  <div class="container mx-auto flex flex-col px-2">
    <Suspense>
      <TheContractorsAll />
      <template #fallback>
        <LoaderList />
      </template>
    </Suspense>
  </div>
</template>
