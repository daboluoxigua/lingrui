<template>
  <PageMain>
    <CTable ref="tableRef" :columns="columns" :init-param="initParam" :request-api="getTableList">
      <template #searchButton>
        <el-button type="primary" @click="editFn('新增用户')">新增用户</el-button>
        <!-- <el-button type="primary" @click="logoShow">logo设置</el-button> -->
      </template>

      <!-- 表格操作 -->
      <template #operation="scope">
        <div class="table-btn-list">
          <el-button type="primary" link @click="editFn('编辑用户', scope.row)">编辑</el-button>
          <div class="divider"></div>
          <el-button type="primary" link @click="delFn(scope.row)">删除</el-button>
          <div class="divider"></div>
          <el-button type="primary" link @click="setRoleFn(scope.row)">设置角色</el-button>
          <div class="divider"></div>
          <el-button type="primary" link @click="resetPwdFn(scope.row)">重置密码</el-button>
        </div>
      </template>
    </CTable>

    <add ref="addRef" @updata="updata" />
    <setRole ref="setRoleRef" @updata="updata" />
  </PageMain>
</template>

<script setup lang="ts" name="useCTable">
import type { Request } from "./interface/index";
import { useHandleData } from "@/hooks/useHandleData";
import add from "./dialog/add.vue";
import setRole from "./dialog/setRole.vue";
import api from "@/api";
import useUserStore from "@/store/modules/user";
import { ColumnProps } from "@/components/CTable/interface";

const userStore = useUserStore();

const rowData = ref<Request>();
const tableRef = ref();

const getOrgTeee = () => {
  return api.get("/org/tree", { orgId: 1 });
};

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
const columns = ref<ColumnProps[]>([
  { label: "用户名称", prop: "userName", align: "left" },
  { label: "昵称", prop: "nickName", align: "left" },
  {
    label: "角色名称",
    prop: "roleList",
    align: "left",
    showOverflowTooltip: false,
    render: (scope) => {
      let role: any[] = [];
      scope.row.roleList.forEach((item: anyObj) => {
        role.push(item.roleName);
      });
      return role.join(",");
    },
  },
  {
    label: "所属组织名称",
    prop: "orgName",
    align: "left",
    enum: getOrgTeee,
    search: {
      el: "tree-select",
      key: "orgId",
      props: {
        filterable: false,
        placeholder: "选择所属组织",
        "check-strictly": true,
      },
    },
    fieldNames: { label: "name", value: "id", children: "childOrgList" },
  },
  { label: "所属组织编码", prop: "orgCode", align: "left" },
  { label: "手机号码", prop: "mobile", align: "left" },
  { label: "电子邮箱", prop: "email", align: "left" },
  { label: "创建时间", prop: "createTime", align: "left", sortable: true },
  { prop: "operation", label: "操作", align: "left", fixed: "right", width: 220 },
  {
    isShow: false,
    search: {
      el: "input",
      key: "queryKey",
      props: { filterable: false, "suffix-icon": "Search", placeholder: "请输入用户名称" },
    },
  },
]);

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

// 设置角色
const setRoleRef = ref();
const setRoleFn = (row: Request) => {
  setRoleRef.value.show(row);
};
</script>
