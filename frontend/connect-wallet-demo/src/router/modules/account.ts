const Layout = () => import("/@/layout/index.vue");
const account = {
  path: "/account",
  component: Layout,
  redirect: "/account/index",
  meta: {
    title: "Account",
    icon: "online:ic:outline-account-circle",
    rank: 2
  },
  children: [
    {
      path: "/account/index",
      name: "Account",
      component: () => import("/@/views/account/index.vue"),
      meta: {
        title: "Manage",
        icon: "online:ic:outline-manage-accounts"
      }
    },
    {
      path: "/account/profile",
      name: "MyProfile",
      component: () => import("/@/views/my-account/index.vue"),
      meta: {
        title: "My Profile",
        icon: "online:bi:person"
      }
    },
    {
      path: "/account/wallet",
      name: "MyWallet",
      component: () => import("/@/views/account/my-wallet/index.vue"),
      meta: {
        title: "My Wallet",
        icon: "online:uil:wallet"
      }
    },
    {
      path: "/account/settings",
      name: "Settings",
      component: () => import("/@/views/account/settings/index.vue"),
      meta: {
        title: "Settings",
        icon: "setting",
        extraIcon: {
          name: "Soon",
          position: "left",
          icon: 2
        }
      }
    }
  ]
};
export default account;
