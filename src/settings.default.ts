// 该文件为系统默认配置，请勿修改！！！

import type { RecursiveRequired, Settings } from "#/global";

const globalSettingsDefault: RecursiveRequired<Settings.all> = {
  app: {
    colorScheme: "light",
    elementSize: "small",
    iconifyOfflineUse: false,
    enablePermission: true,
    enableProgress: true,
    enableDynamicTitle: true,
    routeBaseOn: "backend",
    enableAppSetting: false,
  },
  home: {
    enable: true,
    title: "主页",
  },
  layout: {
    enableMobileAdaptation: false,
  },
  menu: {
    baseOn: "backend",
    menuMode: "head",
    switchMainMenuAndPageJump: false,
    subMenuUniqueOpened: true,
    subMenuCollapse: false,
    enableSubMenuCollapseButton: false,
    enableHotkeys: false,
  },
  topbar: {
    mode: "static",
  },
  toolbar: {
    enableFullscreen: false,
    enablePageReload: false,
    enableColorScheme: false,
  },
  breadcrumb: {
    enable: true,
  },
  navSearch: {
    enable: true,
    enableHotkeys: true,
  },
};

export default globalSettingsDefault;
