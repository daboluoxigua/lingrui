<template>
  <PageMain>
    <CTable
      ref="tableRef"
      :columns="columns"
      :request-api="getTableList"
      :dataCallback="dataCallback"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      row-key="menuId"
      :pagination="false"
    >
      <template #searchButton>
        <el-button type="primary" @click="editMenuFn()">新增菜单</el-button>
        <!-- <el-button type="primary" @click="logoShow">logo设置</el-button> -->
      </template>

      <!-- 表格操作 -->
      <template #operation="scope">
        <div class="table-btn-list">
          <el-button type="primary" link @click="editMenuFn(scope.row)">编辑</el-button>
          <div class="divider"></div>
          <el-button type="primary" link @click="delFn(scope.row)">删除</el-button>
          <div class="divider"></div>
          <el-button type="primary" link>按钮管理</el-button>
          <!-- <div class="divider"></div>
          <el-button type="primary" link icon="Refresh">设置项目菜单</el-button> -->
        </div>
      </template>
    </CTable>

    <!-- 编辑菜单 -->
    <editMenu ref="editMenuRef" @updata="updata" />
    <!-- logo -->
    <!-- <logo ref="logoRef" /> -->
  </PageMain>
</template>

<script setup lang="tsx" name="menu">
import type { Request } from "./interface/index";
import { useHandleData } from "@/hooks/useHandleData";

import editMenu from "./drawer/editMenu.vue";
// import logo from "./drawer/logo.vue";

import api from "@/api";
import { ColumnProps } from "@/components/CTable/interface";

const rowData = ref<Request>();
const tableRef = ref();

const dataCallback = (data: any, param: any) => {
  return searchChild(data, param.menuName);
};
const searchChild = (data: Request[], searchKey: string) => {
  //深拷贝防止改变源数据
  let sourceDto = JSON.parse(JSON.stringify(data));
  if (!!searchKey) {
    data = childrenFn(sourceDto, searchKey) || [];
  } else {
    data = sourceDto;
  }

  return data;
};
/**
 * @param arr 传入的树结构
 * @param key 需要搜索的关键字
 */
const childrenFn = (arr: any[], key: string) => {
  let searchTree: any[] = [];
  arr.forEach((item) => {
    if (item.children != undefined && item.children.length != 0) {
      let leaf = childrenFn(item.children, key);
      //如果叶子节点为空，说明没找到，去找一下叶子节点的上一级
      if (leaf != undefined) {
        let { menuName, menuId, parentId } = item;
        let parentObj = {
          menuId,
          menuName,
          parentId,
          children: leaf,
        };
        searchTree.push(parentObj);
      } else {
        //如果是中间节点有关键字，把中间节点作为叶子节点往回传
        if (item.menuName.indexOf(key) != -1) {
          // delete item["children"];
          searchTree.push(item);
        }
      }
    } else {
      //如果是最后一级，回传
      if (item.menuName.indexOf(key) != -1) {
        searchTree.push(item);
      }
    }
  });

  if (searchTree != undefined && searchTree.length != 0) {
    return searchTree;
  }
};
const getTableList = (params: any) => {
  return api.get(`/menu/tree`, params, { loading: true });
};

// 表格配置项
const columns: ColumnProps[] = [
  {
    label: "菜单名称",
    prop: "menuName",
    align: "left",
    search: {
      el: "input",
      props: { filterable: false, "suffix-icon": "Search" },
    },
  },
  // { label: "菜单英文名称", prop: "menuNameEn", align: "left" },
  { label: "路由地址", prop: "url", align: "left" },
  { label: "组件路径", prop: "component", align: "left" },
  { label: "排序", prop: "sort" },
  { label: "图标", prop: "icon" },
  {
    label: "是否显示",
    prop: "icon",
    align: "left",
    render: (scope) => {
      return (
        <el-icon size={16} color={scope.row.isHidden ? "#2BD84C" : "#b7b7b7"}>
          {scope.row.isHidden ? <SuccessFilled /> : <CircleCloseFilled />}
        </el-icon>
      );
    },
  },
  { prop: "operation", label: "操作", fixed: "right", width: 160 },
];

// 更新数据
const updata = () => {
  tableRef.value.getData();
};

// 编辑菜单
const editMenuRef = ref();
const editMenuFn = (row?: Request) => {
  editMenuRef.value.show("platform", row);
};

// 删除
const delFn = async (row: Request) => {
  rowData.value = row;
  await useHandleData(deleteApi, {}, `删除【${row.menuName}】用户`);
  tableRef.value.getData();
};
const deleteApi = () => {
  if (!rowData.value) return;
  return api.delete(`/menu/${rowData.value.menuId}`);
};
</script>
