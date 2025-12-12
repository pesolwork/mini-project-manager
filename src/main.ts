/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Styles
import "unfonts.css";

// auth
import { useAuth } from "@/composables/useAuth";

const { initAuth } = useAuth();

const bootstrap = async () => {
  await initAuth();
  const app = createApp(App);
  registerPlugins(app);
  app.mount("#app");
};

bootstrap();
