<!-- 许可证管理 -->
<template>
  <PageMain>
    <div class="license">
      <div class="title">许可证详细信息</div>
      <div class="info">
        <ul>
          <li>
            <div>组织机构</div>
            <div>{{ data?.organization }}</div>
          </li>
          <li>
            <div>许可证编号</div>
            <div>{{ data?.licenseId }}</div>
          </li>
          <li>
            <div>许可证类型</div>
            <div>{{ licenseType(data?.licenseType) }}</div>
          </li>
          <li>
            <div>开始日期</div>
            <div>{{ data?.effectiveDate }}</div>
          </li>
          <li v-if="data?.licenseType !== 'permanent'">
            <div>到期日期</div>
            <div>{{ data?.expiryDate }}</div>
          </li>
          <li v-if="data?.licenseType !== 'permanent'">
            <div>距离到期日期还剩</div>
            <div>{{ data?.expiryDate }}天</div>
          </li>
        </ul>
      </div>
      <el-upload
        ref="upload"
        class="upload"
        :action="uploadUrl"
        :on-success="handleSuccess"
        :on-error="handleError"
        accept=".lic"
        :show-file-list="false"
        :headers="{ 'X-AUTH': token }"
      >
        <el-button type="primary" icon="el-icon-upload2">上传许可证</el-button>
      </el-upload>
    </div>
  </PageMain>
</template>

<script setup lang="ts" name="license">
import { ElMessage } from "element-plus";
import useUserStore from "@/store/modules/user";
import api from "@/api";
const userStore = useUserStore();
const { token } = userStore;
const data = ref<anyObj>();
const uploadUrl = `${import.meta.env.VUE_APP_API_BASEURL}/license/upload`;
const handleSuccess = (res, file) => {
  if (res.success) {
    ElMessage({
      message: res.msg,
      type: "success",
    });
    getLicense();
  } else {
    ElMessage({
      message: res.msg,
      type: "error",
    });
  }
};
const handleError = () => {};
const getLicense = () => {
  api.get<anyObj>(`/license`).then((res) => {
    data.value = res;
    data.value.effectiveDate = res.effectiveDate + " 00:00:00";
    data.value.expiryDate = res.expiryDate + " 23:59:59";
  });
};

const licenseType = (val: "trial" | "limit" | "permanent") => {
  let license = {
    trial: "试用",
    limit: "订阅",
    permanent: "永久",
  };
  return license[val];
};
onMounted(() => {
  getLicense();
});
</script>
<style lang="scss" scoped>
.license {
  width: 100%;
  height: 100%;

  .title {
    font-size: 14px;
  }

  .info {
    margin-top: 24px;
    margin-bottom: 24px;
    width: 648px;
    border: 1px solid rgb(235 238 245 / 100%);
    font-size: 12px;

    li {
      line-height: 40px;
      display: flex;
      border-bottom: 1px solid rgb(235 238 245 / 100%);

      &:last-of-type {
        border: none;
      }

      div {
        &:nth-child(1) {
          padding-left: 50px;
          width: 200px;
          color: #787878;
        }

        &:nth-child(2) {
          color: #333335;
        }
      }
    }
  }
}
</style>
