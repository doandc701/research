const Layout = () => import("/@/layout/index.vue");
const swap = {
  path: "/swap",
  component: Layout,
  redirect: "/swap/index",
  meta: {
    title: "Swap",
    icon: "online:ic:baseline-swap-horizontal-circle",
    rank: 1
  },
  children: [
    {
      path: "/swap/index",
      name: "Swap",
      component: () => import("/@/views/swap/index.vue"),
      meta: {
        title: "Swap",
        icon: "online:ic:baseline-swap-horizontal-circle",
        extraIcon: {
          name: "Soon",
          position: "left",
          icon: 2
        }
      }
    }
  ]
};
export default swap;
