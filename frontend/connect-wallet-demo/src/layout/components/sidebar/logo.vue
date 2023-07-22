<script setup lang="ts">
import { useNav } from "/@/layout/hooks/useNav";
import logoDthor from "/img/icons/logo-dthor.png";
import logoText from "/img/icons/logo-text.png";

const props = defineProps({
  collapse: Boolean
});

const { title } = useNav();
</script>

<template>
  <div class="sidebar-logo-container" :class="{ collapse: props.collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="props.collapse"
        key="props.collapse"
        :title="title"
        class="sidebar-logo-link"
        to="/"
      >
        <!--<FontIcon icon="team-iconlogo" svg style="width: 35px; height: 35px" />-->
        <img style="width: 35px; height: 35px" :src="logoDthor" />
        <img class="sidebar-title" :src="logoText" />
        <!-- <span class="sidebar-title">{{ title }}</span> -->
      </router-link>
      <router-link
        v-else
        key="expand"
        :title="title"
        class="sidebar-logo-link"
        to="/"
      >
        <!--<FontIcon icon="team-iconlogo" svg style="width: 35px; height: 35px" />-->
        <img style="height: 35px" :src="logoDthor" />
        <img class="sidebar-title" style="height: 35px" :src="logoText" />
        <!-- <span class="sidebar-title">{{ title }}</span> -->
      </router-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 60px;
  text-align: center;
  overflow: hidden;

  .sidebar-logo-link {
    height: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-top: 15px;

    .sidebar-title {
      color: #1890ff;
      font-weight: 600;
      font-size: 20px;
      // margin-top: 10px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
    }
  }

  .collapse {
    .sidebar-logo {
      margin-right: 0;
    }
  }
}
</style>
