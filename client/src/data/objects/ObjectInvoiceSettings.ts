import type { InterfaceInput } from "@/components/parts/Input/Input.vue";
import { customValidationMinLength, customValidationRequired } from "@/validations/customValidations";
import { uuid } from "vue-uuid";

import { DATE_OF_ISSUE, INVOICE_NUMBER, INVOICE_YEAR, PLACE_OF_ISSUE } from "../labels/LabelsGlobal";

export const OBJECT__INVOICE_SETTINGS: InterfaceInput[] = [
  {
    id: uuid.v4(),
    label: INVOICE_NUMBER,
    name: "invoiceNumber",
    inputMode: "numeric",
    mask: "A",
    maskToken: "A:[0-9]:repeated",
    validateRules: { required: customValidationRequired() },
  },
  {
    id: uuid.v4(),
    label: INVOICE_YEAR,
    name: "invoiceYear",
    inputMode: "numeric",
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
