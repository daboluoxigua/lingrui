<!-- 头部菜单 -->
<template>
  <el-menu
    active-text-color="var(--g-header-menu-active-color)"
    text-color="var(--g-header-menu-color)"
    background-color="var(--g-header-menu-active-bg)"
    :default-active="activeMenu"
    class="header-menu"
    mode="horizontal"
    router
    style="

--el-menu-hover-bg-color: var(--g-header-menu-active-bg);"
  >
    <el-menu-item v-for="item in menuData" :key="item.url" :index="item.url">{{ item.menuName }}</el-menu-item>
  </el-menu>
</template>

<script setup lang="ts" name="HeaderMenu">
import { useRouter } from "vue-router";
import useRouteStore from "@/store/modules/route";

const router = useRouter();
const routeStore = useRouteStore();
const menuData = routeStore.routesHeader.children;
const activeMenu = computed(() => {
  const route = router.currentRoute.value;
  const { matched } = route;
  return matched[0].path;
});
</script>
<style lang="scss" scoped>
.header-menu {
  min-width: 500px;

  &.el-menu--horizontal {
    border: none !important;
    background-color: transparent !important;
  }
}

:deep(.el-menu-item) {
  &.is-active {
    background-color: var(--g-header-menu-active-bg);
    border-color: var(--g-header-menu-active-bg);
  }
}

:deep(.el-sub-menu__title) {
  border: none !important;
  height: calc(100% - 3px) !important;
}
</style>
