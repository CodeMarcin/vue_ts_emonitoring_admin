import { createRouter, createWebHistory } from "vue-router";

import LABELS from "@/data/labels/LabelsTheSiteMenu";
import { getAuth, onAuthStateChanged } from "@firebase/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/layouts/login/View.vue"),
      children: [
        {
          path: "",
          name: "LoginPanel",
          component: () => import(/* webpackChunkName: "loginpanel" */ "@/views/Login.vue"),
        },
      ],
    },
    {
      path: "/logout",
      name: "logout",
      component: () => import("@/layouts/login/View.vue"),
      children: [
        {
          path: "",
          name: "Logout",
          component: () => import(/* webpackChunkName: "logout" */ "@/views/Logout.vue"),
        },
      ],
    },
    {
      path: "/",
      name: "home",
      component: () => import("@/layouts/default/View.vue"),
      meta: {
        requiresAuth: true,
      },
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
      meta: {
        requiresAuth: true,
      },
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
    {
      path: "/invoices",
      name: "invoices",
      props: { label: LABELS.INVOICES },
      meta: {
        requiresAuth: true,
      },
      component: () => import("@/layouts/default/View.vue"),
      children: [
        {
          path: "add",
          name: "invoiceAdd",
          props: { label: LABELS.ADD_INVOICE },
          component: () => import(/* webpackChunkName: "invoiceadd" */ "@/views/InvoiceAdd.vue"),
        },
        {
          path: "site",
          name: "siteSettings",
          props: { label: LABELS.ALL_INVOICES },
          component: () => import(/* webpackChunkName: "companysettings" */ "@/views/SettingsSite.vue"),
        },
      ],
    },
    {
      path: "/settings",
      name: "settings",
      props: { label: LABELS.SETTINGS },
      meta: {
        requiresAuth: true,
      },
      component: () => import("@/layouts/default/View.vue"),
      children: [
        {
          path: "company",
          name: "companySettings",
          props: { label: LABELS.COMPANY_SETTINGS },
          component: () => import(/* webpackChunkName: "companysettings" */ "@/views/SettingsCompany.vue"),
        },
        {
          path: "site",
          name: "siteSettings",
          props: { label: LABELS.COMPANY_SETTINGS },
          component: () => import(/* webpackChunkName: "companysettings" */ "@/views/SettingsSite.vue"),
        },
      ],
    },
  ],
});

const getCurrentUser = async () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

router.beforeEach(async(to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
