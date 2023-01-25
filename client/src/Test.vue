<script setup lang="ts">
import { COLLECTION__CONTRACTORS } from "./firebase";
import { getDocs } from "@firebase/firestore";

const test = await getDocs(COLLECTION__CONTRACTORS);
test.forEach((el) => console.log(el.data()))
// console.log(test.docs);
</script>
<template>
  <div></div>
</template>
