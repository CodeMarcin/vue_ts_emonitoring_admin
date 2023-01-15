import { createRouter, createWebHistory } from "vue-router";

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
      component: () => import("@/layouts/default/View.vue"),
      children: [
        {
          path: "all",
          name: "ContractorsAll",
          component: () => import(/* webpackChunkName: "contractorsall" */ "@/views/ContractorsAll.vue"),
        },
        {
          path: "add",
          name: "ContractorAdd",
          component: () => import(/* webpackChunkName: "contractoradd" */ "@/views/ContractorAdd.vue"),
        },
      ],
    },
  ],
});

export default router;
