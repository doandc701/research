<script setup lang="ts">
import { useSettingStoreHook } from "/@/store/modules/settings";
import { ref, reactive, computed, onMounted } from "vue";
import { setType } from "/@/layout/types";
import { useAppStoreHook } from "/@/store/modules/app";
import { useGlobal, deviceDetection } from "@pureadmin/utils";
import { emitter } from "/@/utils/mitt";
import { VueSidePanel } from "vue3-side-panel";
import "vue3-side-panel/dist/vue3-side-panel.css";

const pureSetting = useSettingStoreHook();
const isMobile = deviceDetection();
const isOpened = ref(false);
const isOpenedSort = ref(false);
const { $storage } = useGlobal<GlobalPropertiesApi>();
const isAutoCloseSidebar = ref(false);
let isAutoCloseSidebarLayout = true;

const activeNames = ref(["1", "2", "3", "4", "5"]);
const sortBy = ref("1");
const inputSearch = ref("");
const inputMin = ref("");
const inputMax = ref("");
const radioFrom = ref("nft");
const radioType = ref("1");
const checkDthor = ref(false);
const checkVPU = ref(false);
const checkVET = ref(false);
const checkLv1 = ref(false);
const checkLv2 = ref(false);
const checkLv3 = ref(false);

const set: setType = reactive({
  sidebar: computed(() => {
    return useAppStoreHook().sidebar;
  }),

  device: computed(() => {
    return useAppStoreHook().device;
  }),

  fixedHeader: computed(() => {
    return pureSetting.fixedHeader;
  }),

  classes: computed(() => {
    return {
      mobile: set.device === "mobile"
    };
  }),

  hideTabs: computed(() => {
    return $storage.configure.hideTabs;
  })
});

onMounted(() => {
  if (isMobile || window.innerWidth <= 1000) {
    toggle("mobile", false);
  }
  if (window.innerWidth <= 1000) {
    isAutoCloseSidebar.value = true;
  } else {
    isAutoCloseSidebar.value = false;
  }
  openSidebar();
  isOpened.value = false;
  isOpenedSort.value = false;
});

function toggle(device: string, bool: boolean) {
  useAppStoreHook().toggleDevice(device);
  useAppStoreHook().toggleSideBar(bool, "resize-toggle");
}

function setTheme(layoutModel: string) {
  window.document.body.setAttribute("layout", layoutModel);
  const sl = $storage.layout;
  $storage.layout = {
    layout: `${layoutModel}`,
    theme: sl && sl.theme,
    darkMode: sl && sl.darkMode,
    sidebarStatus: sl && sl.sidebarStatus,
    epThemeColor: sl && sl.epThemeColor
  };
}

emitter.on("resize", ({ detail }) => {
  let { width } = detail;
  width <= 760 ? setTheme("vertical") : setTheme(useAppStoreHook().layout);
  if (window.innerWidth > 0 && window.innerWidth <= 760) {
    toggle("mobile", false);
    isAutoCloseSidebarLayout = true;
  } else if (window.innerWidth > 760 && window.innerWidth <= 990) {
    if (isAutoCloseSidebarLayout) {
      toggle("desktop", false);
      isAutoCloseSidebarLayout = false;
    }
  } else if (window.innerWidth > 990) {
    if (!set.sidebar.isClickCollapse) {
      toggle("desktop", false);
      isAutoCloseSidebarLayout = true;
    }
  }

  if (window.innerWidth <= 1000) {
    isAutoCloseSidebar.value = true;
  } else {
    isAutoCloseSidebar.value = false;
  }
});

function openSidebar() {
  let openMenu = document.getElementById("hideMenu");
  if (isAutoCloseSidebar.value == true) {
    isOpened.value = true;
  } else if (isAutoCloseSidebar.value == false) {
    if (openMenu.style.marginLeft < "-410px") {
      openMenu.style.marginLeft = "unset";
    } else {
      openMenu.style.marginLeft = "-300px";
    }
    return;
  }
}

function openSort() {
  isOpenedSort.value = true;
}

function cancelSort() {
  isOpenedSort.value = false;
}

const emit = defineEmits(["nft-or-collection"]);

const handleFrom = (radioFrom): void => {
  emit("nft-or-collection", radioFrom);
};

defineExpose({
  openSidebar,
  openSort
});
</script>

