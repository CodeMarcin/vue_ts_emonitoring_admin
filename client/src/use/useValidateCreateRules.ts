import { computed } from "vue";
import type { InterfaceInput } from "@/components/parts/Input/Input.vue";

export const useValidateCreateRules = (items: InterfaceInput[]) => {
  let rules = {};

  items.forEach((el) => {
    if (el.validateRules) rules = { ...rules, [el.name]: { ...el.validateRules } };
  });

  return computed(() => rules);
};
