import { uuid } from "vue-uuid";
import LABELS from "../labels/LabelsTheSiteMenu";

interface Basic {
  id: string;
  label?: (typeof LABELS)[keyof typeof LABELS];
  icon: string;
}

interface Path extends Basic {
  path: string;
  items?: never;
}

interface Items extends Basic {
  items: Finally[];
  path?: never;
}

export type Finally = Path | Items;

export const OBJECT__SITE_MENU: Finally[] = [
  {
    id: uuid.v4(),
    icon: "ri-home-8-fill",
    path: "/",
  },
  {
    id: uuid.v4(),
    label: LABELS.CONTRACTORS,
    icon: "ri-user-line",
    items: [
      {
        id: uuid.v4(),
        label: LABELS.INFO,
        icon: "ri-information-line",
        path: "/contractors",
      },
      {
        id: uuid.v4(),
        label: LABELS.ALL_CONTRACTORS,
        icon: "ri-user-line",
        path: "/contractors/all",
      },
      {
        id: uuid.v4(),
        label: LABELS.ADD_CONTRACTOR,
        icon: "ri-user-add-line",
        path: "/contractors/add",
      },
    ],
  },
  {
    id: uuid.v4(),
    label: LABELS.INVOICES,
    icon: "ri-file-text-line",
    items: [
      {
        id: uuid.v4(),
        label: LABELS.INFO,
        icon: "ri-information-line",
        path: "/invoices/info",
      },
      {
        id: uuid.v4(),
        label: LABELS.ALL_INVOICES,
        icon: "ri-file-copy-2-line",
        path: "/invoices/all",
      },
      {
        id: uuid.v4(),
        label: LABELS.ADD_INVOICE,
        icon: "ri-file-add-line",
        path: "/invoices/add",
      },
    ],
  },
  // {
  //   id: uuid.v4(),
  //   label: LABELS.OFFERTS,
  //   icon: "ri-slideshow-line",
  //   items: [
  //     {
  //       id: uuid.v4(),
  //       label: LABELS.INFO,
  //       icon: "ri-information-line",
  //       path: "/offerts/info",
  //     },
  //     {
  //       id: uuid.v4(),
  //       label: LABELS.ALL_OFFERTS,
  //       icon: "ri-stack-line",
  //       path: "/offerts/all",
  //     },
  //     {
  //       id: uuid.v4(),
  //       label: LABELS.ADD_OFFERT,
  //       icon: "ri-file-add-line",
  //       path: "/offerts/add",
  //     },
  //   ],
  // },
  {
    id: uuid.v4(),
    label: LABELS.SETTINGS,
    icon: "ri-settings-line",
    items: [
      {
        id: uuid.v4(),
        label: LABELS.INVOICE_SETTINGS,
        icon: "ri-file-list-line",
        path: "/settings/invoice",
      },
      {
        id: uuid.v4(),
        label: LABELS.PAYMENT_SETTINGS,
        icon: "ri-money-dollar-circle-line",
        path: "/settings/payment",
      },
      {
        id: uuid.v4(),
        label: LABELS.COMPANY_SETTINGS,
        icon: "ri-building-2-line",
        path: "/settings/company",
      },
      {
        id: uuid.v4(),
        label: LABELS.SITE_SETTINGS,
        icon: "ri-equalizer-line",
        path: "/settings/site",
      },
      {
        id: uuid.v4(),
        label: LABELS.LOGOUT,
        icon: "ri-login-circle-line",
        path: "/logout",
      },
    ],
  },
];
