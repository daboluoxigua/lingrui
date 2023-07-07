<template>
  <component
    :is="'el-form'"
    v-bind="formJson.config"
    :size="settingsStore.settings.app.elementSize"
    ref="formRef"
    :rules="formJson.rules"
    :model="modelValue"
  >
    <template v-for="(item, key) in formJson.fields" :key="key">
      <component :is="'el-form-item'" v-bind="item.formItem" :prop="key" v-if="item.show ? item.show(modelValue) : true">
        <component
          :is="`el-${item.attrs.typeName}`"
          :disabled="item.disabled ? item.disabled(modelValue) : false"
          v-bind="item.attrs"
          v-on="item.events || {}"
          v-model="modelValue[key]"
        >
          <template #default="{ node, data }" v-if="item.attrs.typeName === 'cascader'">
            <span>{{ data[item.attrs.props.label || "label"] }}</span>
          </template>
          <template v-if="!!item.child">
            <template v-if="item.child?.typeName === 'el-radio'">
              <component
                :is="'el-radio'"
                v-for="(op, index) in item.child?.options"
                :key="index"
                :label="op[item.child.props?.value] || op.value"
              >
                {{ op[item.child.props?.label] || op.label }}
              </component>
            </template>
            <template v-else>
              <component
                :is="item.child?.typeName"
                v-for="(op, index) in item.child?.options"
                :key="index"
                :label="op[item.child.props?.label] || op.label"
                :value="op[item.child.props?.value] || op.value"
              />
            </template>
          </template>
        </component>
      </component>
    </template>
    <el-form-item v-if="$slots.operation">
      <slot name="operation"></slot>
    </el-form-item>
  </component>
</template>

<script setup lang="ts" name="CForm">
import type { FormInstance } from "element-plus";
import useSettingsStore from "@/store/modules/settings";
const settingsStore = useSettingsStore();
// 接受父组件参数，配置默认值

interface formProps {
  modelValue?: { [key: string]: any };
  formJson: any;
}

// 默认值
const props = withDefaults(defineProps<formProps>(), {
  modelValue: () => ({}),
  formJson: {},
});
console.log(props.formJson);
const formRef = ref<FormInstance>();
const submit = () => {
  return new Promise(async (resolve, reject) => {
    if (!formRef.value) return;
    await formRef.value.validate((valid, fields) => {
      if (valid) {
        resolve(props.modelValue);
      } else {
        reject(fields);
      }
    });
  });
};

const reset = () => {
  if (!formRef.value) return;
  formRef.value.resetFields();
  props.modelValue = {};
};

onUnmounted(() => {
  reset();
});

defineExpose({ submit, reset, formRef });
</script>
