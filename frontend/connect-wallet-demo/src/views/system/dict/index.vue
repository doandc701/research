<script setup lang="ts">
import XEUtils from "xe-utils";
import Config from "./config.vue";
import { useI18n } from "vue-i18n";
import { cloneDeep } from "lodash-unified";
import { reactive, ref, unref, nextTick } from "vue";
import { useCopyToClipboard } from "@pureadmin/utils";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import {
  VXETable,
  type TablePublicMethods,
  type VxeTableInstance,
  type VxeFormPropTypes,
  type VxeTableEvents,
  type FormMethods
} from "vxe-table";

type onEditNRow = {
  name: string;
  model: string;
};

defineOptions({
  name: "Dict"
});

const { t } = useI18n();

const dictData = reactive({
  submitLoading: false,
  showEdit: false,
  selectRow: null,
  filterName: "",
  tableData: [
    {
      id: 1,
      name: "state",
      model: "",
      children: [
        {
          id: "1-1",
          name: "service status",
          model: "serviceStatus"
        },
        {
          id: "1-2",
          name: "online status",
          model: "onlienStatus"
        }
      ]
    },
    { id: 2, name: "operating system", model: "operatingSystem" }
  ],
  formData: {
    name: "",
    model: ""
  },
  formItems: [
    {
      field: "name",
      title: "dictionary name",
      span: 24,
      itemRender: {
        name: "$input",
        props: { placeholder: "Please enter a dictionary name" }
      }
    },
    {
      field: "model",
      title: "Dictionary type",
      span: 24,
      itemRender: {
        name: "$input",
        props: {
          placeholder: "Please enter a dictionary type",
          // Tài liệu vxe-table ở đây không đề cập rằng tất cả các thuộc tính của thành phần đã chọn có thể được định cấu hình,
          // ví dụ: tất cả các thuộc tính về vxe-input có thể được định cấu hình tại đây
          disabled: true
        }
      }
    },
    {
      align: "right",
      span: 24,
      itemRender: {
        name: "$buttons",
        children: [
          { props: { type: "submit", content: "submit", status: "primary" } },
          { props: { type: "reset", content: "reset" } }
        ]
      }
    }
  ] as VxeFormPropTypes.Items
});

let originData = cloneDeep(dictData.tableData);

const xTree = ref<TablePublicMethods>();
const xForm = ref<FormMethods>();

const handleSearch = () => {
  const filterName = XEUtils.toValueString(dictData.filterName).trim();

  if (filterName) {
    const options = { children: "children" };
    const searchProps = ["name"];

    dictData.tableData = XEUtils.searchTree(
      originData,
      item =>
        searchProps.some(
          key => XEUtils.toValueString(item[key]).indexOf(filterName) > -1
        ),
      options
    );

    // Mở rộng tất cả các nút con theo mặc định sau khi tìm kiếm
    nextTick(() => {
      const $table = xTree.value;
      $table.setAllTreeExpand(true);
    });
  } else {
    dictData.tableData = originData;
  }
};

// Create an anti-shake function, call the frequency interval 100 milliseconds
const searchEvent = XEUtils.debounce(
  function () {
    handleSearch();
  },
  100,
  { leading: false, trailing: true }
);

const confirmEvent = async () => {
  const type = await VXETable.modal.confirm(
    "Are you sure you want to delete it?"
  );
  (await type) === "confirm" &&
    VXETable.modal.message({
      content: "Test data, cannot be deleted",
      status: "error"
    });
};

function commonFn(value, disabled) {
  dictData.selectRow = value;
  dictData.showEdit = true;
  dictData.formItems[1].itemRender.props.disabled = disabled;
}

// new
function onAdd() {
  commonFn(null, false);
}

// Add subtype
function onAddChild(row?: object) {
  console.log("onAddChild", row);
  commonFn(null, false);
}

// edit
function onEdit(row?: onEditNRow) {
  dictData.formData = {
    name: row.name,
    model: row.model ? row.model : "No dictionary type yet"
  };
  commonFn(row, true);
  // VXETable.modal.message({
  //   content: "Test data, not editable",
  //   status: "error"
  // });
}

// Copy the data of the current list item (dictionary type)
const { clipboardValue } = useCopyToClipboard();
const cellDBLClickEvent: VxeTableEvents.CellDblclick = ({ row }) => {
  clipboardValue.value = unref(row).model;
};

const xTable = ref({} as VxeTableInstance);

