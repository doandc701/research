const Layout = () => import("/@/layout/index.vue");

const routes = {
  path: "/games",
  component: Layout,
  redirect: "/games/index",
  meta: {
    icon: "outline-gamepad",
    title: "All Games"
  },
  children: [
    {
      path: "/games/index",
      name: "AllGames",
      component: () => import("/@/views/all-games/index.vue"),
      meta: {
        title: "All Games",
        icon: "outline-gamepad"
      }
    },
    {
      path: "/games/details/:codename",
      name: "GameDetails",
      component: () => import("/@/views/games/details.vue"),
      meta: {
        title: "Game Details",
        showLink: false
      }
    }
  ]
};

export default routes;

// const Layout = () => import("/@/layout/index.vue");
// const details = {
//   path: "/games",
//   component: Layout,
//   redirect: "/games/details",
//   meta: {
//     icon: "user",
//     title: "Details",
//     showLink: false
//   },
//   children: [
//     {
//       path: "/games/details/:codename",
//       name: "Details",
//       component: () => import("/@/views/games/details.vue"),
//       meta: {
//         title: "Details"
//       }
//     }
//   ]
// };
// export default details;
