<template>
  <PageMain>
    <CTable ref="tableRef" :columns="columns" :init-param="initParam" :request-api="getTableList">
      <template #searchButton>
        <el-button type="primary" @click="editFn('新建项目')">新建项目</el-button>
        <!-- <el-button type="primary" @click="logoShow">logo设置</el-button> -->
      </template>

      <!-- 表格操作 -->
      <template #operation="scope">
        <div class="table-btn-list">
          <el-button type="primary" link @click="editFn('编辑用户', scope.row)">配置</el-button>
          <div class="divider"></div>
          <el-button type="primary" link @click="delFn(scope.row)">删除</el-button>
          <div class="divider"></div>
          <el-button type="primary" link @click="resetPwdFn(scope.row)">进入</el-button>
        </div>
      </template>
    </CTable>

    <add ref="addRef" @updata="updata" />
  </PageMain>
</template>

<script setup lang="ts" name="useCTable">
import type { Request } from "./interface/index";
import { useHandleData } from "@/hooks/useHandleData";
import add from "./dialog/add.vue";
import api from "@/api";
import useUserStore from "@/store/modules/user";
import { ColumnProps } from "@/components/CTable/interface";

const userStore = useUserStore();

const rowData = ref<Request>();
const tableRef = ref();
// 表格初始参数
const initParam = reactive({
  pageIndex: 1,
  pageSize: 10,
  orgId: userStore.userInfo.orgId,
  queryKey: "",
});

const getTableList = (params: any) => {
  return api.get(`/user/search/page/${params.pageIndex}/${params.pageSize}`, params, {
    loading: true,
  });
};

// 表格配置项
const columns: ColumnProps[] = [
  { label: "项目ID", prop: "userName", align: "left" },
  {
    label: "项目名",
    prop: "nickName",
    align: "left",
    search: { el: "input", props: { filterable: false, "suffix-icon": "Search" } },
  },
  { label: "所属组织", prop: "orgName", align: "left" },
  { label: "所属集群", prop: "orgName", align: "left" },
  { label: "项目创建人", prop: "orgName", align: "left" },
  { label: "描述", prop: "orgName", align: "left" },
  { label: "创建时间", prop: "orgName", align: "left" },
  { prop: "operation", label: "操作", align: "left", fixed: "right", width: 200 },
];

// 更新数据
const updata = () => {
  tableRef.value.getData();
};

// 编辑菜单
const addRef = ref();
const editFn = (title: string, row?: Request) => {
  addRef.value.show(title, row);
};

// 删除
const delFn = async (row: Request) => {
  rowData.value = row;
  await useHandleData(deleteApi, {}, `删除【${row.nickName}】`);
  tableRef.value.getData();
};
const deleteApi = () => {
  if (!rowData.value) return;
  return api.delete(`/org/${rowData.value.userId}`);
};

// 重置密码
const resetPwdFn = async (row: Request) => {
  rowData.value = row;
  await useHandleData(resetPwdApi, { userId: row.userId }, `重置【${row.nickName}】密码`);
  tableRef.value.getData();
};
const resetPwdApi = () => {
  return api.put(`/user/resetPwd`);
};
</script>
