<script setup lang="ts">
import bannerVmj from "/@/assets/collections/vemoji/header-img-vemoji.png";
</script>

<template>
  <div>
    <div class="collection-header-wp">
      <div class="top-banner top-banner1">
        <el-image class="banner" :src="bannerVmj" alt="" fit="fill">
          <template #placeholder>
            <div class="loader01">
              <div class="inner one" />
              <div class="inner two" />
              <div class="inner three" />
            </div>
          </template>
        </el-image>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.collection-header-wp {
  position: relative;
  display: flex;
  height: 320px;
  .top-banner {
    width: 100%;
    height: 320px;
    position: absolute;
    background-size: cover;
  }
  .top-banner1 {
    // background-image: url("/@/assets/collections/vemoji/header-img-vemoji.png");
    background-image: linear-gradient(to bottom, #0049a4, #214489, #000830);
    display: flex;
    align-items: center;
    justify-content: center;
    .banner {
      position: relative;
      width: 100%;
      max-width: 770px;
      box-shadow: #2196f3 0px 0px 25px;
    }
  }
}
@media screen and (max-width: 1030px) {
  .collection-header-wp {
    .top-banner {
      background-size: cover;
    }
  }
}
@media screen and (max-width: 530px) {
  .collection-header-wp {
    height: 200px;
    .top-banner1 {
      height: 200px;
    }
  }
}
</style>
