<!-- 编辑用户 -->
<template>
  <Dialog v-model="dialogShow" :title="dialogTitle" @confirm="confirm" @close="close">
    <CForm ref="cForm" :formJson="formJson" v-model="formData" />
  </Dialog>
</template>

<script setup lang="ts" name="add">
import api from "@/api";
import type { Request } from "../interface/index";
const dialogTitle = ref<string>("");
const dialogShow = ref(false);
const formJson = reactive({
  // 表单整体配置项
  config: {
    labelWidth: "70px",
  },
  rules: {
    roleName: [{ required: true, message: "请输入", trigger: "blur" }],
    roleSign: [{ required: true, message: "请输入", trigger: "blur" }],
  },
  // 表单列配置项 (formItem 代表 item 配置项，attrs 代表 输入、选择框 配置项)
  fields: {
    roleName: {
      formItem: {
        label: "角色名称",
      },
      attrs: {
        typeName: "input",
        clearable: true,
        placeholder: "请输入角色名称",
      },
    },
    roleSign: {
      disabled: (data: Request) => {
        return !!data.roleId;
      },
      formItem: {
        label: "角色标识",
      },
      attrs: {
        typeName: "input",
        clearable: true,
        placeholder: "请输入角色标识",
      },
    },
    roleDesc: {
      formItem: {
        label: "描述",
      },
      attrs: {
        typeName: "input",
        clearable: true,
        placeholder: "请输入描述",
        autosize: { minRows: 2, maxRows: 4 },
        type: "textarea",
      },
    },
  },
});
class formInit {
  roleName = "";
  roleSign = "";
  roleDesc = "";
  isEnable = true;
}
const formData = ref<Request>(new formInit());

const cForm = ref();
const show = (title: string, row?: Request) => {
  dialogTitle.value = title;
  dialogShow.value = true;
  if (row) {
    formData.value = JSON.parse(JSON.stringify(row));
  }
};

const confirm = () => {
  cForm.value
    .submit()
    .then(async (data: any) => {
      if (data.roleId) {
        await api.put(`/role/${data.roleId}`, data, { msg: true, loading: true });
      } else {
        await api.post("/role", data, { msg: true, loading: true });
      }

      reset();
      emit("updata");
    })
    .catch((error: string) => {
      console.log(error);
    });
};

const close = () => {
  reset();
  console.log("关闭弹窗");
};
// 重置表单
const reset = () => {
  cForm.value.reset();
  formData.value = new formInit();
  dialogShow.value = false;
};

const emit = defineEmits(["updata"]);
defineExpose({ show });
</script>
<style lang="scss" scoped></style>
