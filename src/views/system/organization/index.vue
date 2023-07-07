<template>
  <PageMain>
    <CTable
      ref="tableRef"
      :columns="columns"
      :init-param="initParam"
      :request-api="getTableList"
      :tree-props="{ children: 'childOrgList', hasChildren: 'hasChildren' }"
      :expand-row-keys="['1']"
      row-key="id"
      :pagination="false"
    >
      <template #searchButton>
        <el-button type="primary" @click="editFn('新增组织')">新增组织</el-button>
        <!-- <el-button type="primary" @click="logoShow">logo设置</el-button> -->
      </template>

      <!-- 表格操作 -->
      <template #operation="scope">
        <div class="table-btn-list">
          <el-button type="primary" link @click="editFn('编辑组织', scope.row)">编辑</el-button>
          <div class="divider"></div>
          <el-button type="primary" link @click="delFn(scope.row)">删除</el-button>
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
import { ColumnProps } from "@/components/CTable/interface";

const rowData = ref<Request>();
const tableRef = ref();
// 表格初始参数
const initParam = reactive({
  orgId: 1,
});
const getTableList = (params: any) => {
  return api.get(`/org/tree`, params);
};

// 表格配置项
const columns: ColumnProps[] = [
  { label: "组织名称", prop: "name", align: "left" },
  { label: "组织编码", prop: "orgCode", align: "left" },
  { label: "组织路径", prop: "orgCodePath", align: "left" },
  { label: "创建时间", prop: "createTime", align: "left", sortable: true },
  { prop: "operation", label: "操作", align: "left", fixed: "right", width: 120 },
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
  await useHandleData(deleteApi, {}, `删除【${row.name}】`);
  tableRef.value.getData();
};
const deleteApi = () => {
  if (!rowData.value) return;
  return api.delete(`/org/${rowData.value.id}`);
};
</script>
