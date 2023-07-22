<script setup lang="ts">
import { ref } from "vue";

const visible = ref(false);
const inputPrice = ref("");
const inputItem = ref(3);
const isRotate1 = ref(false); // rotation arrow của View Options dropdown
const selectedToken = ref(0);
const autoSwap = ref(false);
const loading1 = ref(false);
const tokenOption = ref([
  {
    label: "VET",
    value: "VET"
  },
  {
    label: "VPU",
    value: "VPU"
  }
]);

function openSweep() {
  visible.value = true;
}

function handleVisibleChange1(visible: boolean) {
  isRotate1.value = visible;
}

function handleInputItem() {
  inputItem.value = Math.trunc(inputItem.value);
}

function handleOptions(index) {
  selectedToken.value = index;
  isRotate1.value = false;
}

const beforeChange = () => {
  loading1.value = true;
  return new Promise(resolve => {
    setTimeout(() => {
      loading1.value = false;
      return resolve(true);
    }, 1000);
  });
};

defineExpose({
  openSweep
});
</script>

<template>
  <div class="sweep-dialog">
    <el-dialog v-model="visible" custom-class="dialog-type2 version-sweep">
      <template #header="{ titleId, titleClass }">
        <el-row
          align="middle"
          :id="titleId"
          :class="titleClass"
          style="font-weight: 600"
        >
          <IconifyIconOnline style="margin-right: 5px" icon="el:broom" />Sweep
        </el-row>
      </template>
      <div>
        <div style="margin-bottom: 10px">Max price per item</div>
        <div>
          <el-input v-model="inputPrice" placeholder="Input here">
            <template #append>
              <el-dropdown
                style="margin-right: 10px"
                popper-class="custom-dropdown-mkp"
                trigger="click"
                @visible-change="handleVisibleChange1"
              >
                <el-button>
                  <el-row style="flex-wrap: nowrap"
                    >{{ tokenOption[selectedToken].label }}
                    <span class="icon-down1" :class="{ open: isRotate1 }">
                      <IconifyIconOnline icon="akar-icons:chevron-down" />
                    </span>
                  </el-row>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      class="dropdown-erc"
                      v-for="(item, index) in tokenOption"
                      :key="index + item.label"
                      :class="selectedToken == index ? 'active' : ''"
                      @click="handleOptions(index)"
                    >
                      <span style="user-select: none">
                        {{ item.label }}
                      </span></el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-input>
        </div>
        <div style="margin: 20px 0px 10px 0px">Number of items</div>
        <div>
          <!-- <el-input
            v-model="inputItem"
            placeholder="Input here"
            @change="handleInputItem(index)"
          /> -->
          <el-slider
            v-model="inputItem"
            @change="handleInputItem()"
            :min="1"
            :max="20"
            :precision="0.0"
            placeholder="Input here"
            show-input
            :show-input-controls="false"
          />
        </div>
        <el-row align="middle"
          ><el-switch
            v-model="autoSwap"
            :loading="loading1"
            :before-change="beforeChange"
          /><span style="margin-left: 10px"> Auto swap items</span></el-row
        >
      </div>
      <div style="margin-top: 20px; font-size: 16px; margin-bottom: 10px">
        <el-row>Listing price: 0.5 VET</el-row>
        <el-row>Network Fee: 1 VET</el-row>
      </div>
      <hr />
      <el-row style="margin-top: 10px; font-size: 16px"
        >Total price: -/-</el-row
      >
      <el-row>
        <el-button class="button-type07" style="width: 100%; margin-top: 20px"
          >Sweep</el-button
        >
      </el-row>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
:deep(.dialog-type2.version-sweep) {
  max-width: 380px;
  width: 95%;
  color: #fff;
}

:deep(.el-dialog__body) {
  color: #fff;
}

:deep(.el-input__wrapper) {
  background-color: #293366;
  border-radius: 8px;
  box-shadow: unset;
  color: #fff;
}

:deep(.el-input-group__append) {
  background-color: #293366;
  box-shadow: unset;
  border-radius: 8px;
  margin-left: 5px;
}

:deep(.el-input-group__append button.el-button) {
  color: #fff;
}

.el-input {
  --el-input-text-color: #fff;
}

:deep(.el-slider__runway.show-input) {
  margin-right: 15px;
}

:deep(.el-input__inner) {
  color: #fff;
}

:deep(.el-slider__input) {
  width: 65px;
}

hr {
  color: #d9d9d9;
}
</style>
