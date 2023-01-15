import { uuid } from "vue-uuid";
import type { InterfaceInput } from "@/components/parts/Input/Input.vue";
import { required, email, minLength, helpers } from "@vuelidate/validators";
import LABELS from "@/data/labels/LabelsTheContractorAdd";
import { ERROR_REQUIRED, ERROR_INVALID_EMAIL, ERROR_MIN_LENGTH } from "../labels/LabelsGlobal";

export interface Groups {
  id: string;
  header: string;
  groupName: string;
  inputs: InterfaceInput[];
}

const ovverideRequired = () => {
  return helpers.withMessage(ERROR_REQUIRED, required);
};

const ovverideEmail = () => {
  return helpers.withMessage(ERROR_INVALID_EMAIL, email);
};

const ovverideMinLength = (value: number, minus: number) => {
  return helpers.withMessage(`${ERROR_MIN_LENGTH} ${value - minus}`, minLength(value));
};

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
        validateRules: { required: ovverideRequired() },
      },
      {
        id: uuid.v4(),
        label: LABELS.ADDRESS,
        name: "address",
        validateRules: { required: ovverideRequired() },
      },
      {
        id: uuid.v4(),
        label: LABELS.ZIP_CODE,
        mask: "##-###",
        inputMode: "numeric",
        name: "zipCode",
        validateRules: {
          required: ovverideRequired(),
          minLength: ovverideMinLength(6, 1),
        },
      },
      {
        id: uuid.v4(),
        label: LABELS.CITY,
        name: "city",
        mask: "A",
        maskToken: "A:[A-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ ]:repeated",
        validateRules: { required: ovverideRequired() },
      },
      {
        id: uuid.v4(),
        label: LABELS.NIP,
        inputMode: "numeric",
        mask: "###-###-##-##",
        name: "NIP",
        validateRules: { required: ovverideRequired(), minLength: ovverideMinLength(13, 3) },
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
        validateRules: { email: ovverideEmail() },
      },
    ],
  },
];
