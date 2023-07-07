<script setup lang="ts" name="CTable">
import type { TableProps } from "element-plus";
import { ElTable } from "element-plus";
import { Operation, Refresh, Search } from "@element-plus/icons-vue";
import Pagination from "./components/Pagination.vue";
import ColSetting from "./components/ColSetting.vue";
import TableColumn from "./components/TableColumn.vue";
import { useTable } from "@/hooks/useTable";
import { useSelection } from "@/hooks/useSelection";
import type { ColumnProps } from "@/components/CTable/interface";
import { handleProp } from "@/utils";
import SearchForm from "@/components/SearchForm/index.vue";

interface CTableProps extends Partial<Omit<TableProps<any>, "data">> {
  columns: ColumnProps[]; // 列配置项
  requestApi: (params: any) => Promise<any> | any; // 请求表格数据的 api
  requestAuto?: boolean; // 是否自动执行请求 api ==> 非必传（默认为true）
  requestError?: (params: any) => void; // 表格 api 请求错误监听
  dataCallback?: (data: any, param: any) => any; // 返回数据的回调函数，可以对数据进行处理
  title?: string; // 表格标题，目前只在打印的时候用到
  pagination?: boolean; // 是否需要分页组件 ==> 非必传（默认为true）
  initParam?: any; // 初始化请求参数 ==> 非必传（默认为{}）
  border?: boolean; // 是否带有纵向边框 ==> 非必传（默认为false）
  toolButton?: boolean; // 是否显示表格功能按钮 ==> 非必传（默认为true）
  rowKey?: string; // 行数据的 Key，用来优化 Table 的渲染，当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
  searchCol?: number | Record<"xs" | "sm" | "md" | "lg" | "xl", number>; // 表格搜索项 每列占比配置 ==> 非必传 { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
  isShowSearch?: boolean; // 是否显示搜索模块
}

// 接受父组件参数，配置默认值
const props = withDefaults(defineProps<CTableProps>(), {
  requestAuto: true,
  columns: () => [],
  pagination: true,
  initParam: {},
  border: false,
  toolButton: false,
  rowKey: "id",
  searchCol: () => ({ xs: 1, sm: 2, md: 2, lg: 8, xl: 4 }),
  isShowSearch: true,
});

// 是否显示搜索模块
const isShowSearch = ref(props.isShowSearch);

// 表格 DOM 元素
const tableRef = ref<InstanceType<typeof ElTable>>();

// 表格多选 Hooks
const { selectionChange, selectedList, selectedListIds, isSelected } = useSelection(props.rowKey);

// 表格操作 Hooks
const { tableData, pageable, searchParam, searchInitParam, getData, search, reset, handleSizeChange, handleCurrentChange } =
  useTable(props.requestApi, props.initParam, props.pagination, props.dataCallback, props.requestError);

// 清空选中数据列表
function clearSelection() {
  return tableRef.value!.clearSelection();
}

onMounted(() => props.requestAuto && getData());

watch(() => props.initParam, getData, { deep: true });

const tableColumns = ref<ColumnProps[]>(props.columns);

const enumMap = ref(new Map<string, { [key: string]: any }[]>());
provide("enumMap", enumMap);
async function setEnumMap(col: ColumnProps) {
  if (!col.enum) {
    return;
  }
  if (typeof col.enum !== "function") {
    return enumMap.value.set(col.prop!, col.enum!);
  }
  const data = await col.enum();
  enumMap.value.set(col.prop!, data);
}

// 扁平化 columns
function flatColumnsFunc(columns: ColumnProps[], flatArr: ColumnProps[] = []) {
  columns.forEach(async (col) => {
    if (col._children?.length) {
      flatArr.push(...flatColumnsFunc(col._children));
    }
    flatArr.push(col);

    col.isShow = col.isShow ?? true;
    col.isFilterEnum = col.isFilterEnum ?? true;

    // 设置 enumMap
    setEnumMap(col);
  });
  return flatArr.filter((item) => !item._children?.length);
}

// flatColumns
const flatColumns = ref<ColumnProps[]>();
flatColumns.value = flatColumnsFunc(tableColumns.value);

// 过滤需要搜索的配置项
const searchColumns = flatColumns.value.filter((item) => item.search?.el);

