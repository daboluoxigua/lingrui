<!--  -->
<template>
  <el-drawer title="设置权限" :close-on-click-modal="false" v-model="drawer" direction="rtl" size="480px">
    <el-form ref="form" class="form" label-width="76px" @submit.prevent>
      <el-form-item label="菜单过滤">
        <el-input v-model="filterText" placeholder="请输入菜单名称" />
      </el-form-item>
      <el-form-item label="设置权限">
        <template #label>
          <span>设置权限</span>
          <el-tooltip effect="dark" placement="top">
            <template #content> 勾选菜单\按钮即可设置此角色可见菜单、可操作按钮权限 </template>
            <span class="iconfont iconquestion-circle" />
          </el-tooltip>
        </template>
        <div class="borderLine">
          <div class="title">
            <el-checkbox v-model="checkedTree" :indeterminate="isIndeterminate" @change="checkTree">全选或反选</el-checkbox>
          </div>
          <div class="scroll">
            <el-tree
              ref="treeRef"
              :data="treeMenu"
              show-checkbox
              node-key="menuId"
              default-expand-all
              :default-checked-keys="useCheckedKeys"
              :props="defaultProps"
              class="permissionTree"
              :check-strictly="true"
              :render-content="renderContent"
              @check="checkChange"
              :filter-node-method="filterNode"
            />
          </div>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="footer">
        <el-button @click="resetForm">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="permissionConfig">
import { ElTree } from "element-plus";
import type Node from "element-plus/es/components/tree/src/model/node";
import type { TreeType } from "./interface/index";
import api from "@/api";

interface CustomNode extends Node {
  menuId: number;
}
interface Tree {
  id: number;
  label: string;
  children?: Tree[];
}

const drawer = ref(false);
const treeRef = ref<InstanceType<typeof ElTree>>();
const isIndeterminate = ref(false);
const checkedTree = ref(false);
// tree 属性
const treeMenu = ref<TreeType[]>([]);
// 选中的
const useCheckedKeys = ref<number[]>([]);
const defaultProps = {
  children: "children",
  label: "menuName",
  type: "type",
};

const filterText = ref("");
const allId = ref<number[]>([]);
const roleId = ref();
const removeData = ref<TreeType[]>([]);

watch(filterText, (val) => {
  treeRef.value!.filter(val);
});
// 菜单过滤
const filterNode = (value: string, data: any, node: Node) => {
  let names = getParents(node, node.data.menuName, "menuName");
  let isName = names.indexOf(value) !== -1;
  return !value || isName ? true : false;
};
const getParents: any = (node: Node, name: string, key: string) => {
  if (node.parent && node.parent.data[key]) {
    name += node.parent.data[key];
    return getParents(node.parent, name, key);
  }
  return name;
};

const renderContent = (
  h: any,
  {
    node,
    data,
  }: {
    node: Node;
    data: TreeType;
  }
) => {
  if (data.isHidden) {
    return h(
      "span",
      { class: "nodeBox" },
      h("span", {
        class: "iconfont icona-zu6063",
        style: data.type !== "button" ? "display:none" : "color:#1890FF",
      }),
      h("span", data.menuName)
    );
  } else {
    remove(node, data);
    removeData.value.push(data);
  }
};
const remove = (node: Node, data: TreeType) => {
  const parent = node.parent;
  const children = parent.data.children || parent.data;
  const index = children.findIndex((d: TreeType) => d.menuId === data.menuId);
  children.splice(index, 1);
};
const show = (val: anyObj) => {
  roleId.value = val.roleId;
  drawer.value = true;
  useCheckedKeys.value = [];
  removeData.value = [];
  getMenu();
};

