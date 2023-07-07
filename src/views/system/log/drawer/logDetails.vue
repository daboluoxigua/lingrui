<!--  -->
<template>
  <div>
    <el-drawer :title="title" v-model="drawer" size="50%" :close-on-click-modal="false" :before-close="handleClose">
      <el-collapse>
        <el-collapse-item v-for="item in data" :key="item.auditId" :title="item.actions" :name="item.auditId">
          <template #title>
            <div class="title">
              <span>{{ item.actions }}</span>
              <span class="color-info">{{ item.createTime }}</span>
            </div>
          </template>
          <div class="logBox">
            {{ item.operation }}
          </div>
        </el-collapse-item>
      </el-collapse>
      <template #footer>
        <div class="footer">
          <el-button @click="handleClose">关 闭</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="logDetails">
import api from "@/api";
const drawer = ref(false);
const title = ref("查看操作详情");
const data = ref();
const show = (id: number) => {
  drawer.value = true;
  api.get(`/audit_log/logList/${id}`).then((res) => {
    data.value = res;
  });
};

const handleClose = () => {
  drawer.value = false;
};

const emit = defineEmits(["updata"]);
defineExpose({ show });
</script>
<style lang="scss" scoped>
.title {
  padding-left: 4px;
}

.color-info {
  color: var(--g-el-text-color-info);
  margin-left: 10px;
}

.logBox {
  background: #fafafaff;
  border: 1px solid var(--g-border-color);
  padding: 8px 11px;
  color: var(--g-el-text-color);
  white-space: break-spaces;
  word-wrap: break-word;
}
</style>
