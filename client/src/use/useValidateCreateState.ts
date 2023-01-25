import { reactive } from "vue";
import { isGroups, isInputs } from "@/use/useTypeScriptGuard";
import type { Groups } from "@/data/objects/ObjectsFormContractorAdd";
import type { InterfaceInput } from "@/components/parts/Input/Input.vue";

export const useValidateCreateState = (items: Groups[] | InterfaceInput[]) => {
  let state = {};
  if (isGroups(items)) {
    items.forEach((el) => {
      el.inputs.forEach((el) => (state = { ...state, [el.name]: "" }));
    });
  } else if (isInputs(items)) {
    items.forEach((el) => {
      state = { ...state, [el.name]: "" };
    });
  }

  return reactive(state);
};
