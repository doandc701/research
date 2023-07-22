const Layout = () => import("/@/layout/index.vue");
const resources = {
  path: "/resources",
  component: Layout,
  redirect: "/resources/index",
  meta: {
    title: "Resources",
    icon: "online:ic:outline-source",
    rank: 5
  },
  children: [
    {
      path: "/resources/partners",
      name: "Partners",
      component: () => import("/@/views/resources/tokenomics.vue"),
      meta: {
        title: "Partners",
        icon: "online:la:user-friends",
        extraIcon: {
          name: "Soon",
          position: "left",
          icon: 2
        }
      }
    },
    {
      path: "/resources/accounts&contract",
      name: "Accounts&contract",
      component: () => import("/@/views/resources/accounts-contract.vue"),
      meta: {
        title: "Accounts & Contract",
        icon: "online:healthicons:i-certificate-paper"
      }
    }
  ]
};
export default resources;
