import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/login", component: () => import("@/pages/login.vue") },
    {
      path: "/admin/reservations",
      component: () => import("../pages/admin.vue"),
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem("strapi_jwt");
        if (!token) {
          next("/login"); // Redirect to your Vue login page
        } else {
          next(); // Allow entry
        }
      },
    },
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

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("strapi_jwt");

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.path === "/login" && isAuthenticated) {
    next("/admin/reservations"); // Already logged in? Skip login page.
  } else {
    next();
  }
});

export default router;
