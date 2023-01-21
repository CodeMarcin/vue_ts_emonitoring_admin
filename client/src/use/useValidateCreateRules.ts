import { computed } from "vue";
import type { Groups } from "@/data/objects/ObjectsFormContractorAdd";
import type { InterfaceInput } from "@/components/parts/Input/Input.vue";
import { isGroups, isInputs } from "@/use/useTypeScriptGuard";

export const useValidateCreateRules = (items: Groups[] | InterfaceInput[]) => {
  let rules = {};
  if (isGroups(items)) {
    items.forEach((el) => {
      el.inputs.forEach((el) => {
        if (el.validateRules) rules = { ...rules, [el.name]: { ...el.validateRules } };
      });
    });
  } else if (isInputs(items)) {
    items.forEach((el) => {
      if (el.validateRules) rules = { ...rules, [el.name]: { ...el.validateRules } };
    });
  }

  return computed(() => rules);
};
