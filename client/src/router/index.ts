import { createRouter, createWebHashHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "@firebase/auth";

const router = createRouter({
  history: createWebHashHistory("/faktury/"),
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
      meta: {
        requiresAuth: true,
      },
      component: () => import("@/layouts/default/View.vue"),
      children: [
        {
          path: "all",
          name: "ContractorsAll",
          component: () => import(/* webpackChunkName: "contractorsall" */ "@/views/ContractorsAll.vue"),
        },
        {
          path: "edit/:id",
          name: "ContractorEdit",
          component: () => import(/* webpackChunkName: "contractorsall" */ "@/views/ContractorAdd.vue"),
        },
        {
          path: "add",
          name: "ContractorAdd",
          component: () => import(/* webpackChunkName: "contractoradd" */ "@/views/ContractorAdd.vue"),
        },
      ],
    },
    {
      path: "/invoices",
      name: "invoices",
      meta: {
        requiresAuth: true,
      },
      component: () => import("@/layouts/default/View.vue"),
      children: [
        {
          path: "add",
          name: "InvoiceAdd",
          component: () => import(/* webpackChunkName: "invoiceadd" */ "@/views/InvoiceAdd.vue"),
        },
        {
          path: "edit/:id",
          name: "InvoiceEdit",
          component: () => import(/* webpackChunkName: "invoiceadd" */ "@/views/InvoiceAdd.vue"),
        },
        {
          path: "all",
          name: "InvoicesAll",
          component: () => import(/* webpackChunkName: "invoicesall" */ "@/views/InvoicesAll.vue"),
        },
      ],
    },
    {
      path: "/settings",
      name: "settings",
      meta: {
        requiresAuth: true,
      },
      component: () => import("@/layouts/default/View.vue"),
      children: [
        {
          path: "invoice",
          name: "invoiceSettings",
          component: () => import(/* webpackChunkName: "invoicesettings" */ "@/views/SettingsInvoice.vue"),
        },
        {
          path: "company",
          name: "companySettings",
          component: () => import(/* webpackChunkName: "companysettings" */ "@/views/SettingsCompany.vue"),
        },
        {
          path: "payment",
          name: "paymmentSettings",
          component: () => import(/* webpackChunkName: "paymentsettings" */ "@/views/SettingsPayment.vue"),
        },
        {
          path: "site",
          name: "siteSettings",
          component: () => import(/* webpackChunkName: "sitesettings" */ "@/views/SettingsSite.vue"),
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
