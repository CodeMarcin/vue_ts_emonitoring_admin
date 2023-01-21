import type { Groups } from "@/data/objects/ObjectsFormContractorAdd";
import type { InterfaceInput } from "@/components/parts/Input/Input.vue";

export const isGroups = (items: any): items is Groups[] => {
  return items.some((el: Groups) => el.groupName);
};

export const isInputs = (items: any): items is InterfaceInput[] => {
  return items.some((el: Groups) => !el.groupName);
};
