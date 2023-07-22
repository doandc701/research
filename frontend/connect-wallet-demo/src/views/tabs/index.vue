<script setup lang="ts">
import { ref, computed } from "vue";
import { transformI18n } from "/@/plugins/i18n";
import { TreeSelect } from "@pureadmin/components";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import {
  deleteChildren,
  appendFieldByUniqueId,
  getNodeByUniqueId
} from "@pureadmin/utils";
import { nullCoalescing } from "/@/utils";
import { useDetail } from "./hooks";

defineOptions({
  name: "Tabs"
});

const { toDetail, router } = useDetail();

let treeData = computed(() => {
  return appendFieldByUniqueId(
    deleteChildren(usePermissionStoreHook().menusTree),
    0,
    { disabled: true }
  );
});

const value = ref<string[]>([]);

let multiTags = computed(() => {
  return useMultiTagsStoreHook().multiTags;
});

function onCloseTags() {
  value.value.forEach(uniqueId => {
    let currentPath = nullCoalescing(
      getNodeByUniqueId(treeData.value, uniqueId).redirect,
      getNodeByUniqueId(treeData.value, uniqueId).path
    );
    useMultiTagsStoreHook().handleTags("splice", currentPath);
    if (currentPath === "/tabs/index")
      router.push({
        path: multiTags.value[(multiTags as any).value.length - 1].path
      });
  });
}
</script>

<template>
  <el-card>
    <template #header>
      <div>
        Sử dụng lại trang tab, tự động đóng khi vượt quá giới hạn (sử dụng kịch
        bản: định tuyến động)
      </div>
    </template>
    <el-button v-for="index in 6" :key="index" @click="toDetail(index)">
      Mở {{ index }} trang chi tiết
    </el-button>
    <el-divider />
    <TreeSelect
      class="w-300px"
      v-model:value="value"
      show-search
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      placeholder="Vui lòng chọn một tab để đóng"
      :fieldNames="{
        children: 'children',
        key: 'uniqueId',
        value: 'uniqueId'
      }"
      allow-clear
      multiple
      tree-default-expand-all
      :tree-data="treeData"
    >
      <template #tagRender="{ closable, onClose, option }">
        <el-tag class="mr-3px" :closable="closable" @close="onClose">
          {{ transformI18n(option.meta.title) }}
        </el-tag>
      </template>

      <template #title="{ data }">
        <span>{{ transformI18n(data.meta.title) }}</span>
      </template>
    </TreeSelect>
    <el-button class="ml-2" @click="onCloseTags">đóng tab</el-button>
    <br />
    <p class="mt-4">
      Lưu ý: Bản trình diễn này không mở bộ nhớ cache của tab, nếu bạn cần
      <span class="text-red-500">làm mới trang</span>
      đồng thời
      <span class="text-red-500">giữ các tab hiển thị</span>
      hoặc
      <span class="text-red-500">giữ các thông số của url</span>, sau đó bạn cần
      kích hoạt tính năng ổn định của tab.
      <br />
      Cách mở: Có một biểu tượng nhỏ cho cài đặt ở góc trên bên phải của trang,
      nhấp vào nó, bạn sẽ thấy bảng cấu hình dự án, tìm sự kiên trì của trang
      tab và bật nó lên.
    </p>
  </el-card>
</template>
