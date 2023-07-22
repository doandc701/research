import { $t } from "/@/plugins/i18n";
import { loadEnv } from "@build/index";
const Layout = () => import("/@/layout/index.vue");
const IFrame = () => import("/@/layout/frameView.vue");
const { VITE_PUBLIC_PATH } = loadEnv();

const remainingRouter = [
  {
    path: "/login",
    name: "Login",
    component: () => import("/@/views/login/index.vue"),
    meta: {
      title: $t("menus.hslogin"),
      showLink: false,
      rank: 101
    }
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      icon: "home-filled",
      title: $t("menus.hshome"),
      showLink: false,
      rank: 104
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("/@/layout/redirect.vue")
      }
    ]
  },
  {
    path: "/terms",
    component: Layout,
    meta: {
      icon: "monitor",
      title: "menus.hsExternalPage",
      showLink: false,
      rank: 10
    },
    children: [
      {
        path: "/terms",
        name: "TermsOfUse",
        component: IFrame,
        meta: {
          title: "Terms of Use",
          frameSrc: `${VITE_PUBLIC_PATH}html/terms-of-use.html`,
          hideFooter: true
        }
      }
    ]
  },
  {
    path: "/privacy-policy",
    component: Layout,
    meta: {
      icon: "monitor",
      title: "menus.hsExternalPage",
      showLink: false,
      rank: 10
    },
    children: [
      {
        path: "/privacy-policy",
        name: "PrivacyPolicy",
        component: IFrame,
        meta: {
          title: "Privacy Policy",
          frameSrc: `${VITE_PUBLIC_PATH}html/privacy-policy.html`,
          hideFooter: true
        }
      }
    ]
  }
];

export default remainingRouter;
