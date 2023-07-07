<script setup lang="ts" name="Pagination">
import useSettingsStore from "@/store/modules/settings";

interface Pageable {
  pageIndex: number;
  pageSize: number;
  total: number;
  layout?: string;
}

interface PaginationProps {
  pageable: Pageable;
  handleSizeChange: (size: number) => void;
  handleCurrentChange: (currentPage: number) => void;
}
const settingsStore = useSettingsStore();

defineProps<PaginationProps>();
</script>

<template>
  <!-- 分页组件 -->
  <el-pagination
    :background="true"
    :small="settingsStore.settings.app.elementSize === 'small'"
    :current-page="pageable.pageIndex"
    :page-size="pageable.pageSize"
    :page-sizes="[10, 25, 50, 100]"
    :total="pageable.total"
    :layout="pageable.layout || 'total, sizes, prev, pager, next'"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>
