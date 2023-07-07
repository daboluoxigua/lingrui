<template>
  <div class="loginMain">
    <img class="logo" :src="configData.systemLogo" />
    <div class="bgImg">
      <img src="@/assets/images/banner.png" alt="" />
    </div>
    <el-form
      ref="loginFormRef"
      size="large"
      label-position="left"
      label-width="0px"
      class="login-container"
      :model="loginForm"
      :rules="loginRules"
      @submit.prevent
    >
      <h3 class="title">{{ configData.platformName }}</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          maxlength="20"
          type="text"
          class="username_input"
          autocomplete="off"
          placeholder="账号"
        />
      </el-form-item>
      <el-form-item prop="pwd">
        <el-input
          v-model="loginForm.pwd"
          maxlength="20"
          type="password"
          class="passWord_input"
          autocomplete="new-password"
          placeholder="密码"
        />
      </el-form-item>
      <div><el-checkbox v-model="loginForm.remember" class="checked">记住账号</el-checkbox></div>
      <el-button type="success" class="loginBut" round native-type="submit" @click="handleLogin(loginForm)">登录</el-button>
    </el-form>
  </div>
</template>

<script lang="ts" setup name="Login">
import { storeToRefs } from "pinia";
import type { FormInstance, FormRules } from "element-plus";
import useUserStore from "@/store/modules/user";

const route = useRoute();
const router = useRouter();

const userStore = useUserStore();
const { configData } = storeToRefs(userStore);

const title = import.meta.env.VUE_APP_TITLE;

// 表单类型，login 登录，reset 重置密码
const loading = ref(false);
const redirect = ref(route.query.redirect?.toString() ?? "/");

// 登录
const loginFormRef = ref<FormInstance>();
const loginForm = ref({
  username: localStorage.username || "",
  pwd: "",
  remember: !!localStorage.username,
});
const loginRules = ref<FormRules>({
  username: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  pwd: [
    { required: true, trigger: "blur", message: "请输入密码" },
    { min: 6, max: 18, trigger: "blur", message: "密码长度为6到18位" },
  ],
});
function handleLogin() {
  loginFormRef.value &&
    loginFormRef.value.validate((valid) => {
      if (valid) {
        loading.value = true;
        userStore
          .login(loginForm.value)
          .then(() => {
            loading.value = false;
            if (loginForm.value.remember) {
              localStorage.setItem("username", loginForm.value.username);
            } else {
              localStorage.removeItem("username");
            }
            router.push(redirect.value);
          })
          .catch(() => {
            loading.value = false;
          });
      }
    });
}
</script>

<style lang="scss" scoped>
.bgImg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-55%, -23%);
  z-index: 1;
}

.loginMain {
  background: linear-gradient(-10deg, #1c3c70 0%, #15267a 28%, #0f2647 65%, #0c1f3a 100%);
  height: 100vh;
  overflow: hidden !important;
  width: 100%;
  position: relative;

  .logo {
    margin-top: 30px;
    margin-left: 10%;
    max-width: 180px;
    max-height: 80px;
  }

  .loginBut {
    width: 100%;
    background-color: #2e68ff !important;
    border: none;

    &:hover {
      background-color: #2e68ff !important;
    }
  }

  .login-container {
    position: absolute;
    top: 50%;
    right: 7%;
    transform: translate(0, -50%);
    padding: 40px 54px;
    width: 384px;
    background: #fff;
    border-radius: 8px;
    z-index: 2;

    .title {
      font-size: 28px;
      color: #303030;
      margin-bottom: 30px;
    }

    .checked {
      color: #9c9c9c;
    }
  }
}
</style>
