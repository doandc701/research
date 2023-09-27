<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />

        <!-- custom item Demo, Dthor, VeFam -->
        <div class="custom-menu">
          <!-- Demo -->
          <a href="https://vpunks.com/local-demo/#/auctions/index" target="_blank">
            <div class="custom-item">
              <svg-icon icon-class="ondemand-video" style="vertical-align: -0.15em" />
              <span>Demo</span>
              <svg-icon icon-class="link" class="custom-icon" />
            </div>
          </a>
          <!-- Dthor, Vefam -->
          <div v-for="(item, index) in listPages" :key="index">
            <a :href="item.path" :target="item.target">
              <div class="custom-item">
                <img :src="imgsrc(item.img)" class="custom-img">
                <span>{{ item.title }}</span>
                <svg-icon :icon-class="item.icon1" class="custom-icon" />
              </div>
            </a>
          </div>
        </div>
        <!-- end: custom social Media -->
        <div class="social-media">
          <div v-for="(social, index) in socialMedia" :key="index" class="social-media-item">
            <a :href="social.link" :target="social.target"><svg-icon :icon-class="social.name" /></a>
          </div>
        </div>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      // page Demo , Ddthor, VeFam
      listPages: [
        { path: 'https://vefam.com/', img: 'vefam', icon1: 'link', title: 'VeFam', target: '_blank' },
        { path: 'https://dthor.io/', img: 'dthor', icon1: 'link', title: 'DThor Swap', target: '_blank' }
      ],
      // socialMedia
      socialMedia: [
        { link: 'https://discord.gg/vpunks', name: 'discord', target: '_blank' },
        { link: 'https://twitter.com/vpunksofficial', name: 'twitter', target: '_blank' },
        { link: 'https://twitter.com/vpunksofficial', name: 'browser', target: '_blank' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    imgsrc(img) {
      return `./img/icons/${img}.png`
    }
  }
}
</script>

<style lang="scss" scoped>
/* Demo, Dthor, VeFam */
.custom-item {
  height: 56px;
  line-height: 56px;
  font-size: 16px;
  color: #BFCBD9;
  padding: 0 20px;
  list-style: none;
  cursor: pointer;
  position: relative;
  -webkit-transition: border-color 0.3s, background-color 0.3s, color 0.3s;
  transition: border-color 0.3s, background-color 0.3s, color 0.3s;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  white-space: nowrap;
}
.custom-item:hover {
  background-color: #05152a !important;
}
.custom-img {
  height: 16px;
  margin-right: 1.1em;
}
.custom-icon {
  position: absolute;
  top: 50%;
  right: 1px;
  margin-top: -7px;
  -webkit-transition: -webkit-transform 0.3s;
  transition: -webkit-transform 0.3s;
  transition: transform 0.3s;
  transition: transform 0.3s, -webkit-transform 0.3s;
  font-size: 12px;
}
.social-media {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}
.social-media-item {
  width: 100%;
  padding-bottom: 20px;
  text-align: center;
}
.social-media a {
    width: auto !important;
  transition: 0.5s ease-out;
}
.social-media a:hover {
  opacity: 0.6;
}
.social-media-item a svg {
  width: 35px;
  height: 35px;
}
.social-media-item .svg-icon {
  margin-right: 0 !important;
}
.el-menu--collapse {
  .custom-menu {
    span {
      height: 0;
      width: 0;
      overflow: hidden;
      visibility: hidden;
      display: inline-block;
    }
  }
  svg.custom-icon.svg-icon {
    display: none;
  }
  .social-media {
    display: block;
  }
}
</style>
