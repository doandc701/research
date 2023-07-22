const Layout = () => import("/@/layout/index.vue");

const routes = {
  path: "/collections",
  component: Layout,
  redirect: "/collections/index",
  meta: {
    title: "All Collections",
    icon: "online:icon-park-outline:more-app"
  },
  children: [
    {
      path: "/collections/index",
      name: "AllCollections",
      component: () => import("/@/views/collections/index.vue"),
      hiddenTag: true,
      meta: {
        title: "All Collections",
        icon: "online:icon-park-outline:more-app"
      }
    },
    {
      path: "/collections/details/:codename",
      name: "CollectionDetails",
      component: () => import("/@/views/collections/details.vue"),
      meta: {
        title: "Collection Details",
        showLink: false
      }
    }
  ]
};

export default routes;
