<script setup lang="ts">
import { ref } from "vue";

const dialogProperties = ref(false);
const dialogSort = ref(false);
const radioSort = ref("");
const optionRadio = {
  default: [
    { id: 1, title: "ID: Low to High" },
    { id: 2, title: "ID: High to Low" },
    { id: 5, title: "Rank: Low to High" },
    { id: 6, title: "Rank: High to Low" }
  ],
  collected: [
    { id: 0, title: "Default" },
    { id: 1, title: "ID: Low to High" },
    { id: 2, title: "ID: High to Low" },
    { id: 5, title: "Rank: Low to High" },
    { id: 6, title: "Rank: High to Low" }
  ],
  market: [
    { id: 0, title: "Recently added" },
    { id: 1, title: "ID: Low to High" },
    { id: 2, title: "ID: High to Low" },
    { id: 3, title: "Price: Low to High" },
    { id: 4, title: "Price: High to Low" },
    { id: 5, title: "Rank: Low to High" },
    { id: 6, title: "Rank: High to Low" }
  ]
};

defineOptions({
  name: "SortFilters"
});
</script>

<template>
  <div class="sort-fill-container">
    <!-- Properties Dialog begin -->
    <el-button class="btn-properties" @click="dialogProperties = true"
      ><IconifyIconOnline
        style="margin-right: 3px"
        icon="system-uicons:filtering"
      />
      <span class="hideText">Properties</span>
    </el-button>
    <el-dialog
      custom-class="dialog-type2"
      v-model="dialogProperties"
      title="Filters"
      width="30%"
    >
      <span>This is a sort filter</span>
      <template #footer>
        <span class="dialog-footer">
          <div class="btn-gr">
            <el-button class="btn-left" @click="dialogSort = true">
              Add sort
            </el-button>
            <el-button class="btn-right" @click="dialogProperties = false">
              Submit
            </el-button>
          </div>
        </span>
      </template>
    </el-dialog>
    <!-- End Properties Dialog -->

    <!-- Sort Dialog begin -->
    <el-button class="btn-properties" @click="dialogSort = true"
      ><IconifyIconOnline style="margin-right: 3px" icon="ep:sort" />
      <span class="hideText">Sort by</span>
    </el-button>
    <el-dialog
      custom-class="dialog-type2"
      v-model="dialogSort"
      title="Sort by"
      width="30%"
    >
      <el-radio-group v-model="radioSort">
        <el-radio
          v-for="radio in optionRadio.default"
          :key="radio.id"
          :label="radio.id"
        >
          {{ radio.title }}
        </el-radio>
      </el-radio-group>
      <template #footer>
        <span class="dialog-footer">
          <div class="btn-gr">
            <el-button
              class="btn-left"
              @click="(dialogProperties = true) || (dialogSort = false)"
            >
              Add Filters
            </el-button>
            <el-button class="btn-right" @click="dialogSort = false">
              Submit
            </el-button>
          </div>
        </span>
      </template>
    </el-dialog>
    <!-- End Sort Dialog -->
  </div>
</template>

<style lang="scss" scoped>
.sort-fill-container {
  display: flex;
  justify-content: flex-end;
  // margin: 0px 5px;
  :deep(.el-dialog.dialog-type2) {
    width: 95% !important;
    max-width: 500px;
  }
  :deep(.el-dialog__body) {
    color: #fff;
  }
  .btn-properties {
    border: 1px solid #1264f2;
    background-color: #1f264c;
    color: #ffffffab;
    border-radius: 10px;
    margin-left: 5px;
    &:hover {
      transition: all 0.25s;
      border: 1px solid #4885ee;
    }
  }
  .el-radio-group {
    display: flex;
    flex-wrap: wrap;
    font-size: 0;
    flex-direction: column;
    align-items: flex-start;
  }
  .btn-gr {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .btn-right {
    background: transparent;
    color: #00d4ff;
    border: 1px solid #00d4ff;
    border-radius: 10px;
    max-width: 150px;
    width: 100%;
    &:hover {
      transition: all 0.25s;
      background: #00d4ff;
      color: #fff;
    }
  }
  .btn-left {
    color: #fff;
    background-color: #ffba00;
    border: none;
    border-radius: 10px;
    max-width: 150px;
    width: 100%;
    &:hover {
      transition: all 0.25s;
      color: #000;
    }
  }
  .el-radio {
    color: #fff;
  }
  @media screen and (max-width: 470px) {
    .hideText {
      display: none;
    }
  }
}
</style>