const getMenu = () => {
  api.get<[]>(`/role/${roleId.value}/menu`).then((res) => {
    const mapFn = (arr: any[]) => {
      // eslint-disable-next-line array-callback-return
      arr.map((item) => {
        if (item.perIdentity === "project_config") {
          delete item.children;
        } else {
          if (item.children && item.children.length > 0) {
            mapFn(item.children);
          }
        }
      });
    };
    mapFn(res);
    treeMenu.value = res;
    // 筛选已经勾选的权限
    const data: any[] = [];
    allId.value = [];
    const getMenuName = (menus: TreeType[]) => {
      for (const value of menus) {
        allId.value.push(value.menuId);
        if (value.flag) {
          data.push(value.menuId);
        }
        if (value.children && value.children.length > 0) {
          getMenuName(value.children);
        }
      }
    };
    getMenuName(treeMenu.value);

    useCheckedKeys.value = data;
    isIndeterminate.value = allId.value.length !== useCheckedKeys.value.length && useCheckedKeys.value.length > 0;
    checkedTree.value = useCheckedKeys.value.length > 0;
  });
};
// 全选或反选
const checkTree = () => {
  if (checkedTree.value) {
    treeRef.value!.setCheckedKeys(allId.value);
  } else {
    treeRef.value!.setCheckedKeys([]);
    isIndeterminate.value = false;
  }
};
const checkChange = (node: TreeType, { checkedKeys }: { checkedKeys: any[] }) => {
  const isChecked = checkedKeys.includes(node.menuId);
  isIndeterminate.value = allId.value.length !== checkedKeys.length;
  // 循环太多了 全选时不要执行下面代码
  if (checkedTree.value && !isIndeterminate.value) return;
  // 获取所有下级节点
  const childrenKeys: number[] = [];
  const loop = (data: TreeType[] = []) => {
    data.forEach((item: TreeType) => {
      childrenKeys.push(item.menuId);
      if (item.children) {
        loop(item.children);
      }
    });
  };
  if (node.children) {
    loop(node.children);
  }
  if (isChecked) {
    const keys: number[] = [];

    // 查找所有父节点
    const treeFindPath: Function = (tree: TreeType[], func: Function, path: number[] = []) => {
      if (!tree) return [];
      for (const data of tree) {
        // 这里按照你的需求来存放最后返回的内容吧
        path.push(data.menuId);
        if (func(data)) return path;
        if (data.children) {
          const findchildren = treeFindPath(data.children, func, path);
          if (findchildren.length) return findchildren;
        }
        path.pop();
      }
      return [];
    };

    // 获取父节点
    console.log(checkedKeys);
    checkedKeys.forEach((item) => {
      keys.push(...treeFindPath(treeMenu.value, (data: any) => data.menuId === item));
    });

    treeRef.value!.setCheckedKeys([...new Set(keys), ...childrenKeys]);
  } else {
    const keys: CustomNode[] = [];
    checkedKeys.forEach((item: any) => {
      keys.push(item);
    });
    // 取消时 同时取消下级节点
    if (node.children) {
      const aSet = new Set([...new Set(keys)]);
      const bSet = new Set(childrenKeys);
      // 交集
      const intersect = [...aSet].filter((ele: any) => bSet.has(ele));

      // 在求差集
      const difference: any = [...aSet].filter((ele) => !new Set(intersect).has(ele));

      treeRef.value!.setCheckedKeys(difference);
    }
  }

  checkedTree.value = treeRef.value!.getCheckedNodes().length > 0;

  isIndeterminate.value =
    allId.value.length - removeData.value.length !== treeRef.value!.getCheckedNodes().length &&
    treeRef.value!.getCheckedNodes().length > 0;
};
const submitForm = () => {
  const menuIdList = treeRef.value!.getCheckedKeys(); // 选中的
  removeData.value.forEach((item: any) => {
    // 被隐藏的节点 父节点被勾选，需要也被勾选
    if (menuIdList.includes(item.parentId) && !menuIdList.includes(item.menuId)) {
      menuIdList.push(item.menuId);
    }
  });
  api.put(`/role/${roleId.value}/res`, [...menuIdList], { loading: true, msg: true }).then((res) => {
    resetForm();
  });
};
const resetForm = () => {
  treeMenu.value = [];
  drawer.value = false;
};

//
defineExpose({ show });
</script>
<style lang="scss" scoped>
.borderLine {
  border: 1px solid var(--g-border-color);
  width: 100%;

  .title {
    padding: 0 10px;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid rgb(0 0 0 / 6%);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .scroll {
    max-height: 480px;
    overflow: auto;
    padding: 0 10px;
    margin: 10px 0;
  }
}

.el-checkbox-group .el-checkbox {
  line-height: 25px;
}
</style>
