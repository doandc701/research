const Layout = () => import("/@/layout/index.vue");
const stats = {
  path: "/stats",
  component: Layout,
  redirect: "/stats/index",
  meta: {
    title: "Stats",
    icon: "online:bxs:bar-chart-alt-2"
  },
  children: [
    {
      path: "/stats/index",
      name: "Analytics",
      component: () => import("/@/views/stats/index.vue"),
      meta: {
        title: "Analytics",
        icon: "online:material-symbols:overview-outline-rounded",
        extraIcon: {
          name: "Soon",
          position: "left",
          icon: 2
        }
      }
    },
    {
      path: "/stats/overview",
      name: "Overview",
      component: () => import("/@/views/stats/overview.vue"),
      meta: {
        title: "Overview",
        icon: "online:material-symbols:overview-outline-rounded",
        extraIcon: {
          name: "Soon",
          position: "left",
          icon: 2
        }
      }
    },
    {
      path: "/stats/tokens",
      name: "Tokens",
      component: () => import("../../views/stats/tokens/index.vue"),
      meta: {
        title: "Tokens",
        icon: "online:material-symbols:token-outline-rounded",
        extraIcon: {
          name: "Soon",
          position: "left",
          icon: 2
        }
      }
    },
    {
      path: "/stats/token",
      name: "tokenDetails",
      component: () => import("../../views/stats/tokens/tokenDetails.vue"),
      meta: {
        title: "Token Details",
        showLink: false
      }
    },
    {
      path: "/stats/pools",
      name: "Pools",
      component: () => import("../../views/stats/pools/index.vue"),
      meta: {
        title: "Pools",
        icon: "online:clarity:resource-pool-solid",
        extraIcon: {
          name: "New",
          position: "left",
          icon: 2
        }
      }
    },
    {
      path: "/stats/pool",
      name: "poolsDetails",
      component: () => import("../../views/stats/pools/poolsDetails.vue"),
      meta: {
        title: "Pools Details",
        showLink: false
      }
    },
    {
      path: "/stats/transactions",
      name: "Transactions",
      component: () => import("/@/views/stats/transactions.vue"),
      meta: {
        title: "Transactions",
        icon: "online:uil:transaction",
        extraIcon: {
          name: "Hot",
          position: "left",
          icon: 2
        }
      }
    }
  ]
};
export default stats;
