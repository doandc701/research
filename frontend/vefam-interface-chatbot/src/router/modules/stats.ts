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
      path: "/stats/rankings",
      name: "Rankings",
      component: () => import("/@/views/stats/rankings.vue"),
      meta: {
        title: "Rankings",
        icon: "online:fa6-solid:ranking-star",
        extraIcon: {
          name: "Soon",
          position: "left",
          icon: 2
        }
      }
    },
    {
      path: "/stats/activity",
      name: "Activity",
      component: () => import("/@/views/stats/activity.vue"),
      meta: {
        title: "Activity",
        icon: "online:tabler:activity-heartbeat",
        extraIcon: {
          name: "Soon",
          position: "left",
          icon: 2
        }
      }
    }
  ]
};
export default stats;
