<script setup lang="ts">
import router from "@/router";
import { getAuth, signOut } from "@firebase/auth";
import { onMounted } from "vue";

onMounted(async () => {
  const auth = getAuth();
  await signOut(auth);
  router.push("/");
});
</script>
<template>
  <div></div>
</template>
