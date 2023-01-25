<script setup lang="ts"></script>

<template>
  <div class="flex w-full justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" overflow="visible" fill="#000000">
      <defs><circle id="inline" cx="20" cy="50" r="6"></circle></defs>
      <use xlink:href="#inline" x="0">
        <animate attributeName="opacity" values="0;1;0" dur="1s" begin="0s" repeatCount="indefinite"></animate>
        <animateTransform
          attributeName="transform"
          type="translate"
          additive="sum"
          dur="1s"
          begin="0s"
          repeatCount="indefinite"
          from="0 0"
          to="10"
        ></animateTransform>
      </use>
      <use xlink:href="#inline" x="20">
        <animate attributeName="opacity" values="0;1;0" dur="1s" begin="0.25s" repeatCount="indefinite"></animate>
        <animateTransform
          attributeName="transform"
          type="translate"
          additive="sum"
          dur="1s"
          begin="0.25s"
          repeatCount="indefinite"
          from="0 0"
          to="10"
        ></animateTransform>
      </use>
      <use xlink:href="#inline" x="40">
        <animate attributeName="opacity" values="0;1;0" dur="1s" begin="0.5s" repeatCount="indefinite"></animate>
        <animateTransform
          attributeName="transform"
          type="translate"
          additive="sum"
          dur="1s"
          begin="0.5s"
          repeatCount="indefinite"
          from="0 0"
          to="10"
        ></animateTransform>
      </use>
      <use xlink:href="#inline" x="60">
        <animate attributeName="opacity" values="0;1;0" dur="1s" begin="0.75s" repeatCount="indefinite"></animate>
        <animateTransform
          attributeName="transform"
          type="translate"
          additive="sum"
          dur="1s"
          begin="0.75s"
          repeatCount="indefinite"
          from="0 0"
          to="10"
        ></animateTransform>
      </use>
    </svg>
  </div>
</template>
