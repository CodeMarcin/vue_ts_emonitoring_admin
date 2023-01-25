import { helpers, minLength, required, email } from "@vuelidate/validators";
import { ERROR_MIN_LENGTH, ERROR_REQUIRED, ERROR_INVALID_EMAIL, ERROR_NIP_EXIST } from "@/data/labels/LabelsGlobal";

import { query, where, getDocs } from "@firebase/firestore";
import { COLLECTION__CONTRACTORS } from "@/firebase";

export const customValidationMinLength = (value: number, minus: number) => {
  return helpers.withMessage(`${ERROR_MIN_LENGTH} ${value - minus}`, minLength(value));
};

export const customValidationRequired = () => {
  return helpers.withMessage(ERROR_REQUIRED, required);
};

export const customValidationEmail = () => {
  return helpers.withMessage(ERROR_INVALID_EMAIL, email);
};

export const customValidationIsNipExist = helpers.withMessage(
  ERROR_NIP_EXIST,
  helpers.withAsync(async (nip: string) => {
    try {
      if (nip.length !== 13) return true;
      return !helpers.req(nip) || !(await getDocs(query(COLLECTION__CONTRACTORS, where("nip", "==", nip)))).size;
    } catch (error) {
      console.error(error);
    }
  })
);
