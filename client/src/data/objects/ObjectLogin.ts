import type { InterfaceInput } from "@/components/parts/Input/Input.vue";
import { customValidationRequired } from "@/validations/customValidations";
import { uuid } from "vue-uuid";
import { LOGIN, PASSWORD } from "../labels/LabelsGlobal";

export const OBJECT__LOGIN = <InterfaceInput[]>[
  {
    id: uuid.v4(),
    label: LOGIN,
    name: "login",
    validateRules: { required: customValidationRequired() },
  },
  {
    id: uuid.v4(),
    label: PASSWORD,
    type: "password",
    name: "password",
    validateRules: { required: customValidationRequired() },
  },
];
