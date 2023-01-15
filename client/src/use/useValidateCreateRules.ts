import { computed } from "vue";
import type { Groups } from "@/data/objects/ObjectsFormContractorAdd";

export const useValidateCreateRules = (groupArray: Groups[]) => {
  let rules = {};
  groupArray.forEach((el) => {
    el.inputs.forEach((el) => {
      if (el.validateRules) rules = { ...rules, [el.name]: { ...el.validateRules } };
    });
  });
  return computed(() => rules);
};
