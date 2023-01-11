import type { App } from "vue";
import { createPinia } from "pinia";

import router from "../router/";

export const registerPlugins = (app: App<Element>) => {
  app.use(createPinia()).use(router);
};
