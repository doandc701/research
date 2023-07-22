<script setup lang="ts">
import { ref, unref } from "vue";
import type { StorageConfigs } from "/#/index";
import { storageSession } from "@pureadmin/utils";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";

defineOptions({
  name: "PermissionPage"
});

let purview = ref<string>(
  storageSession.getItem<StorageConfigs>("info").username
);

function changRole() {
  if (unref(purview) === "admin") {
    storageSession.setItem("info", {
      username: "test",
      accessToken: "eyJhbGciOiJIUzUxMiJ9.test"
    });
    window.location.reload();
  } else {
    storageSession.setItem("info", {
      username: "admin",
      accessToken: "eyJhbGciOiJIUzUxMiJ9.admin"
    });
    window.location.reload();
  }
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>
          Current role：
          <span style="font-size: 26px">{{ purview }}</span>
          <p style="color: #ffa500">
            Kiểm tra các thay đổi của menu bên trái (system management), mô
            phỏng nền để quay lại tuyến đường tương ứng theo các vai trò khác
            nhau
          </p>
        </span>
      </div>
    </template>
    <el-button
      type="primary"
      @click="changRole"
      :icon="useRenderIcon('user', { color: '#fff' })"
    >
      Switch roles
    </el-button>
  </el-card>
</template>
