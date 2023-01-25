<script setup lang="ts">
import TheInvoiceAdd from "@/components/complex/TheInvoiceAdd/TheInvoiceAdd.vue";
import LoaderList from "@/loaders/LoaderList.vue";
</script>
<template>
  <div class="container mx-auto flex flex-col px-2 overflow-hidden">
    <Suspense>
      <TheInvoiceAdd />
      <template #fallback>
        <LoaderList />
      </template>
    </Suspense>
  </div>
</template>
