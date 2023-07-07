<template>
  <PageMain>
    <CTable ref="tableRef" :columns="columns" :init-param="initParam" :request-api="getTableList">
      <template #searchButton>
        <el-button type="primary" @click="editFn('新增角色')">新增角色</el-button>
        <!-- <el-button type="primary" @click="logoShow">logo设置</el-button> -->
      </template>

      <!-- 表格操作 -->
      <template #operation="scope">
        <div class="table-btn-list">
          <el-button type="primary" :disabled="scope.row.isSystem" link @click="enableFn(scope.row)">{{
            scope.row.isEnable ? "禁用" : "启用"
          }}</el-button>
          <div class="divider"></div>
          <el-button type="primary" :disabled="scope.row.isSystem" link @click="editFn('编辑角色', scope.row)">编辑</el-button>
          <div class="divider"></div>
          <el-button type="primary" :disabled="scope.row.isSystem" link @click="delFn(scope.row)">删除</el-button>
          <div class="divider"></div>
          <el-button type="primary" :disabled="scope.row.isSystem" link @click="permissionFn(scope.row)">设置权限</el-button>
        </div>
      </template>
    </CTable>

    <add ref="addRef" @updata="updata" />
    <permissionConfig ref="permissionConfigRef" />
  </PageMain>
</template>

<script setup lang="tsx" name="role">
import type { Request } from "./interface/index";
import { useHandleData } from "@/hooks/useHandleData";
import add from "./dialog/add.vue";
import api from "@/api";
import { ColumnProps } from "@/components/CTable/interface";

const permissionConfigRef = ref();
const rowData = ref<Request>();
const tableRef = ref();
// 表格初始参数
const initParam = reactive({
  queryKey: "",
});
const getTableList = (params: any) => {
  return api.get(`/role/search/page/${params.pageIndex}/${params.pageSize}`, params);
};

// 表格配置项
const columns: ColumnProps<Request>[] = [
  {
    label: "角色名称",
    prop: "roleName",
    align: "left",
    search: { el: "input", key: "queryKey", props: { filterable: false, "suffix-icon": "Search" } },
  },
  { label: "角色标识", prop: "roleSign", align: "left" },
  {
    label: "系统角色",
    prop: "isSystem",
    align: "left",
    render: (scope) => {
      return (
        <el-icon size={16} color={scope.row.isSystem ? "#2BD84C" : "#b7b7b7"}>
          {scope.row.isSystem ? <SuccessFilled /> : <CircleCloseFilled />}
        </el-icon>
      );
    },
  },
  {
    label: "是否启用",
    prop: "isEnable",
    align: "left",
    render: (scope) => {
      return (
        <el-icon size={16} color={scope.row.isEnable ? "#2BD84C" : "#b7b7b7"}>
          {scope.row.isEnable ? <SuccessFilled /> : <CircleCloseFilled />}
        </el-icon>
      );
    },
  },
  { label: "创建时间", prop: "createTime", align: "left", sortable: true },
  { prop: "operation", label: "操作", align: "left", fixed: "right", width: 240 },
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
  await useHandleData(deleteApi, {}, `删除【${row.roleName}】`);
  tableRef.value.getData();
};
const deleteApi = () => {
  if (!rowData.value) return;
  return api.delete(`/role/${rowData.value.roleId}`);
};

// 启用 禁用
const enableFn = async (row: Request) => {
  rowData.value = row;
  const text = rowData.value.isEnable ? "禁用" : "启用";
  await useHandleData(enableApi, {}, `${text}【${row.roleName}】`);
  tableRef.value.getData();
};

const enableApi = () => {
  if (!rowData.value) return;
  return api.put(`/role/${rowData.value.roleId}/state/${!rowData.value.isEnable}`);
};

const permissionFn = (row: Request) => {
  permissionConfigRef.value.show({ ...row });
};
</script>
