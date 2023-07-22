const Layout = () => import("/@/layout/index.vue");
const dex = {
  path: "/dex",
  component: Layout,
  redirect: "/dex/index",
  meta: {
    title: "DeFi",
    icon: "online:simple-icons:blockchaindotcom",
    rank: 4
  },
  children: [
    {
      path: "/dthor",
      name: "https://dthor.io",
      meta: {
        title: "DThor",
        icon: "img:img/icons/logo-dthor.png",
        extraIcon: {
          name: "ci:external-link",
          icon: 1
        }
      }
    },
    {
      path: "/dthor",
      name: "https://dthor.io/#/swap/index",
      meta: {
        title: "DThor Swap",
        icon: "img:img/icons/logo-dthor.png",
        extraIcon: {
          name: "ci:external-link",
          icon: 1
        }
      }
    }
  ]
};
export default dex;