const submitEvent = () => {
  dictData.submitLoading = true;
  setTimeout(() => {
    const $table = xTable.value;
    dictData.submitLoading = false;
    dictData.showEdit = false;
    if (dictData.selectRow) {
      VXETable.modal.message({
        content: "Successfully saved",
        status: "success"
      });
      Object.assign(dictData.selectRow, dictData.formData);
    } else {
      VXETable.modal.message({
        content: "Added successfully",
        status: "success"
      });
      $table.insert(dictData.formData);
    }
  }, 500);
};

let drawer = ref(false);

function onDeploy(value?: object) {
  console.log("onDeploy", value);
  drawer.value = true;
}

function handleClose() {
  drawer.value = false;
}

function onExpand() {
  xTree.value.setAllTreeExpand(true);
}

function onUnExpand() {
  xTree.value.clearTreeExpand();
}

function onHide() {
  xForm.value.reset();
}
</script>

<template>
  <div>
    <!-- toolbar -->
    <vxe-toolbar class="dark:bg-dark">
      <template #buttons>
        <div class="ml-20px">
          <label>Dictionary name:</label>
          <el-input
            class="!w-200px"
            v-model="dictData.filterName"
            :placeholder="t('buttons.hssearch')"
            @keyup.prevent="searchEvent"
            @input="searchEvent"
            clearable
          />
        </div>
      </template>
      <template #tools>
        <el-button-group>
          <el-button
            type="primary"
            :icon="useRenderIcon('fa:plus-square-o', { online: true })"
            @click="onAdd"
          >
            {{ t("buttons.hsadd") }}
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon('fa:folder-open-o', { online: true })"
            @click="onExpand"
          >
            {{ t("buttons.hsexpendAll") }}
          </el-button>
          <el-button
            type="primary"
            :icon="useRenderIcon('fa:folder-o', { online: true })"
            @click="onUnExpand"
          >
            {{ t("buttons.hscollapseAll") }}
          </el-button>
        </el-button-group>
      </template>
    </vxe-toolbar>

    <!-- list -->
    <vxe-table
      ref="xTree"
      border
      resizable
      :tree-config="{
        children: 'children',
        iconOpen: 'fa fa-minus-square-o',
        iconClose: 'fa fa-plus-square-o'
      }"
      :data="dictData.tableData"
      @cell-dblclick="cellDBLClickEvent"
    >
      <vxe-table-column tree-node field="name" title="dictionary name" />
      <vxe-table-column title="Dictionary type">
        <template #default="{ row }">
          <el-tooltip
            effect="dark"
            :content="'Double click to copy:' + row.model"
            placement="right"
          >
            <span class="text-model">{{ row.model }}</span>
          </el-tooltip>
        </template>
      </vxe-table-column>
      <vxe-table-column title="operate" width="360" fixed="right">
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            :icon="useRenderIcon('edits')"
            @click="onEdit(row)"
          >
            edit
          </el-button>
          <el-button
            link
            type="primary"
            :icon="useRenderIcon('fa:plus-square-o', { online: true })"
            @click="onAddChild(row)"
          >
            Add subtype
          </el-button>
          <el-button
            v-show="row.model"
            link
            type="primary"
            :icon="useRenderIcon('fa:cog', { online: true })"
            @click="onDeploy(row)"
          >
            Dictionary configuration
          </el-button>
          <el-button
            link
            type="primary"
            :icon="useRenderIcon('delete')"
            @click="confirmEvent"
          >
            delete
          </el-button>
        </template>
      </vxe-table-column>
    </vxe-table>

    <!-- Modify and add pop-ups -->
    <vxe-modal
      resize
      width="450"
      v-model="dictData.showEdit"
      :title="dictData.selectRow ? 'edit' : 'new'"
      :loading="dictData.submitLoading"
      @hide="onHide"
    >
      <template #default>
        <vxe-form
          ref="xForm"
          :data="dictData.formData"
          :items="dictData.formItems"
          title-align="right"
          title-width="100"
          @submit="submitEvent"
        />
      </template>
    </vxe-modal>

    <Config
      :drawer="drawer"
      drawTitle="list of dictionaries"
      @handleClose="handleClose"
    />
  </div>
</template>

<style lang="scss" scoped>
.vxe-input + .vxe-button,
.vxe-input + .vxe-button--dropdown,
.vxe-button + .vxe-button,
.vxe-button + .vxe-button--dropdown {
  margin-left: 0;
}

.vxe-button.type--button:not(.is--round) {
  border-radius: 0;
}

.vxe-toolbar.size--medium {
  padding: 10px;
}

.vxe-table--render-default.size--medium {
  margin-top: 12px;
}

.vxe-button.size--medium.type--button {
  margin-right: 0.07em;
}

.text-model {
  &:hover {
    cursor: pointer;
  }
}
</style>
