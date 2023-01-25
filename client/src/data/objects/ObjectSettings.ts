import type { InterfaceInput } from "@/components/parts/Input/Input.vue";
import { customValidationEmail, customValidationMinLength, customValidationRequired } from "@/validations/customValidations";
import { uuid } from "vue-uuid";
import {
  ACCOUNT_NUMBER,
  ADDRESS,
  BANK_NAME,
  CITY,
  EMAIL,
  NAME,
  NIP,
  PHONE_NUMBER,
  SITE,
  ZIP_CODE,
  ACCOUNTAT_EMAIL,
  LAST_INVOICE_NUMBER,
  LAST_YEAR_INVOICE,
  PLACE_OF_ISSUE,
} from "../labels/LabelsGlobal";

export const OBJECT__SETTINGS_COMPANY = <InterfaceInput[]>[
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

export const OBJECT__SETTINGS_SITE = <InterfaceInput[]>[
  {
    id: uuid.v4(),
    label: LAST_INVOICE_NUMBER,
    name: "lastInvoiceNumber",
    type: 'number',
    mask: "A",
    maskToken: "A:[0-9]:repeated",
    validateRules: { required: customValidationRequired() },
  },
  {
    id: uuid.v4(),
    label: LAST_YEAR_INVOICE,
    name: "lastInvoiceYear",
    type: 'number',
    mask: "####",
    validateRules: { required: customValidationRequired(), minLength: customValidationMinLength(4, 0) },
  },
  {
    id: uuid.v4(),
    label: ACCOUNT_NUMBER,
    name: "accountNumber",
    validateRules: { required: customValidationRequired(), minLength: customValidationMinLength(22, 5) },
    mask: "## ### ### ### ### ###",
  },
  {
    id: uuid.v4(),
    label: BANK_NAME,
    name: "bankName",
    validateRules: { required: customValidationRequired() },
  },
  {
    id: uuid.v4(),
    label: PLACE_OF_ISSUE,
    name: "placeOfIssue",
    mask: "A",
    maskToken: "A:[A-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ ]:repeated",
    validateRules: { required: customValidationRequired() },
  },
  {
    id: uuid.v4(),
    label: ACCOUNTAT_EMAIL,
    name: "accountantEmail",
    validateRules: { email: customValidationEmail() },
  },
];
