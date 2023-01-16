import { createRouter, createWebHistory } from "vue-router";

import LABELS from "@/data/labels/LabelsTheSiteMenu";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/layouts/default/View.vue"),
      children: [
        {
          path: "",
          name: "HomePage",
          component: () => import(/* webpackChunkName: "homepage" */ "@/views/HomePage.vue"),
        },
      ],
    },
    {
      path: "/contractors",
      name: "contractors",
      props: { label: LABELS.CONTRACTORS },

      component: () => import("@/layouts/default/View.vue"),
      children: [
        {
          path: "",
          name: "ContractorsInfo",
          props: { label: LABELS.CONTRACTORS },
          component: () => import(/* webpackChunkName: "contractorsinfo" */ "@/views/ContratorsInfo.vue"),
        },
        {
          path: "all",
          name: "ContractorsAll",
          props: { label: LABELS.ALL_CONTRACTORS },
          component: () => import(/* webpackChunkName: "contractorsall" */ "@/views/ContractorsAll.vue"),
        },
        {
          path: "add",
          name: "ContractorAdd",
          props: { label: LABELS.ADD_CONTRACTOR },
          component: () => import(/* webpackChunkName: "contractoradd" */ "@/views/ContractorAdd.vue"),
        },
      ],
    },
  ],
});

export default router;
