<script setup lang="ts">
import TheServersStatus from "@/components/complex/TheServersStatus/TheServersStatus.vue";
import TheChangeList from "@/components/complex/TheChangeList/TheChangeList.vue";
import Panel from "@/components/parts/Panel/Panel.vue";
</script>

<template>
  <div class="container mx-auto flex flex-col px-2 gap-y-6">
    <TheServersStatus />
    <TheChangeList />


  </div>
</template>
