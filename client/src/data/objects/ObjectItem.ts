import type { InterfaceInput } from "@/components/parts/Input/Input.vue";
import { customValidationRequired } from "@/validations/customValidations";
import { uuid } from "vue-uuid";

import { DATE_OF_ISSUE, INVOICE_NUMBER, INVOICE_YEAR, NAME, PLACE_OF_ISSUE, PRICE, QUANTITY } from "../labels/LabelsGlobal";

export const OBJECT__ITEM: InterfaceInput[][] = [
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
      type: "number",
      mask: "A",
      maskToken: "A:[0-9]:repeated",
      validateRules: { required: customValidationRequired() },
    },
    {
      id: uuid.v4(),
      label: PRICE,
      name: "price",
      inputMode: "numeric",
      type: "number",
      mask: "A",
      maskToken: "A:[0-9.]:repeated",
      validateRules: { required: customValidationRequired() },
    },
  ],
];
