<script setup lang="ts"></script>
<template>
  <div class="panel">
    <div class="flex items-center rounded-t-lg border bg-gray-50 px-4 py-4">
      <div class="text-xs font-semibold">
        <slot name="header"> </slot>
      </div>
    </div>
    <div class="text-secondary-500 flex rounded-b-lg border-x border-b p-5 text-sm">
      <slot name="content"> </slot>
    </div>
  </div>
</template>
