<!-- 编辑用户 -->
<template>
  <Dialog v-model="dialogShow" title="设置角色" @confirm="confirm" @close="close">
    <CForm ref="cForm" :formJson="formJson" v-model="formData" />
  </Dialog>
</template>

<script setup lang="ts" name="add">
import api from "@/api";

interface Request {
  userId?: number;
  roleIdList: number[];
}

const dialogShow = ref(false);
const formJson = reactive({
  // 表单整体配置项
  config: {
    labelWidth: "70px",
  },
  rules: {
    roleIdList: [{ required: true, message: "请选择", trigger: "change" }],
  },
  // 表单列配置项 (formItem 代表 item 配置项，attrs 代表 输入、选择框 配置项)
  fields: {
    roleIdList: {
      formItem: {
        label: "用户角色",
      },
      attrs: {
        typeName: "select",
        clearable: true,
        multiple: true,
        placeholder: "请选择用户角色",
      },
      child: {
        typeName: "el-option",
        options: [],
        props: {
          label: "roleName",
          value: "roleId",
        },
      },
    },
  },
});
class formInit {
  userId = undefined;
  roleIdList = [];
}
const formData = ref<Request>(new formInit());

const cForm = ref();
const show = (row: Request) => {
  dialogShow.value = true;
  if (row.userId) {
    getUserInfo(row.userId);
  }
  getRole();
};
const getUserInfo = (id: number) => {
  api.get<anyObj>(`/user/${id}`).then((res) => {
    formData.value = {
      userId: res.userId,
      roleIdList: res.roleList.map((x: any) => {
        return x.roleId;
      }),
    };
  });
};
// 获取角色
const getRole = () => {
  api.get<[]>(`/role/all`).then((res) => {
    formJson.fields.roleIdList.child.options = res;
  });
};

const confirm = () => {
  cForm.value
    .submit()
    .then(async (data: any) => {
      await api.put(`/user/${data.userId}/roles`, [...data.roleIdList], { msg: true, loading: true });
      emit("updata");
      reset();
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
