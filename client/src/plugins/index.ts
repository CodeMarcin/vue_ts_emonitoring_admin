import type { App } from "vue";
import { createPinia } from "pinia";
import VueClickAwayPlugin from "vue3-click-away";

import router from "../router/";

export const registerPlugins = (app: App<Element>) => {
  app.use(createPinia()).use(VueClickAwayPlugin).use(router);
};
