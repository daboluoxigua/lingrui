<!--  -->
<template>
  <div>
    <el-drawer :title="title" v-model="drawer" size="520px" :close-on-click-modal="false" :before-close="handleClose">
      <el-form ref="formRef" class="form" label-width="91px" :rules="rules" :model="form">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单英文名" prop="menuNameEn">
          <el-input v-model="form.menuNameEn" placeholder="请输入菜单英文名" />
        </el-form-item>
        <el-form-item label="所属模块" prop="menuModule">
          <el-input v-model="form.menuModule" placeholder="请输入所属模块" />
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-tree-select
            v-model="form.parentId"
            :data="treeList"
            node-key="menuId"
            :render-after-expand="false"
            @change="changeSelectTree"
            :props="defaultProps"
            clearable
            check-strictly
          />
          <!-- <selectTree v-model="form.parentId" :set-value="form.parentId" :tree-list="treeList" @change="changeSelectTree" /> -->
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon" placeholder="请输入图标名称" />
        </el-form-item>
        <el-form-item label="路由地址">
          <el-input v-model="form.url" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item label="组件路径">
          <el-input v-model="form.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="选中菜单路径">
          <el-input v-model="form.active" placeholder="请输入选中菜单路径" />
        </el-form-item>
        <el-form-item label="是否外链">
          <el-switch v-model="form.externalInd" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
        <el-form-item label="是否显示">
          <el-switch v-model="form.isHidden" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
        <el-form-item label="是否显示面包屑">
          <el-switch v-model="form.breadcrumb" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="form.enabledInd" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="submitForm(formRef)">确 定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="editMenu">
import type { Request, TypeProps } from "../interface/index";
import type { FormInstance, FormRules } from "element-plus";
import api from "@/api";

const defaultProps = {
  children: "children",
  label: "menuName",
};
const title = ref("新增菜单");
const formInline: Request = {
  menuName: "",
  menuNameEn: "",
  active: "",
  component: "",
  enabledInd: true,
  breadcrumb: true,
  externalInd: false,
  icon: "",
  isHidden: true,
  parentId: undefined,
  perIdentity: "",
  sort: 1,
  type: "menu",
  url: "",
  menuModule: "",
};
const form = ref<Request>(formInline);
const rules: FormRules = {
  menuNameEn: [{ required: true, message: "请输入菜单英文名称", trigger: "blur" }],
  menuName: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
  url: [{ required: true, message: "请输入路由地址", trigger: "blur" }],
  component: [{ required: true, message: "请输组件路径", trigger: "blur" }],
};
const platformModule = ref();
const drawer = ref(false);
const treeList = ref();

const show = (type: TypeProps, row: Request) => {
  if (row) {
    form.value = JSON.parse(JSON.stringify(row));
  } else {
    title.value = "编辑菜单";
  }

  platformModule.value = type;
  drawer.value = true;
  getTreeList();
};

const getTreeList = () => {
  api.get(`/menu/tree`).then((res) => {
    treeList.value = res;
  });
};

const changeSelectTree = (e) => {
  if (e === form.value.menuId) {
    e = null;
  }
};

const formRef = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      if (form.value?.children) {
        delete form.value.children;
      }
      api.post(`/menu/saveOrUpdate`, form.value, { msg: true }).then(() => {
        emit("updata");
        handleClose();
      });
    } else {
      console.log("error submit!!");
      return false;
    }
  });
};

const handleClose = () => {
  if (!formRef.value) return;
  formRef.value.resetFields();
  form.value = formInline;
  drawer.value = false;
};

const emit = defineEmits(["updata"]);
defineExpose({ show });
</script>
<style lang="scss" scoped></style>
