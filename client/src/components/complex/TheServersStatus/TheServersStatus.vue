<script setup lang="ts">
import { onMounted, reactive } from "vue";
import axios, { type AxiosResponse } from "axios";

import type { BadgeType } from "@/components/parts/Badge/Badge.vue";

import Card from "@/components/parts/Card/Card.vue";
import Badge from "@/components/parts/Badge/Badge.vue";
import Spinner from "@/components/parts/Spinner/Spinner.vue";

import { OBJECT__SERVERS_STATUS, type TypeStatus } from "@/data/objects/ObjectsTheServersStatus";

import { LOADING, ONLINE, OFFLINE } from "@/data/labels/LabelsGlobal";

const servers = reactive(OBJECT__SERVERS_STATUS);

const setServersStatus = async () => {
  const parseResponse = (response: string, type: "status" | "badge"): BadgeType | TypeStatus => {
    if (type === "status") return response === "fulfilled" ? ONLINE : OFFLINE;
    return response === "fulfilled" ? "success" : "error";
  };

  const serverStatus: Promise<AxiosResponse>[] = [];
  servers.forEach((el) => serverStatus.push(axios.get(el.link)));

  try {
    (await Promise.allSettled([...serverStatus])).forEach((el, index) => {
      servers[index].status = parseResponse(el.status, "status") as TypeStatus;
      servers[index].badgeType = parseResponse(el.status, "badge") as BadgeType;
    });
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => setServersStatus());
</script>
<template>
  <div class="flex flex-wrap justify-center gap-10 sm:justify-between">
    <Card v-for="server in servers" :key="server.id" class="w-2/3 sm:flex-1">
      <template #header>
        <div class="flex w-full justify-center"><i :class="[server.icon, 'text-4xl']"></i></div>
      </template>
      <template #content>
        <div class="flex justify-center text-center text-xs font-semibold">{{ server.label }}</div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <Spinner v-if="server.status === LOADING" size="sm" />
          <Badge v-else :type="server.badgeType" border><i :class="server.icon"></i> {{ server.status }}</Badge>
        </div>
      </template>
    </Card>
  </div>
</template>
