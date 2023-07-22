<script setup lang="ts">
import { useColumns } from "./columns";
export interface schemaItem {
  field: string;
  label: string;
}

defineOptions({
  name: "About"
});

const { pkg } = __APP_INFO__;
const { dependencies, devDependencies } = pkg;

const schema: schemaItem[] = [];
const devSchema: schemaItem[] = [];

const { columns } = useColumns();

Object.keys(dependencies).forEach(key => {
  schema.push({ field: dependencies[key], label: key });
});

Object.keys(devDependencies).forEach(key => {
  devSchema.push({ field: devDependencies[key], label: key });
});
</script>

<template>
  <div>
    <el-card class="box-card mb-4" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="font-medium">About</span>
        </div>
      </template>
      <span style="font-size: 15px">
        Pure-Admin là một giải pháp cấp trung và cấp sau dựa trên Vue3, Vite2,
        TypeScript và Element-Plus
      </span>
    </el-card>

    <el-card class="box-card m-4" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="font-medium">Project information</span>
        </div>
      </template>
      <PureDescriptions :columns="columns" border :column="3" align="left" />
    </el-card>

    <el-card class="box-card m-4" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="font-medium">Production environment dependencies</span>
        </div>
      </template>
      <el-descriptions border>
        <el-descriptions-item
          :label="item.label"
          label-align="left"
          align="left"
          v-for="(item, index) in schema"
          :key="index"
        >
          <a
            :href="'https://www.npmjs.com/package/' + item.label"
            target="_blank"
          >
            <span style="color: var(--el-color-primary)">{{ item.field }}</span>
          </a>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="box-card m-4" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="font-medium">Development environment dependencies</span>
        </div>
      </template>
      <el-descriptions border>
        <el-descriptions-item
          :label="item.label"
          label-align="left"
          align="left"
          v-for="(item, index) in devSchema"
          :key="index"
        >
          <a
            :href="'https://www.npmjs.com/package/' + item.label"
            target="_blank"
          >
            <span style="color: var(--el-color-primary)">{{ item.field }}</span>
          </a>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.main-content {
  margin: 0 !important;
}
</style>
