<script lang="ts" setup>
import { useRouter } from "vue-router";
import SearchResult from "./SearchResult.vue";
import SearchFooter from "./SearchFooter.vue";
import { useNav } from "/@/layout/hooks/useNav";
import { transformI18n } from "/@/plugins/i18n";
import { deleteChildren } from "@pureadmin/utils";
import { useDebounceFn, onKeyStroke } from "@vueuse/core";
import { ref, watch, computed, nextTick, shallowRef } from "vue";
import { usePermissionStoreHook } from "/@/store/modules/permission";

interface Props {
  /** pop-up window */
  value: boolean;
}

interface Emits {
  (e: "update:value", val: boolean): void;
}

const { device } = useNav();
const emit = defineEmits<Emits>();
const props = withDefaults(defineProps<Props>(), {});
const router = useRouter();

const keyword = ref("");
const activePath = ref("");
const inputRef = ref<HTMLInputElement | null>(null);
const resultOptions = shallowRef([]);
const handleSearch = useDebounceFn(search, 300);

/** cấu trúc cây menu */
const menusData = computed(() => {
  return deleteChildren(usePermissionStoreHook().menusTree);
});

const show = computed({
  get() {
    return props.value;
  },
  set(val: boolean) {
    emit("update:value", val);
  }
});

watch(show, async val => {
  if (val) {
    /** auto focus */
    await nextTick();
    inputRef.value && inputRef.value.focus();
  }
});

/** Làm phẳng cấu trúc cây menu thành mảng một chiều cho truy vấn menu */
function flatTree(arr) {
  const res = [];
  function deep(arr) {
    arr.forEach(item => {
      res.push(item);
      item.children && deep(item.children);
    });
  }
  deep(arr);
  return res;
}

/** query */
function search() {
  const flatMenusData = flatTree(menusData.value);
  resultOptions.value = flatMenusData.filter(
    menu =>
      keyword.value &&
      transformI18n(menu.meta && menu.meta.title)
        .toLocaleLowerCase()
        .includes(keyword.value.toLocaleLowerCase().trim())
  );
  if (resultOptions.value && resultOptions.value.length > 0) {
    activePath.value = resultOptions.value[0].path;
  } else {
    activePath.value = "";
  }
}

function handleClose() {
  show.value = false;
  /** Trì hoãn xử lý để ngăn người dùng nhìn thấy các hành động nhất định */
  setTimeout(() => {
    resultOptions.value = [];
    keyword.value = "";
  }, 200);
}

/** key up */
function handleUp() {
  const { length } = resultOptions.value;
  if (length === 0) return;
  const index = resultOptions.value.findIndex(
    item => item.path === activePath.value
  );
  if (index === 0) {
    activePath.value = resultOptions.value[length - 1].path;
  } else {
    activePath.value = resultOptions.value[index - 1].path;
  }
}

/** key down */
function handleDown() {
  const { length } = resultOptions.value;
  if (length === 0) return;
  const index = resultOptions.value.findIndex(
    item => item.path === activePath.value
  );
  if (index + 1 === length) {
    activePath.value = resultOptions.value[0].path;
  } else {
    activePath.value = resultOptions.value[index + 1].path;
  }
}

/** key enter */
function handleEnter() {
  const { length } = resultOptions.value;
  if (length === 0 || activePath.value === "") return;
  router.push(activePath.value);
  handleClose();
}

onKeyStroke("Enter", handleEnter);
onKeyStroke("ArrowUp", handleUp);
onKeyStroke("ArrowDown", handleDown);
</script>

<template>
  <el-dialog
    top="5vh"
    :width="device === 'mobile' ? '80vw' : '50vw'"
    v-model="show"
    :before-close="handleClose"
  >
    <el-input
      ref="inputRef"
      v-model="keyword"
      clearable
      placeholder="Please enter a keyword to search"
      @input="handleSearch"
    >
      <template #prefix>
        <span class="el-input__icon">
          <IconifyIconOffline icon="search" />
        </span>
      </template>
    </el-input>
    <div class="search-result-container">
      <el-empty
        v-if="resultOptions.length === 0"
        description="No search results yet"
      />
      <SearchResult
        v-else
        v-model:value="activePath"
        :options="resultOptions"
        @click="handleEnter"
      />
    </div>
    <template #footer>
      <SearchFooter />
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
.search-result-container {
  margin-top: 20px;
}
</style>
