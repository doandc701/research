import marketplaceRouter from "./marketplace";
import collectionsRouter from "./collections";
import gamesRouter from "./games";

const Layout = () => import("/@/layout/index.vue");
const explore = {
  path: "/explore",
  component: Layout,
  redirect: "/explore/index",
  meta: {
    title: "Explore",
    icon: "online:material-symbols:explore-outline"
  },
  children: [
    marketplaceRouter,
    {
      path: "/explore/all-projects",
      name: "AllProjects",
      component: () => import("/@/views/explore/all-projects.vue"),
      meta: {
        title: "All Projects",
        icon: "online:carbon:folder"
      }
    },
    collectionsRouter,
    gamesRouter,
    {
      path: "/explores/minting-now",
      name: "MintingNow",
      component: () => import("/@/views/explore/minting-now.vue"),
      meta: {
        title: "Minting Now",
        icon: "online:bi-box"
      }
    },
    {
      path: "/explores/minting-now/details/:id",
      name: "MintingDetails",
      component: () => import("/@/views/explore/details-mint.vue"),
      meta: {
        showLink: false
      }
    }
  ]
};
export default explore;
