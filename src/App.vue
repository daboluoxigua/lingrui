<script lang="ts" setup>
import { storeToRefs } from "pinia";
import eruda from "eruda";
import VConsole from "vconsole";
import zhCn from "element-plus/es/locale/lang/zh-cn";
// import hotkeys from "hotkeys-js";
// import eventBus from "./utils/eventBus";
import useSettingsStore from "@/store/modules/settings";
import useUserStore from "@/store/modules/user";
const settingsStore = useSettingsStore();
const userStore = useUserStore();
const { configData } = storeToRefs(userStore);
const { auth } = useAuth();

const buttonConfig = ref({
  autoInsertSpace: true,
});

// 获取logo
userStore.getConfig();

// 侧边栏主导航当前实际宽度
const mainSidebarActualWidth = computed(() => {
  let actualWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--g-main-sidebar-width"));
  if (["head", "single", "onlyHead"].includes(settingsStore.settings.menu.menuMode)) {
    actualWidth = 0;
  }
  return `${actualWidth}px`;
});

// 侧边栏次导航当前实际宽度
const subSidebarActualWidth = computed(() => {
  let actualWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--g-sub-sidebar-width"));
  if (settingsStore.settings.menu.subMenuCollapse) {
    actualWidth = 56;
  }
  if (["onlyHead"].includes(settingsStore.settings.menu.menuMode)) {
    actualWidth = 0;
  }
  return `${actualWidth}px`;
});

watch(
  [() => settingsStore.settings.app.enableDynamicTitle, () => configData.platformName],
  () => {
    if (settingsStore.settings.app.enableDynamicTitle && settingsStore.title) {
      const title = typeof settingsStore.title === "function" ? settingsStore.title() : settingsStore.title;
      document.title = `${title} - ${import.meta.env.VUE_APP_TITLE}`;
    } else {
      document.title = import.meta.env.VUE_APP_TITLE;
    }
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  settingsStore.setMode(document.documentElement.clientWidth);
  window.onresize = () => {
    settingsStore.setMode(document.documentElement.clientWidth);
  };
});

import.meta.env.VUE_APP_DEBUG_TOOL === "eruda" && eruda.init();
import.meta.env.VUE_APP_DEBUG_TOOL === "vconsole" && new VConsole();
</script>

<template>
  <el-config-provider :locale="zhCn" :size="settingsStore.settings.app.elementSize" :button="buttonConfig">
    <RouterView
      v-slot="{ Component, route }"
      :style="{
        '--g-main-sidebar-actual-width': mainSidebarActualWidth,
        '--g-sub-sidebar-actual-width': subSidebarActualWidth,
      }"
    >
      <component :is="Component" v-if="auth(route.meta.auth ?? '')" />
      <not-allowed v-else />
    </RouterView>
  </el-config-provider>
</template>
