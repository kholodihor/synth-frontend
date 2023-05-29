import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/bands",
      name: "bands",
      component: () => import("../views/BandsView.vue"),
    },
    {
      path: "/band/:id",
      name: "band",
      component: () => import("../views/BandView.vue"),
    },
    {
      path: "/login",
      beforeEnter: (to, from, next) => {
        useUserStore()._id
          ? next("account/profile/" + useUserStore()._id)
          : next();
      },
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/register",
      beforeEnter: (to, from, next) => {
        useUserStore()._id
          ? next("account/profile/" + useUserStore()._id)
          : next();
      },
      name: "register",
      component: () => import("../views/RegisterView.vue"),
    },
    {
      path: "/account",
      beforeEnter: (to, from, next) => {
        useUserStore()._id ? next() : next("/login");
      },
      name: "account",
      component: () => import("../views/account/index.vue"),

      children: [
        {
          path: "profile/:id",
          name: "profile",
          component: () => import("../views/account/ProfileView.vue"),
        },
        {
          path: "edit-profile",
          name: "edit-profile",
          component: () => import("../views/account/EditProfile.vue"),
        },
        {
          path: "add-song",
          name: "add-song",
          component: () => import("../views/account/AddSong.vue"),
        },
        {
          path: "delete-song",
          name: "delete-song",
          component: () => import("../views/account/DeleteSong.vue"),
        },
        {
          path: "add-video",
          name: "add-video",
          component: () => import("../views/account/AddVideo.vue"),
        },
        {
          path: "delete-video",
          name: "delete-video",
          component: () => import("../views/account/DeleteVideo.vue"),
        },
        {
          path: "add-band",
          name: "add-band",
          component: () => import("../views/account/AddBand.vue"),
        },
        {
          path: "edit-band/:id",
          name: "edit-band",
          component: () => import("../views/account/EditBand.vue"),
        },
      ],
    },
  ],
});

export default router;