searchColumns.forEach((column, index) => {
  column.search!.order = column.search!.order ?? index + 2;
  if (column.search?.defaultValue !== undefined && column.search?.defaultValue !== null) {
    searchInitParam.value[column.search.key ?? handleProp(column.prop!)] = column.search?.defaultValue;
    searchParam.value[column.search.key ?? handleProp(column.prop!)] = column.search?.defaultValue;
  }
});

// 排序搜索表单项
searchColumns.sort((a, b) => a.search!.order! - b.search!.order!);

const colRef = ref();
const colSetting = tableColumns.value!.filter(
  (item) => !["selection", "index", "expand"].includes(item.type!) && item.prop !== "operation" && item.isShow
);
function openColSetting() {
  return colRef.value.openColSetting();
}

defineExpose({
  element: tableRef,
  tableData,
  searchParam,
  pageable,
  getData,
  reset,
  clearSelection,
  enumMap,
  isSelected,
  selectedList,
  selectedListIds,
});
</script>

<template>
  <!-- 查询表单 card -->
  <SearchForm
    v-show="isShowSearch"
    :search="search"
    :reset="reset"
    :search-param="searchParam"
    :columns="searchColumns"
    :search-col="searchCol"
  >
    <template v-if="$slots.searchButton" #searchButton>
      <slot name="searchButton" />
    </template>
  </SearchForm>

  <!-- 表格内容 card -->
  <div class="card table-main">
    <!-- 表格头部 操作按钮 -->
    <div class="table-header">
      <div class="header-button-lf">
        <slot name="tableHeader" :selected-list-ids="selectedListIds" :selected-list="selectedList" :is-selected="isSelected" />
      </div>
      <div v-if="toolButton" class="header-button-ri">
        <slot name="toolButton">
          <el-button :icon="Refresh" circle @click="getData" />
          <el-button v-if="columns.length" :icon="Operation" circle @click="openColSetting" />
          <el-button v-if="searchColumns.length" :icon="Search" circle @click="isShowSearch = !isShowSearch" />
        </slot>
      </div>
    </div>
    <!-- 表格主体 -->
    <ElTable
      ref="tableRef"
      v-bind="$attrs"
      :data="tableData"
      :border="border"
      :row-key="rowKey"
      @selection-change="selectionChange"
    >
      <!-- 默认插槽 -->
      <slot />
      <template v-for="item in tableColumns" :key="item">
        <!-- selection || index -->
        <el-table-column
          v-if="item.type == 'selection' || item.type == 'index'"
          v-bind="item"
          :align="item.align ?? 'center'"
          :reserve-selection="item.type == 'selection'"
        />
        <el-table-column v-if="item.type == 'expand'" v-slot="scope" v-bind="item" :align="item.align ?? 'center'">
          <component :is="item.render" v-bind="scope" v-if="item.render" />
          <slot v-else :name="item.type" v-bind="scope" />
        </el-table-column>
        <TableColumn v-if="!item.type && item.prop && item.isShow" :column="item">
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </TableColumn>
      </template>
      <template #append>
        <slot name="append" />
      </template>
      <template #empty>
        <el-empty :image-size="100" description="暂无数据"></el-empty>
      </template>
    </ElTable>
    <!-- 分页组件 -->
    <slot name="pagination">
      <Pagination
        v-if="pagination"
        :pageable="pageable"
        :handle-size-change="handleSizeChange"
        :handle-current-change="handleCurrentChange"
      />
    </slot>
  </div>
  <!-- 列设置 -->
  <ColSetting v-if="toolButton" ref="colRef" v-model:col-setting="colSetting" />
</template>
<style lang="scss">
.el-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.table-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.header-button-lf {
  float: left;

  .el-button {
    margin-bottom: 15px;
  }
}

.header-button-ri {
  float: right;

  .el-button {
    margin-bottom: 15px;
  }
}

.el-table thead {
  .cell {
    font-weight: normal !important;
    position: relative;
  }

  th:not(:first-of-type) {
    .cell {
      &::before {
        content: "";
        width: 1px;
        height: 12px;
        background-color: #ebeef5;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
      }
    }
  }
}

.el-table--small {
  .el-table__cell {
    padding: 8px 0;
  }
}
</style>
