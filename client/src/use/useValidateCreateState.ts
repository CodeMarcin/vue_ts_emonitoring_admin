import { reactive } from "vue";
import type { InterfaceInput } from "@/components/parts/Input/Input.vue";

export const useValidateCreateState = (items: InterfaceInput[]) => {
  let state = {};

  items.forEach((el) => {
    state = { ...state, [el.name]: "" };
  });

  return reactive(state);
};
