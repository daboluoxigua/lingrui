<template>
  <PageMain>
    <CTable ref="tableRef" :columns="columns" :init-param="initParam" :request-api="getTableList">
      <!-- 表格操作 -->
      <template #operation="scope">
        <div class="table-btn-list">
          <el-button type="primary" link @click="detailsFn(scope.row)">查看操作详情</el-button>
        </div>
      </template>
    </CTable>

    <logDetails ref="logDetailsRef"></logDetails>
  </PageMain>
</template>

<script setup lang="ts" name="useCTable">
import api from "@/api";
import { ColumnProps } from "@/components/CTable/interface";
import logDetails from "./drawer/logDetails.vue";
const tableRef = ref();
// 表格初始参数
const initParam = reactive({
  pageIndex: 1,
  pageSize: 10,
});

const getTableList = (params: any) => {
  return api.get(`/audit_log/page/${params.pageIndex}/${params.pageSize}`, params, {
    loading: true,
  });
};

// 表格配置项
const columns: ColumnProps[] = [
  {
    label: "类型",
    prop: "auditType",
    align: "left",
    search: {
      el: "input",
      props: { filterable: false, "suffix-icon": "Search" },
    },
  },

  {
    label: "动作",
    prop: "actions",
    align: "left",
    search: {
      el: "input",
      props: { filterable: false, "suffix-icon": "Search" },
    },
  },

  {
    label: "操作用户",
    prop: "operationUser",
    align: "left",
    search: {
      el: "input",
      props: { filterable: false, "suffix-icon": "Search" },
    },
  },
  {
    label: "操作请求IP",
    prop: "operationIp",
    align: "left",
    search: {
      el: "input",
      props: { filterable: false, "suffix-icon": "Search" },
    },
  },
  { label: "系统服务名", prop: "module", align: "left" },
  // { label: "操作内容", prop: "operation", align: "left" },
  { label: "操作时间", prop: "createTime", align: "left", sortable: true },
  { prop: "operation", label: "操作", align: "left", fixed: "right", width: 100 },
];

const logDetailsRef = ref<InstanceType<typeof logDetails>>();
const detailsFn = (row: any) => {
  logDetailsRef.value!.show(row.auditId);
};
</script>
