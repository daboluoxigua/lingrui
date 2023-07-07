import type { ElForm } from "element-plus";

/**
 * 根据pk字段的值从数组中获取key
 * @param arr
 * @param pk
 * @param value
 */
export function getArrayKey(arr: any, pk: string, value: string): any {
  for (const key in arr) {
    if (arr[key][pk] === value) {
      return key;
    }
  }
  return false;
}

/**
 * 表单重置
 * @param formEl
 */
export function onResetForm(formEl: InstanceType<typeof ElForm> | undefined) {
  if (!formEl) {
    return;
  }
  formEl.resetFields && formEl.resetFields();
}
