import { defineStore } from "pinia";

type TToastType = "success" | "error" | "info";

export interface IStoreToast {
  showToast: boolean;
  toastAutoHide: boolean;
  toastType: TToastType;
  toastText: string;
  toastIcon?: string;
}

export const useToastStore = defineStore("toast", {
  state: () =>
    ({
      showToast: false,
      toastAutoHide: true,
      toastType: "success",
      toastText: "",
      toastIcon: "",
    } as IStoreToast),
  getters: {
    getToastState(state) {
      return state;
    },
  },
  actions: {
    setToast(type: TToastType, text: string, autoHide: boolean = true, icon?: string) {
      this.toastType = type;
      this.toastText = text;
      if (!autoHide) this.toastAutoHide = false;
      else this.toastAutoHide = true;
      if (icon) this.toastIcon = icon;
    },

    showToastAction() {
      this.showToast = true;
    },
    hideToastAction() {
      this.showToast = false;
    },
  },
});
