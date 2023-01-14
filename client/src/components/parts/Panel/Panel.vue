<script setup lang="ts"></script>
<template>
  <div class="panel">
    <div class="bg-secondary-100 flex items-center rounded-t-lg border p-5">
      <div class="text-sm font-semibold">
        <slot name="header"> </slot>
      </div>
    </div>
    <div class="text-secondary-500 flex rounded-b-lg border-x border-b p-5 text-sm">
      <slot name="content"> </slot>
    </div>
  </div>
</template>
