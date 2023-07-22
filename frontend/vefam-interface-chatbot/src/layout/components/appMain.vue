<script setup lang="ts">
/*
issues:
1. else if (top === 1) { -> chưa tốt
*/
import {
  h,
  ref,
  watch,
  computed,
  Transition,
  defineComponent,
  onBeforeUnmount
} from "vue";
import { useRoute } from "vue-router";
import { ElScrollbar } from "element-plus";
import { emitter } from "/@/utils/mitt";
import { useGlobal } from "@pureadmin/utils";
import { usePermissionStoreHook } from "/@/store/modules/permission";
//
import Footer from "./footer/index.vue";
//
import backTop from "/@/assets/svg/back_top.svg?component";
import chatbot from "/@/components/ChatBot/index.vue";
const props = defineProps({
  fixedHeader: Boolean
});

const { $storage, $config } = useGlobal<GlobalPropertiesApi>();

const keepAlive = computed(() => {
  return $config && $config.KeepAlive;
});

const transitions = computed(() => {
  return route => {
    return route.meta.transition;
  };
});

const hideTabs = computed(() => {
  return $storage && $storage.configure.hideTabs;
});

const layout = computed(() => {
  return $storage && $storage.layout.layout === "vertical";
});
const getSectionStyle = computed(() => {
  return [
    hideTabs.value && layout ? "padding-top: 48px;" : "",
    !hideTabs.value && layout ? "padding-top: 85px;" : "",
    hideTabs.value && !layout.value ? "padding-top: 60px" : "", // 48 -> 60
    !hideTabs.value && !layout.value ? "padding-top: 85px;" : "",
    props.fixedHeader ? "" : "padding-top: 0;"
  ];
});

const transitionMain = defineComponent({
  render() {
    return h(
      Transition,
      {
        name:
          transitions.value(this.route) &&
          this.route.meta.transition.enterTransition
            ? "pure-classes-transition"
            : (transitions.value(this.route) &&
                this.route.meta.transition.name) ||
              "fade-transform",
        enterActiveClass:
          transitions.value(this.route) &&
          `animate__animated ${this.route.meta.transition.enterTransition}`,
        leaveActiveClass:
          transitions.value(this.route) &&
          `animate__animated ${this.route.meta.transition.leaveTransition}`,
        mode: "out-in",
        appear: true
      },
      {
        default: () => [this.$slots.default()]
      }
    );
  },
  props: {
    route: {
      type: undefined,
      required: true
    }
  }
});

const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const route = useRoute();
// console.log("route", route);
if (route.query.scrollto) {
  handleScrollDelay({ left: 0, top: 0, id: route.query.scrollto });
}

watch(route, newroute => {
  // console.log("newroute", newroute);
  if (newroute) {
    if (newroute.query.scrollto) {
      handleScrollDelay({ left: 0, top: 0, id: newroute.query.scrollto });
    } else {
      handleScrollTo({ left: 0, top: 0 });
    }
  }
});

function handleScrollTo(detail: { left?: number; top?: number; id?: string }) {
  // console.log("newTop", scrollbarRef, detail);
  if (!scrollbarRef.value) return;
  let top = detail.top;
  let left = detail.left;
  if (detail.id) {
    // console.log("detail.id", detail.id);
    const element = document.getElementById(`${detail.id}`);
    // console.log("element", element);
    if (element) {
      top = element.offsetTop;
      left = element.offsetLeft;
      scrollbarRef.value.scrollTo(left, top);
      // console.log("top", top);
    }
    return;
  }

  if (top === 0) {
    // .position-card .el-scrollbar__wrap
    const elementScroll = document.querySelector(".el-scrollbar__wrap");
    const newTop = elementScroll !== null ? elementScroll.offsetTop : 0;
    // console.log("elementScroll", elementScroll);
    // console.log("newTop", elementScroll.offsetTop, newTop);
    scrollbarRef.value.scrollTo(left, newTop);
  } else if (top === 1) {
    const elemetnTab = document.getElementById("tab");
    const topTab = elemetnTab !== null ? elemetnTab.offsetTop : 0;
    // console.log("itemCardRow", itemCardRow);
    // console.log("topTab", topTab);
    scrollbarRef.value.scrollTo(left, topTab);
  } else {
    scrollbarRef.value.scrollTo(left, top);
  }
}

function handleScrollDelay(detail: {
  left?: number;
  top?: number;
  id?: string;
}) {
  if (detail.id) {
    setTimeout(() => {
      handleScrollTo(detail);
    }, 1000);
  } else {
    handleScrollTo(detail);
  }
}

emitter.on("scrollTo", handleScrollDelay);

onBeforeUnmount(() => {
  emitter.off("scrollTo", handleScrollTo);
});
</script>

<template>
  <section
    :class="[props.fixedHeader ? 'app-main' : 'app-main-nofixed-header']"
    :style="getSectionStyle"
  >
    <router-view>
      <template #default="{ Component, route }">
        <el-scrollbar v-if="props.fixedHeader" ref="scrollbarRef">
          <el-backtop
            title="Back to top"
            target=".app-main .el-scrollbar__wrap"
          >
            <backTop />
          </el-backtop>
          <chatbot />
          <transitionMain :route="route">
            <keep-alive
              v-if="keepAlive"
              :include="usePermissionStoreHook().cachePageList"
            >
              <component
                :is="Component"
                :key="route.fullPath"
                class="main-content"
              />
            </keep-alive>
            <component
              v-else
              :is="Component"
              :key="route.fullPath"
              class="main-content"
            />
          </transitionMain>
          <Footer v-if="!route.meta.hideFooter" />
        </el-scrollbar>
        <div v-else>
          <transitionMain :route="route">
            <keep-alive
              v-if="keepAlive"
              :include="usePermissionStoreHook().cachePageList"
            >
              <component
                :is="Component"
                :key="route.fullPath"
                class="main-content"
              />
            </keep-alive>
            <component
              v-else
              :is="Component"
              :key="route.fullPath"
              class="main-content"
            />
          </transitionMain>
        </div>
      </template>
    </router-view>
  </section>
</template>

<style scoped>
.app-main {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.app-main-nofixed-header {
  width: 100%;
  min-height: 100vh;
  position: relative;
}

.main-content {
  margin: 24px;
}
</style>
