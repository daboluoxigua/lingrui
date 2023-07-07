import type { userInfo, configData } from "../interface";
import useRouteStore from "./route";
import useMenuStore from "./menu";
import router from "@/router";
import api from "@/api";

export default defineStore({
  id: "app-user",
  state: () => ({
    // user info
    userInfo: {} as userInfo,
    // token
    token: "",
    permissions: [],
    configData: {} as configData,
  }),
  actions: {
    async login(data: { username: string; pwd: string }) {
      return new Promise((resolve, reject) => {
        api
          .post<any>("/user/login", data)
          .then((res) => {
            this.userInfo = res.userInfo;
            // this.token = res.token;
            this.token = "iB07nL5eBuiv";
            router.replace("/");
            resolve(res);
          })
          .catch((error) => {
            return reject(error);
          });
      });
    },
    async logout() {
      const routeStore = useRouteStore();
      const menuStore = useMenuStore();
      this.token = "";
      routeStore.removeRoutes();
      menuStore.setActived(0);
    },
    // 获取我的权限
    async getPermissions() {
      // 通过 mock 获取权限
      // const res = await api.get("member/permission", {
      //   baseURL: "/mock/",
      // });
      // this.permissions = res.data.permissions;
      return this.permissions;
    },
    async getConfig() {
      const res = await api.get<configData>("/sys-config");
      this.configData = res;
      (document.getElementById("icon") as HTMLAnchorElement).href = this.configData.favicon;
      return res;
    },
  },
  persist: {
    enabled: true, // 开启数据缓存
  },
});