<template>
  <div :class="[set.classes]" v-resize>
    <div
      id="hideMenu"
      v-if="!isAutoCloseSidebar"
      default-active="1"
      class="menu-vertical"
    >
      <div class="filters-content">
        <el-input v-model="inputSearch" placeholder="Search"
          ><template #prefix>
            <el-button link
              ><IconifyIconOnline
                icon="ic:round-search" /></el-button></template
        ></el-input>
        <el-collapse v-model="activeNames">
          <el-collapse-item title="From" name="1">
            <el-row justify="center" align="middle">
              <el-radio-group
                v-model="radioFrom"
                @change="handleFrom(radioFrom)"
              >
                <el-radio-button label="nft">NFT</el-radio-button>
                <el-radio-button label="collection"
                  >Collections</el-radio-button
                >
              </el-radio-group>
            </el-row>
          </el-collapse-item>
        </el-collapse>

        <el-collapse v-model="activeNames">
          <el-collapse-item title="Select Types" name="2">
            <el-row justify="center" align="middle">
              <el-radio-group v-model="radioType">
                <el-radio-button label="1">Fixed Price</el-radio-button>
                <el-radio-button label="2">Time Auction</el-radio-button>
              </el-radio-group>
            </el-row>
          </el-collapse-item>
        </el-collapse>

        <el-collapse v-model="activeNames">
          <el-collapse-item title="Price" name="3">
            <el-row
              justify="space-between"
              align="middle"
              style="
                padding-bottom: 14px;
                padding-left: 2px;
                padding-right: 2px;
              "
            >
              <el-input
                style="width: 107px"
                v-model="inputMin"
                placeholder="Min"
              />
              <el-input
                style="width: 107px"
                v-model="inputMax"
                placeholder="Max"
              />
            </el-row>
            <el-row justify="center">
              <el-button class="button-type-08" style="width: 98%"
                >Apply</el-button
              >
            </el-row>
          </el-collapse-item>
        </el-collapse>

        <el-collapse v-model="activeNames">
          <el-collapse-item title="Chain" name="4">
            <el-row justify="start" align="middle" style="padding-bottom: 14px">
              <div>
                <el-checkbox v-model="checkDthor" label="Dthor" />
                <el-checkbox v-model="checkVPU" label="VPU" />
                <el-checkbox v-model="checkVET" label="VET" />
              </div>
            </el-row>
          </el-collapse-item>
        </el-collapse>

        <el-collapse v-model="activeNames" style="border-bottom: unset">
          <el-collapse-item title="Level" name="5">
            <el-row justify="start" align="middle" style="padding-bottom: 14px">
              <div>
                <el-checkbox v-model="checkLv1" label="Level 1" />
                <el-checkbox v-model="checkLv2" label="Level 2" />
                <el-checkbox v-model="checkLv3" label="Level 3" />
              </div>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>

    <VueSidePanel
      v-if="isAutoCloseSidebar"
      v-model="isOpened"
      hide-close-btn
      side="left"
      width="280px"
    >
      <el-scrollbar>
        <el-row style="padding-top: 25px; color: #fff" justify="center"
          >Filters</el-row
        >
        <div style="padding-top: 10px; color: #f14668; overflow: hidden">
          <div class="filters-content">
            <el-input v-model="inputSearch" placeholder="Search"
              ><template #prefix>
                <el-button link
                  ><IconifyIconOnline
                    icon="ic:round-search" /></el-button></template
            ></el-input>
            <el-collapse v-model="activeNames">
              <el-collapse-item title="From" name="1">
                <el-row justify="center" align="middle">
                  <el-radio-group
                    v-model="radioFrom"
                    @change="handleFrom(radioFrom)"
                  >
                    <el-radio-button label="nft">NFT</el-radio-button>
                    <el-radio-button label="collection"
                      >Collections</el-radio-button
                    >
                  </el-radio-group>
                </el-row>
              </el-collapse-item>
            </el-collapse>

            <el-collapse v-model="activeNames">
              <el-collapse-item title="Select Types" name="2">
                <el-row justify="center" align="middle">
                  <el-radio-group v-model="radioType">
                    <el-radio-button label="1">Fixed Price</el-radio-button>
                    <el-radio-button label="2">Time Auction</el-radio-button>
                  </el-radio-group>
                </el-row>
              </el-collapse-item>
            </el-collapse>

            <el-collapse v-model="activeNames">
              <el-collapse-item title="Price" name="3">
                <el-row
                  justify="space-between"
                  align="middle"
                  style="
                    padding-bottom: 14px;
                    padding-left: 2px;
                    padding-right: 2px;
                  "
                >
                  <el-input
                    style="width: 107px"
                    v-model="inputMin"
                    placeholder="Min"
                  />
                  <el-input
                    style="width: 107px"
                    v-model="inputMax"
                    placeholder="Max"
                  />
                </el-row>
                <el-row justify="center">
                  <el-button class="button-type-08" style="width: 98%"
                    >Apply</el-button
                  >
                </el-row>
              </el-collapse-item>
            </el-collapse>

            <el-collapse v-model="activeNames">
              <el-collapse-item title="Chain" name="4">
                <el-row
                  justify="start"
                  align="middle"
                  style="padding-bottom: 14px"
                >
                  <div>
                    <el-checkbox v-model="checkDthor" label="Dthor" />
                    <el-checkbox v-model="checkVPU" label="VPU" />
                    <el-checkbox v-model="checkVET" label="VET" />
                  </div>
                </el-row>
              </el-collapse-item>
            </el-collapse>

            <el-collapse v-model="activeNames" style="border-bottom: unset">
              <el-collapse-item title="Level" name="5">
                <el-row
                  justify="start"
                  align="middle"
                  style="padding-bottom: 14px"
                >
                  <div>
                    <el-checkbox v-model="checkLv1" label="Level 1" />
                    <el-checkbox v-model="checkLv2" label="Level 2" />
                    <el-checkbox v-model="checkLv3" label="Level 3" />
                  </div>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </el-scrollbar>
    </VueSidePanel>

    <VueSidePanel
      v-model="isOpenedSort"
      hide-close-btn
      side="bottom"
      width="280px"
      height="320px"
    >
      <!-- <el-row justify="center"> -->
      <template #header>
        <div
          style="
            text-align: center;
            background-color: #171b33;
            color: white;
            padding-top: 30px;
            font-weight: 600;
          "
        >
          <h2 :style="{ fontSize: '20px' }">Sort by</h2>
        </div>
      </template>
      <template #default>
        <div style="display: flex; justify-content: center; margin-top: 20px">
          <el-row style="justify-content: center">
            <el-radio-group v-model="sortBy" class="radio-sort">
              <el-radio label="1" size="large">Price: Low To High</el-radio>
              <el-radio label="2" size="large">Price: High To Low</el-radio>
              <el-radio label="3" size="large">Newest To Oldest</el-radio>
              <el-radio label="4" size="large">Oldest To Newest</el-radio>
            </el-radio-group>
          </el-row>
        </div>
        <el-row justify="center" style="margin-top: 15px"
          ><el-button
            @click="cancelSort()"
            class="button-type-08"
            style="width: 100px"
            >Cancel</el-button
          >
          <el-button
            @click="cancelSort()"
            class="button-type07"
            style="width: 100px"
            >Submit</el-button
          ></el-row
        >
      </template>
      <!-- </el-row> -->
    </VueSidePanel>
  </div>
