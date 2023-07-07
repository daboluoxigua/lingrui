import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from "axios";
// import qs from 'qs'
import { ElMessage, ElMessageBox, ElLoading } from "element-plus";
import useUserStore from "@/store/modules/user";
import router from "@/router";

export interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  loading?: boolean;
  msg?: boolean;
}
export interface CustomAxiosResponse extends AxiosResponse {
  config: CustomInternalAxiosRequestConfig;
  data: any;
}
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  loading?: boolean;
  msg?: boolean;
}

// 请求计数
let loadingRequestCount = 0;
// loading实列
let loadingInstance: any = null;
const showLoading = () => {
  if (loadingRequestCount === 0) {
    // loadingInstance = Loading.service({ background: 'rgba(0, 0, 0, 0.4)', target: '.el-table' })
    loadingInstance = ElLoading.service({ background: "rgba(0, 0, 0, 0.4)" });
  }
  loadingRequestCount++;
};
const hideLoading = () => {
  if (loadingRequestCount <= 0) return;
  loadingRequestCount--;
  if (loadingRequestCount === 0) {
    setTimeout(() => {
      loadingInstance.close();
    }, 50);
  }
};
const config: CustomAxiosRequestConfig = {
  baseURL: import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY === "true" ? "/proxy/" : import.meta.env.VUE_APP_API_BASEURL,
  timeout: 1000 * 60,
  responseType: "json",
};

class RequestHttp {
  service: AxiosInstance;
  public constructor(config: AxiosRequestConfig) {
    // instantiation
    this.service = axios.create(config);

    this.service.interceptors.request.use((config: CustomInternalAxiosRequestConfig) => {
      const userStore = useUserStore();

      // 给headers加上token
      if (userStore.token) {
        config.headers["X-AUTH"] = userStore.token;
      }
      // 请求拦截进来调用显示loading效果
      if (config.loading) {
        showLoading();
      }
      return config;
    });

    this.service.interceptors.response.use(
      (response: CustomAxiosResponse) => {
        // 响应拦截进来隐藏loading效果，此处采用延时处理是合并loading请求效果，避免多次请求loading关闭又开启
        if (response.config.loading) {
          setTimeout(() => {
            hideLoading();
          }, 200);
        }

        const res = response.data;
        if (response.data.success) {
          if (response.config.msg) {
            ElMessage({
              message: res.msg || "操作成功！",
              type: res.msgLevel || "success",
              duration: 5 * 1000,
            });
          }
          return res.data;
        } else {
          ElMessage({
            grouping: true,
            message: res.msg || "Error",
            type: res.msgLevel || "error",
            duration: 5 * 1000,
          });
          return Promise.reject(response.data);
        }
      },
      (error) => {
        setTimeout(() => {
          hideLoading();
        }, 200);
        if (error.response?.status === 401) {
          const userStore = useUserStore(); // 定义 store 接收
          if (userStore.token) {
            // 清理登录数据
            userStore.logout();
            ElMessageBox.confirm("登录已过期，请重新登录！", "提示", {
              confirmButtonText: "确定",
              closeOnClickModal: false,
              closeOnPressEscape: false,
              showCancelButton: false,
              type: "error",
              showClose: false,
            }).then(() => {
              router.replace("/login");
            });
          }
          return false;
        }
        ElMessageBox({
          dangerouslyUseHTMLString: true,
          message: `<p>${error.message}<p><p>${error.response?.data.msg || ""}</p>`,
          type: "error",
        });
        return Promise.reject(error);
      }
    );
  }

  get<T>(url: string, params?: object, _object = {}): Promise<T> {
    return this.service.get(url, { params, ..._object });
  }
  post<T>(url: string, params?: object | string, _object = {}): Promise<T> {
    return this.service.post(url, params, _object);
  }
  put<T>(url: string, params?: object, _object = {}): Promise<T> {
    return this.service.put(url, params, _object);
  }
  delete<T>(url: string, params?: any, _object = {}): Promise<T> {
    return this.service.delete(url, { params, ..._object });
  }
  download(url: string, params?: object, _object = {}): Promise<BlobPart> {
    return this.service.post(url, params, { ..._object, responseType: "blob" });
  }
}

export default new RequestHttp(config);
