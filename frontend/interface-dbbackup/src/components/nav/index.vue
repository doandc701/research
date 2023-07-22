<script lang="ts" setup>
import { ref } from "vue";
import router from "../../router";

// console.log("router", router.options.routes);
const activeIndex = ref("1");
const handleSelect = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath);
};
</script>

<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
    <router-link
      v-for="item in router.options.routes"
      :key="item.name"
      :to="item.path"
    >
      <el-menu-item :index="item.name">{{ item.name }}</el-menu-item>
    </router-link>
  </el-menu>
</template>
<style scoped lang="scss">
a {
  text-decoration: unset;
}
.el-menu-demo {
  margin-bottom: 50px;
}
</style>
