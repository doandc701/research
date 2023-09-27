import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
/* Layout */
import Layout from '@/layout'
/* Router Modules */
import collectionRouter from './modules/Collections'
import myAccountRouter from './modules/MyAccount'
import earnRouter from './modules/Earn'
import statsRouter from './modules/Stats'
import resourceRouter from './modules/Resources'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/my-redirect',
    component: () => import('@/views/redirect/my-redirect'),
    hidden: true
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/tokenomics/index',
    component: Layout,
    redirect: '/resources/tokenomics',
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/home/index'),
        name: 'Home',
        meta: { title: 'home', icon: 'home', affix: true }
      }
    ]
  },
  collectionRouter,
  {
    path: '/mint',
    component: Layout,
    redirect: '/mint/index',
    name: 'mint',
    meta: {
      title: 'Mint',
      icon: 'box'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/mint/index'),
        name: 'MintNFTs',
        meta: { title: 'mintingNow', affix: true, img: 'soon' }
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/mint/detail'),
        name: 'MintingDetails',
        meta: { title: 'Minting Details', affix: true },
        hidden: true
      }
    ]
  },
  {
    path: '/auctions',
    component: Layout,
    redirect: '/auctions/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/auctions/index'),
        name: 'CurrentAuctions',
        meta: { title: 'Current Auctions', icon: 'shop', affix: true }
      }
    ]
  },
  /* {
    path: '/connex-auctions',
    component: Layout,
    redirect: '/connex-auctions/index',
    children: [
      {
        path: 'connex-auctions',
        component: () => import('@/views/auctions/connex-auctions'),
        name: 'ConnexAuctions',
        meta: { title: 'Connex Auctions', icon: 'el-icon-s-shop', affix: true, img: 'new' }
      }
    ]
  }, */
  {
    path: '/finished-auctions',
    component: Layout,
    redirect: '/finished-auctions/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/auctions/finished-auctions'),
        name: 'FinishedAuctions',
        meta: { title: 'Finished Auctions', icon: 'list', affix: true }
      }
    ]
  },
  {
    path: '/staking',
    component: Layout,
    redirect: '/staking/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/staking/index'),
        name: 'Staking',
        meta: { title: 'staking', icon: 'layers', affix: true, img: 'hot' }
      }
    ]
  },
  {
    path: '/games',
    component: Layout,
    redirect: '/games/index',
    name: 'games',
    meta: {
      title: 'Games',
      icon: 'games'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/games/index'),
        name: 'Games',
        meta: { title: 'games', icon: 'games', affix: true, img: 'new' }
      },
      {
        path: 'details/:id',
        component: () => import('@/views/games/details'),
        name: 'Details',
        meta: { title: 'Details' },
        hidden: true
      }
    ]
  },
  myAccountRouter,
  earnRouter,
  statsRouter,
  resourceRouter
  /*
  {
    path: '/telegram',
    children: [
      {
        path: 'https://t.me/vpunks',
        meta: { title: 'Telegram', icon: 'link' }
      }
    ]
  }, */
]
/*
// support history mode
constantRoutes.map(item => {
  item.path = '/app-dev' + item.path
  item.redirect = '/app-dev' + item.redirect
}) */
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
  /*
  {
    path: '/:catchAll(.*)',
    component: () => import('@/views/error-page/404'),
    name: 'NotFound'
  } */
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router
