<!--  -->
<template>
  <div class="upload">
    <el-upload
      ref="upload"
      :file-list="fileList"
      :disabled="disabled"
      :headers="{ 'X-AUTH': token }"
      :action="uploadUrl"
      :limit="limit"
      :accept="accept"
      :show-file-list="showFileList"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :on-progress="handleProgress"
      v-loading="loading"
    >
      <template #trigger>
        <el-button :disabled="disabled"
          ><el-icon><Upload /></el-icon> 上传文件</el-button
        >
      </template>
    </el-upload>
  </div>
</template>

<script setup lang="ts" name="upload">
import { genFileId } from "element-plus";
import type { UploadProps, UploadRawFile, UploadInstance } from "element-plus";
import useUserStore from "@/store/modules/user";
import { fa } from "element-plus/es/locale";
const userStore = useUserStore();
const token = userStore.token;
const upload = ref<UploadInstance>();
const { proxy } = getCurrentInstance() as any;
defineProps({
  modelValue: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  showFileList: { type: Boolean, default: false },
  // 数量
  limit: { type: Number, default: 1 },
  // 文件类型
  accept: { type: String, default: "" },
  fileList: {
    type: Array,
    default: () => [],
  },
  uploadUrl: { type: String, default: `` },
});

const loading = ref(false);
const beforeUpload: UploadProps["beforeUpload"] = (file) => {
  const size = 4;
  const isLt10M = file.size / 1024 / 1024 < (size || 10);
  if (!isLt10M) {
    proxy.$message({ message: `上传文件不能超过 ${size}MB!`, type: "error" });
  }

  return isLt10M;
};
const handleProgress = () => {
  loading.value = true;
};
const onSuccess: UploadProps["onSuccess"] = (res) => {
  if (res.success) {
    emit("path", res.data);
    emit("name", res.data);
    if (res.data?.fileMd5) {
      emit("update:modelValue", res.data.fileMd5);
    }

    proxy.$message({ message: res.msg, type: "success" });
  } else {
    proxy.$message({ message: res.msg, type: "error" });
  }

  upload.value!.clearFiles();
  loading.value = false;
};
const onError: UploadProps["onError"] = (err, file, fileList) => {
  upload.value!.clearFiles();
  loading.value = false;
};
const handleRemove: UploadProps["onRemove"] = (file, fileList) => {
  emit("remove");
  emit("update:modelValue", "");
};
const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};
const emit = defineEmits(["path", "name", "update:modelValue", "remove", "change"]);
</script>
<style lang="scss" scoped>
.upload {
  width: 100%;
}
</style>
