<script setup lang="ts">
import Panel from "@/components/parts/Panel/Panel.vue";
import { CHANGE_LIST } from "@/data/labels/LabelsGlobal";

export type TChangeListCategory = "Fix" | "Change" | "Other";

export interface IChangeList {
  versionAndDate: string;
  list: {
    category: TChangeListCategory;
    changes: string[];
  }[];
}

const changeList: IChangeList[] = [
  {
    versionAndDate: "v1.0.1 - 2023-01-28",
    list: [
      {
        category: "Fix",
        changes: ["Repair of an error causing the display of a 404 page during refresh"],
      },
      {
        category: "Change",
        changes: ["Change in server status display appearance for sending emails", "Change the appearance of the form for adding/editing clients", "During the contractor edit, you must approve or reject the desire to change data in all of its invoices"],
      },
    ],
  },

];
</script>

<template>
  <div>
    <Panel>
      <template #header>{{ CHANGE_LIST }}</template>
      <template #content>
        <div class="flex w-full flex-col gap-y-4 divide-y-2">
          <ul v-for="changes in changeList" class="pt-2">
            <li>
              <code class="font-extrabold">## {{ changes.versionAndDate }}</code>
            </li>
            <ul v-for="change in changes.list">
              <li class="pl-6 font-black text-black">
                <code>### {{ change.category }}</code>
              </li>
              <li v-for="item in change.changes" class="pl-6">
                <code>-- {{ item }}</code>
              </li>
            </ul>
          </ul>
        </div>
      </template>
    </Panel>
  </div>
</template>
