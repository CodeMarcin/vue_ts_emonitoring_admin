import { uuid } from "vue-uuid";
import type { InterfaceInput } from "@/components/parts/Input/Input.vue";
import LABELS from "@/data/labels/LabelsTheContractorAdd";
import { customValidationEmail, customValidationMinLength, customValidationRequired, customValidationIsNipExist } from "@/validations/customValidations";

export interface Groups {
  id: string;
  header: string;
  groupName: string;
  inputs: InterfaceInput[];
}

export const OBJECT__FORM_CONTRACTOR_ADD = <Groups[]>[
  {
    id: uuid.v4(),
    header: LABELS.BASIC,
    groupName: "basic",
    inputs: [
      {
        id: uuid.v4(),
        label: LABELS.NAME,
        name: "name",
        validateRules: { required: customValidationRequired() },
      },
      {
        id: uuid.v4(),
        label: LABELS.ADDRESS,
        name: "address",
        validateRules: { required: customValidationRequired() },
      },
      {
        id: uuid.v4(),
        label: LABELS.ZIP_CODE,
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
        label: LABELS.CITY,
        name: "city",
        mask: "A",
        maskToken: "A:[A-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ ]:repeated",
        validateRules: { required: customValidationRequired() },
      },
      {
        id: uuid.v4(),
        label: LABELS.NIP,
        inputMode: "numeric",
        mask: "###-###-##-##",
        name: "nip",
        validateRules: { required: customValidationRequired(), minLength: customValidationMinLength(13, 3), customValidationIsNipExist },
      },
    ],
  },
  {
    id: uuid.v4(),
    header: LABELS.ADDITIONAL,
    groupName: "additional",
    inputs: [
      {
        id: uuid.v4(),
        type: "email",
        label: LABELS.EMAIL,
        name: "email",
        validateRules: { email: customValidationEmail() },
      },
    ],
  },
];
