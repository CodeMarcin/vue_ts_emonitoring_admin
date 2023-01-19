import { helpers, minLength, required, email } from "@vuelidate/validators";
import { APIFindContractorByNIP } from "@/api/APIContractors";
import { ERROR_MIN_LENGTH, ERROR_REQUIRED, ERROR_INVALID_EMAIL, ERROR_NIP_EXIST } from "@/data/labels/LabelsGlobal";

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
      if(nip.length !== 13) return true;
      return !helpers.req(nip) || !(await APIFindContractorByNIP(nip, 1)).data.length;
    } catch (error) {
      console.error(error);
    }
  })
);
