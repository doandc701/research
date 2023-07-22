// import marketplaceRouter from "./marketplace";
import collectionsRouter from "./collections";
import gamesRouter from "./games";

const Layout = () => import("/@/layout/index.vue");
const explore = {
  path: "/explore",
  component: Layout,
  redirect: "/explore/index",
  meta: {
    title: "Explore",
    icon: "online:material-symbols:explore-outline",
    rank: 1
  },
  children: [
    {
      path: "/marketplace",
      name: "Marketplace",
      // component: () => import("/@/views/marketplace/erc1155.vue"),
      component: () => import("/@/views/marketplace/index.vue"),
      meta: {
        title: "Marketplace",
        icon: "online:ic:baseline-storefront",
        extraIcon: {
          name: "Soon",
          position: "left",
          icon: 2
        }
      },
      /* children: [
        {
          path: "/marketplace/ERC721",
          component: () => import("/@/views/marketplace/erc721.vue"),
          name: "ERC721",
          meta: {
            title: "ERC721"
          }
        },
        {
          path: "/marketplace/ERC1155",
          component: () => import("/@/views/marketplace/erc1155.vue"),
          name: "ERC1155",
          meta: {
            title: "ERC1155"
          }
        },
        {
          path: "/marketplace/details/:id",
          name: "Details",
          component: () => import("/@/views/marketplace/details.vue"),
          hidden: true,
          meta: {
            title: "Details",
            showLink: false
          }
        }
      ] */
    },
    // {
    //   path: "/explore/all-projects",
    //   name: "AllProjects",
    //   component: () => import("/@/views/explore/all-projects.vue"),
    //   meta: {
    //     title: "All Projects",
    //     icon: "online:carbon:folder",
    //     extraIcon: {
    //       icon: 2,
    //       position: "left", //
    //       name: "Soon"
    //     }
    //   }
    // },
    collectionsRouter,
    gamesRouter,
    {
      path: "/minting/index",
      name: "MintingNow",
      component: () => import("/@/views/explore/minting-now.vue"),
      meta: {
        title: "Minting Now",
        icon: "online:bi-box",
        extraIcon: {
          name: "Hot",
          position: "left",
          icon: 2
        }
      }
    },
    {
      path: "/minting/details/:codename",
      name: "MintingDetails",
      component: () => import("/@/views/explore/details-mint.vue"),
      meta: {
        showLink: false
      }
    }
  ]
};
export default explore;
