const Layout = () => import("/@/layout/index.vue");
const ntf = {
  path: "/nft",
  component: Layout,
  redirect: "/nft/index",
  meta: {
    title: "NFT",
    icon: "online:game-icons:token",
    rank: 4
  },
  children: [
    {
      path: "/vefam",
      name: "https://vefam.com/",
      meta: {
        title: "Vefam",
        icon: "img:img/icons/logo-symbol.png",
        extraIcon: {
          name: "ci:external-link",
          icon: 1
        }
      }
    },
    {
      path: "/vefam",
      name: "https://vefam.com/#/games/",
      meta: {
        title: "Vefam Game",
        icon: "img:img/icons/logo-symbol.png",
        extraIcon: {
          name: "ci:external-link",
          icon: 1
        }
      }
    }
  ]
};
export default ntf;
