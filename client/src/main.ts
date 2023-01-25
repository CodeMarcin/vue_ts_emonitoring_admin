import { createApp } from "vue";
import { appFire } from "@/firebase";
import App from "./App.vue";
import { registerPlugins } from "./plugins";


import "./assets/main.css";
appFire;
const app = createApp(App);
registerPlugins(app);

app.mount("#app");
