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
    userName: [{ required: true, message: "请输入", trigger: "blur" }],
    nickName: [{ required: true, message: "请输入", trigger: "blur" }],
    password: [{ required: true, message: "请输入", trigger: "blur" }],
    mobile: [{ required: true, message: "请输入", trigger: "blur" }],
    email: [{ required: true, message: "请输入", trigger: "blur" }],
    orgId: [{ required: true, message: "请输入", trigger: "change" }],
    sex: [{ required: true, message: "请输入", trigger: "change" }],
    roleIdList: [{ required: true, message: "请选择", trigger: "change" }],
  },
  // 表单列配置项 (formItem 代表 item 配置项，attrs 代表 输入、选择框 配置项)
  fields: {
    userName: {
      disabled: (data: Request) => {
        return !!data.userId;
      },
      formItem: {
        label: "登录名",
      },
      attrs: {
        typeName: "input",
        clearable: true,
        placeholder: "请输入登录名",
      },
    },
    nickName: {
      formItem: {
        label: "昵称",
      },
      attrs: {
        typeName: "input",
        clearable: true,
        placeholder: "请输入昵称",
      },
    },
    orgId: {
      show: (data: Request) => {
        return !data.userId;
      },
      formItem: {
        label: "所属组织",
        required: true,
      },
      attrs: {
        typeName: "tree-select",
        clearable: true,
        placeholder: "请选择父级组织",
        data: [],
        "check-strictly": true,
        props: {
          label: "name",
          value: "id",
          children: "childOrgList",
        },
      },
    },
    orgName: {
      disabled: () => {
        return true;
      },
      show: (data: Request) => {
        return data.userId;
      },
      formItem: {
        label: "所属组织",
      },
      attrs: {
        typeName: "input",
      },
    },
    password: {
      show: (data: Request) => {
        return !data.userId;
      },
      formItem: {
        label: "登录密码",
      },
      attrs: {
        typeName: "input",
        clearable: true,
        placeholder: "请输入登录密码",
        "show-password": true,
      },
    },
    sex: {
      formItem: {
        label: "性别",
      },
      attrs: {
        typeName: "radio-group",
      },
      child: {
        typeName: "el-radio",
        options: [
          {
            label: "男",
            value: "male",
          },
          {
            label: "女",
            value: "female",
          },
        ],
      },
    },
    mobile: {
      formItem: {
        label: "手机号",
      },
      attrs: {
        typeName: "input",
        clearable: true,
        placeholder: "请输入手机号",
      },
    },
    email: {
      formItem: {
        label: "邮箱地址",
      },
      attrs: {
        typeName: "input",
        clearable: true,
        placeholder: "请输入邮箱地址",
      },
    },
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
  userName = "";
  nickName = "";
  password = "";
  mobile = "";
  email = "";
  orgId = undefined;
  sex = "male";
  roleIdList = [];
}
const formData = ref<Request>(new formInit());

const cForm = ref();
const show = (title: string, row?: Request) => {
  dialogTitle.value = title;
  dialogShow.value = true;
  if (row?.userId) {
    getUserInfo(row.userId);
  }

  getRole();
  getOrgTree(row?.orgId);
};

const getUserInfo = (id: number) => {
  api.get<Request>(`/user/${id}`).then((res) => {
    formData.value = res;
    formData.value.roleIdList = res.roleList;
  });
};
// 获取组织树
const getOrgTree = (orgId?: number) => {
  api.get<[]>(`/org/tree`, { orgId: orgId || 1 }).then((res) => {
    formJson.fields.orgId.attrs.data = res;
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
      if (data.userId) {
        await api.put(`/user/${data.userId}`, data, { msg: true, loading: true });
      } else {
        await api.post("/user", data, { msg: true, loading: true });
      }
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
