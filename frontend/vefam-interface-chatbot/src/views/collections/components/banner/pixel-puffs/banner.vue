<script setup lang="ts">
import bannerPp from "/@/assets/collections/pixel-puffs/header-img-pp1.png";
</script>

<template>
  <div>
    <div class="collection-header-wp">
      <div class="top-banner top-banner1">
        <el-image class="banner" :src="bannerPp" alt="" fit="cover">
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
    background-size: contain;
  }
  .top-banner1 {
    background-image: url("/@/assets/collections/pixel-puffs/header-img-pp.jpg");
    display: flex;
    align-items: center;
    justify-content: center;
    .banner {
      position: relative;
      width: 90%;
      max-width: 770px;
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