</template>

<style>
.vsp-wrapper .vsp__body {
  background-color: #171b33;
}
.vsp__body {
  overflow: hidden !important;
}
</style>

<style lang="scss" scoped>
.filters-content {
  padding: 10px;
  height: auto;
}

.menu-vertical {
  width: 250px;
  background-color: rgba(255, 255, 255, 0.1);
  transition: margin-left ease 0.5s;
  border-radius: 10px;
}

:deep(.el-collapse) {
  --el-collapse-border-color: unset;
  border-bottom: 1px solid rgba(217, 217, 217, 0.5);
}

:deep(.el-collapse-item__header) {
  background-color: transparent;
  color: #fff;
}

:deep(.el-collapse-item__wrap) {
  background-color: transparent;
}

:deep(.el-collapse-item__content) {
  color: #fff;
  padding-bottom: 20px;
}

:deep(.el-collapse-item__header.is-active) {
  color: #fff !important;
}

:deep(.el-radio-group) {
  justify-content: space-between;
  width: 100%;
}

:deep(.el-radio-button__inner) {
  width: 110px;
  background-color: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgb(57 62 92) !important;
  border-radius: 10px;
  color: #8b8b8b;
  &:hover {
    color: #fff;
  }
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  width: 110px;
  border: 1px solid #1264f2 !important;
  background-color: #1264f2 !important;
  border: 0;
  border-radius: 10px !important;
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  box-shadow: unset;
  border: 1px solid #1264f2 !important;
}

:deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 10px !important;
}

:deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 10px !important;
}

:deep(.el-checkbox) {
  display: flex;
  margin-right: 0;
  color: #fff;
}

:deep(.el-input__wrapper) {
  background-color: transparent;
  box-shadow: unset;
  margin-bottom: 5px;
}

:deep(.el-input) {
  border-bottom: 1px solid rgba(217, 217, 217, 0.5);
}

.radio-sort {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  font-size: 0;
  flex-direction: column;
}
.el-radio {
  margin-right: 0;
  color: #fff;
}
</style>
