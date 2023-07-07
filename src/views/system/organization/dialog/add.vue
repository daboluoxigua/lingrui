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
    name: [{ required: true, message: "请输入", trigger: "blur" }],
    orgCode: [{ required: true, message: "请输入", trigger: "blur" }],
    parentId: [{ required: true, message: "请输入", trigger: "blur" }],
  },
  // 表单列配置项 (formItem 代表 item 配置项，attrs 代表 输入、选择框 配置项)
  fields: {
    orgCode: {
      disabled: (data: Request) => {
        return !!data.id;
      },
      formItem: {
        label: "组织编码",
        required: true,
      },
      attrs: {
        typeName: "input",
        clearable: true,
        placeholder: "请输入组织编码",
      },
    },
    name: {
      formItem: {
        label: "组织名称",
        required: true,
      },
      attrs: {
        typeName: "input",
        clearable: true,
        placeholder: "请输入组织名称",
      },
    },
    parentId: {
      disabled: (data: Request) => {
        return !!data.id;
      },
      formItem: {
        label: "上级组织",
        required: true,
      },
      attrs: {
        typeName: "cascader",
        clearable: true,
        placeholder: "请选择上级组织",
        props: {
          label: "name",
          value: "id",
          children: "childOrgList",
        },
        options: [],
      },
    },
  },
});
class formInit {
  name = "";
  parentId = "";
  orgCode = "";
}
const formData = ref<Request>(new formInit());

const cForm = ref();
const show = (title: string, row?: Request) => {
  dialogTitle.value = title;
  dialogShow.value = true;
  if (row) {
    formData.value = JSON.parse(JSON.stringify(row));
  }

  getOrgTree();
};

// 获取组织树
const getOrgTree = () => {
  api.get<[]>(`/org/tree`, { orgId: 1 }).then((res) => {
    formJson.fields.parentId.attrs.options = res;
  });
};

const confirm = () => {
  cForm.value
    .submit()
    .then(async (data: any) => {
      if (data.id) {
        await api.put(`/org/${data.id}/`, data, { msg: true, loading: true });
      } else {
        await api.post("/org", data, { msg: true, loading: true });
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
