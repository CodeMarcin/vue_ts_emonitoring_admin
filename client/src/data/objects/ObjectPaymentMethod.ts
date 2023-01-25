import type { InterfaceInput } from "@/components/parts/Input/Input.vue";
import { customValidationMinLength, customValidationRequired } from "@/validations/customValidations";
import { uuid } from "vue-uuid";
import { ACCOUNT_NUMBER, BANK_NAME, DAYS_OF_PAYMENT } from "../labels/LabelsGlobal";

export const OBJECT__PAYMENT_METHOD = <InterfaceInput[]>[
  {
    id: uuid.v4(),
    label: ACCOUNT_NUMBER,
    name: "accountNumber",
    mask: "## ### ### ### ### ###",
    validateRules: { required: customValidationRequired(), minLength: customValidationMinLength(22, 5) },
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
    mask: "A",
    maskToken: "A:[0-9]:repeated",
    validateRules: { required: customValidationRequired() },
  },
];
