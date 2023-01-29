import type { InterfaceInput } from "@/components/parts/Input/Input.vue";
import { customValidationMinLength, customValidationRequired, customValidationIsNipExist, customValidationEmail } from "@/validations/customValidations";
import { uuid } from "vue-uuid";
import {
  ACCOUNTAT_EMAIL,
  ACCOUNT_NUMBER,
  ADDRESS,
  BANK_NAME,
  CITY,
  DATE_OF_ISSUE,
  DATE_OF_PAYMENT,
  DAYS_OF_PAYMENT,
  EMAIL,
  INVOICE_NUMBER,
  INVOICE_YEAR,
  MAIL_HOST,
  MAIL_LOGIN,
  MAIL_PASSWORD,
  MAIL_PORT,
  NAME,
  NIP,
  PHONE_NUMBER,
  PLACE_OF_ISSUE,
  PRICE,
  QUANTITY,
  SITE,
  ZIP_CODE,
} from "../labels/LabelsGlobal";

export const OBJECT__INPUT_CONTRACTOR: InterfaceInput[] = [
  {
    id: uuid.v4(),
    label: NAME,
    name: "name",
    validateRules: { required: customValidationRequired() },
  },
  {
    id: uuid.v4(),
    label: ADDRESS,
    name: "address",
    validateRules: { required: customValidationRequired() },
  },
  {
    id: uuid.v4(),
    label: ZIP_CODE,
    mask: "##-###",
    inputMode: "numeric",
    name: "zipcode",
    validateRules: {
      required: customValidationRequired(),
      minLength: customValidationMinLength(6, 1),
    },
  },
  {
    id: uuid.v4(),
    label: CITY,
    name: "city",
    mask: "A",
    maskToken: "A:[A-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ ]:repeated",
    validateRules: { required: customValidationRequired() },
  },
  {
    id: uuid.v4(),
    label: NIP,
    inputMode: "numeric",
    mask: "###-###-##-##",
    name: "nip",
    validateRules: { required: customValidationRequired(), minLength: customValidationMinLength(13, 3) },
  },
  {
    id: uuid.v4(),
    type: "email",
    label: EMAIL,
    name: "email",
    validateRules: { email: customValidationEmail() },
  },
];

export const OBJECT__INPUT_COMPANY: InterfaceInput[] = [
  {
    id: uuid.v4(),
    label: NAME,
    name: "name",
    validateRules: { required: customValidationRequired() },
  },
  {
    id: uuid.v4(),
    label: ADDRESS,
    name: "address",
    validateRules: { required: customValidationRequired() },
  },
  {
    id: uuid.v4(),
    label: CITY,
    name: "city",
    mask: "A",
    maskToken: "A:[A-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ ]:repeated",
    validateRules: { required: customValidationRequired() },
  },
  {
    id: uuid.v4(),
    label: ZIP_CODE,
    name: "zipcode",
    mask: "##-###",
    validateRules: { required: customValidationRequired(), minLength: customValidationMinLength(6, 1) },
  },
  {
    id: uuid.v4(),
    label: NIP,
    name: "nip",
    mask: "###-###-##-##",
    validateRules: { required: customValidationRequired(), minLength: customValidationMinLength(13, 3) },
  },
  {
    id: uuid.v4(),
    label: EMAIL,
    type: "email",
    name: "email",
    validateRules: { email: customValidationEmail() },
  },
  {
    id: uuid.v4(),
    label: PHONE_NUMBER,
    name: "phoneNumber",
    mask: "### ### ###",
  },
  {
    id: uuid.v4(),
    label: SITE,
    name: "siteAddress",
  },
];

export const OBJECT__INPUT_INVOICE_SETTINGS: InterfaceInput[] = [
  {
    id: uuid.v4(),
    label: INVOICE_NUMBER,
    name: "invoiceNumber",
    inputMode: "numeric",
    type: "number",
    mask: "A",
    maskToken: "A:[0-9]:repeated",
    validateRules: { required: customValidationRequired() },
  },
  {
    id: uuid.v4(),
    label: INVOICE_YEAR,
    name: "invoiceYear",
    inputMode: "numeric",
    type: "number",
    mask: "A",
    maskToken: "A:[0-9]:repeated",
    validateRules: { required: customValidationRequired(), minLength: customValidationMinLength(4, 0) },
  },
  {
    id: uuid.v4(),
    label: PLACE_OF_ISSUE,
    name: "placeOfIssue",
    inputMode: "text",
    mask: "A",
    maskToken: "A:[A-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ ]:repeated",
    validateRules: { required: customValidationRequired() },
  },
  {
    id: uuid.v4(),
    label: DATE_OF_ISSUE,
    name: "dateOfIssue",
    inputMode: "numeric",
    type: "date",
    handleType: "change",
    validateRules: { required: customValidationRequired() },
  },
];

export const OBJECT__INPUT_INVOICE_SETTINGS_FOR_EDIT: InterfaceInput[] = [...OBJECT__INPUT_INVOICE_SETTINGS.filter((el) => el.name !== "dateOfIssue")];

export const OBJECT__INPUT_PAYMENT_SETTINGS = <InterfaceInput[]>[
  {
    id: uuid.v4(),
    label: ACCOUNT_NUMBER,
    name: "accountNumber",
    mask: "## #### #### #### #### #### ####",
    validateRules: { required: customValidationRequired(), minLength: customValidationMinLength(26, 6) },
  },
  {
    id: uuid.v4(),
    label: BANK_NAME,
    name: "bankName",
    validateRules: { required: customValidationRequired() },
  },
  {
    id: uuid.v4(),
    label: DAYS_OF_PAYMENT,
    name: "daysOfPayment",
    type: "number",
    mask: "A",
    maskToken: "A:[0-9]:repeated",
    validateRules: { required: customValidationRequired() },
  },
];

export const OBJECT__INPUT_PAYMENT_SETTINGS_FOR_EDIT: InterfaceInput[] = [...OBJECT__INPUT_PAYMENT_SETTINGS.filter((el) => el.name !== "daysOfPayment")];

export const OBJECT__INPUT_SITE_SETTINGS = <InterfaceInput[]>[
  {
    id: uuid.v4(),
    label: ACCOUNTAT_EMAIL,
    name: "accountantEmail",
  },
  {
    id: uuid.v4(),
    label: MAIL_HOST,
    name: "mailHost",
  },
  {
    id: uuid.v4(),
    label: MAIL_PORT,
    name: "mailPort",
    type: "number",
    mask: "###",
    validateRules: { minLength: customValidationMinLength(3, 0) },
  },
  {
    id: uuid.v4(),
    label: MAIL_LOGIN,
    name: "mailUser",
  },
  {
    id: uuid.v4(),
    label: MAIL_PASSWORD,
    name: "mailPassword",
    type: "password",
  },
];

export const OBJECT__INPUT_ITEM: InterfaceInput[][] = [
  [
    {
      id: uuid.v4(),
      label: NAME,
      name: "name",
      validateRules: { required: customValidationRequired() },
    },
    {
      id: uuid.v4(),
      label: QUANTITY,
      name: "quantity",
      inputMode: "numeric",
      type: "text",
      mask: "A",
      maskToken: "A:[0-9.]:repeated",
      validateRules: { required: customValidationRequired() },
    },
    {
      id: uuid.v4(),
      label: PRICE,
      name: "price",
      inputMode: "numeric",
      type: "text",
      mask: "A",
      maskToken: "A:[0-9.]:repeated",
      validateRules: { required: customValidationRequired() },
    },
  ],
];
