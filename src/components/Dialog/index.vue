<template>
  <el-dialog
    :model-value="dialogVisible"
    :title="title"
    :width="width"
    :draggable="draggable"
    :before-close="handleClose"
    v-bind="attrs"
  >
    <template #header="{ close, titleId, titleClass }">
      <slot name="header" :close="close" :titleId="titleId" :titleClass="titleClass"></slot>
    </template>
    <slot></slot>
    <template #footer>
      <slot v-if="$slots.footer" name="footer"></slot>
      <span v-else class="dialog-footer">
        <el-button v-show="cancelButtonText" @click="handleCancel">{{ cancelButtonText }}</el-button>
        <el-button v-show="showConfirmButton" type="primary" @click="handleConfirm">{{ confirmButtonText }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
interface DialogParam {
  modelValue: boolean;
  attrs?: Object; //其他Dialog所支持的属性
  title?: string; // 弹窗标题
  width?: number | string; // 弹窗宽度 数字或者字符串
  draggable?: boolean; //是否可以拖拽
  showConfirmButton?: boolean; //是否展示确认按钮
  showCancelButton?: boolean; //是否展示取消按钮
  confirmButtonText?: string; //确认按钮文案
  cancelButtonText?: string; //取消按钮文案
}

// 接受父组件参数，配置默认值
const props = withDefaults(defineProps<DialogParam>(), {
  modelValue: true,
  title: "",
  width: "520px",
  draggable: true,
  showConfirmButton: true,
  showCancelButton: true,
  confirmButtonText: "确认",
  cancelButtonText: "取消",
});

const emit = defineEmits(["update:modelValue", "close", "confirm"]);

const handleClose = (done: () => void) => {
  emit("update:modelValue", false);
  emit("close");
  done();
};
const handleCancel = () => {
  emit("update:modelValue", false);
  emit("close");
};
const handleConfirm = () => {
  emit("confirm");
};

const dialogVisible: any = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    props.modelValue = newValue;
  },
});
</script>
<style scoped></style>
