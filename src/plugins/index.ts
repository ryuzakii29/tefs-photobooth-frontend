// plugins/index.ts

import router from "../router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import vuetify from "./vuetify";
import type { App } from "vue";

export function registerPlugins(app: App) {
  // 1. Create and configure Pinia first
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);

  // 2. Install Pinia into the app
  app.use(pinia);

  // 3. Install everything else
  app.use(vuetify);
  app.use(router);
}
