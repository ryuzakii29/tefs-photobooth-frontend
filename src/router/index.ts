import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/home",
      component: () => import("@/pages/home.vue"),
    },
    {
      path: "/packages",
      component: () => import("@/pages/packages.vue"),
    },
    {
      path: "/gallery",
      component: () => import("@/pages/gallery.vue"),
    },
    {
      path: "/about",
      component: () => import("@/pages/about.vue"),
    },
    {
      path: "/contact",
      component: () => import("@/pages/contact.vue"),
    },
    {
      path: "/reservation",
      component: () => import("@/pages/reservation.vue"),
    },
    {
      path: "/reservation/:id",
      name: "reserved-view",
      component: () => import("@/pages/reserved.vue"),
    },
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/pages/notfound.vue"),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: "smooth" };
  },
});

export default router;
