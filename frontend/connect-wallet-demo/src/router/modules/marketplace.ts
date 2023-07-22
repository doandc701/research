const Layout = () => import("/@/layout/index.vue");
const marketplace = {
  path: "/marketplace",
  component: Layout,
  redirect: "/marketplace/index",
  meta: {
    title: "Marketplace",
    icon: "online:ic:baseline-storefront"
  },
  children: [
    {
      path: "/marketplace/index",
      name: "Marketplaces",
      component: () => import("/@/views/marketplace/index.vue"),
      meta: {
        title: "Marketplaces"
      }
    },
    {
      path: "/marketplace/details/:id",
      name: "marketDetails",
      component: () => import("/@/views/marketplace/details.vue"),
      hidden: true,
      meta: {
        title: "Details",
        showLink: false
      }
    }
  ]
};

export default marketplace;
