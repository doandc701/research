import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const homeRouter = {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/home",
  meta: {
    icon: "home-filled",
    title: $t("menus.hshome"),
    rank: 0,
    showLink: false
  },
  children: [
    {
      path: "/home",
      name: "Home",
      component: () => import("/@/views/home/index.vue"),
      meta: {
        title: $t("menus.hshome")
      }
    }
  ]
};

export default homeRouter;
