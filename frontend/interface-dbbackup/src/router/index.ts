import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import UserView from "../views/users/index.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Messages",
      component: HomeView,
    },
    {
      path: "/users",
      name: "User",
      component: UserView,
    },
  ],
});

export default router;
