import { reactive } from "vue";
import type { Groups } from "@/data/objects/ObjectsFormContractorAdd";

export const useValidateCreateState = (groupArray: Groups[]) => {
  let state = {};
  groupArray.forEach((el) => {
    el.inputs.forEach((el) => (state = { ...state, [el.name]: "" }));
  });
  return reactive(state);
};
