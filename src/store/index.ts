import { createPinia } from "pinia";
import piniaPluginPersist from "pinia-plugin-persist";

// pinia persist
const pinia = createPinia();
pinia.use(piniaPluginPersist);

export default pinia;
