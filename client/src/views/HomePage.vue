<script setup lang="ts">
import TheServersStatus from "@/components/complex/TheServersStatus/TheServersStatus.vue";
import Panel from "@/components/parts/Panel/Panel.vue";
</script>

<template>
  <div class="container mx-auto flex flex-col px-2">
    <TheServersStatus />
    <br/>
    <Panel>
      <template #header>asdasd</template>
      <template #content>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</template>
    </Panel>
  </div>
</template>
