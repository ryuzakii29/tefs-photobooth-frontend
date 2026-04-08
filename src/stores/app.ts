import { defineStore } from "pinia";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:1337";
const API = `${BASE_URL}/api`;

const formatImageUrl = (path: string | null) => {
  if (!path) return "https://placehold.co/600x400?text=No+Image";
  if (path.startsWith("http")) return path;
  const cleanBase = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};

export const usePackageStore = defineStore("packages", {
  state: () => ({
    packages: [] as any[],
  }),
  getters: {
    allPackages: (state) => state.packages,
  },
  actions: {
    async fetchPackages() {
      try {
        const res = await axios.get(`${API}/packages?populate=*`);
        // Log this to confirm you see the 2 items again
        console.log("Fetching packages...", res.data.data);

        this.packages = res.data.data.map((pkg: any) => {
          // Based on your log: pkg.image is an array [ { url: '...' } ]
          const imgPath = pkg.image?.[0]?.url || null;

          return {
            id: pkg.id,
            name: pkg.name || "Unnamed Package",
            price: pkg.price || 0,
            description: pkg.description || "",
            inclusions: pkg.inclusions || [],
            imageUrl: formatImageUrl(imgPath),
          };
        });
      } catch (error) {
        console.error("Store error:", error);
      }
    },
  },
});

export const useGalleryStore = defineStore("galleries", {
  state: () => ({
    galleries: [] as Array<{ id: string | number; imageUrl: string }>,
  }),
  actions: {
    async fetchGalleries() {
      try {
        const res = await axios.get(`${API}/galleries?populate=*`);

        const allImages = res.data.data.flatMap((item: any) => {
          // Target the flat image array
          const imagesArray = item.image || [];

          return imagesArray.map((img: any) => ({
            id: img.id,
            imageUrl: formatImageUrl(img.url),
          }));
        });

        this.galleries = this.shuffleArray(allImages);
      } catch (error) {
        console.error("Failed to fetch galleries:", error);
      }
    },
    shuffleArray(array: any[]) {
      return array.sort(() => Math.random() - 0.5);
    },
  },
});

export const useUserStore = defineStore("user", {
  state: () => ({
    userOptions: {
      theme: "light",
      package: null as any,
    },
  }),
  getters: {
    currentTheme: (state) => state.userOptions.theme,
  },
  persist: true,
  actions: {
    setTheme(theme: string) {
      this.userOptions.theme = theme;
    },
    setPackage(pkg: any) {
      this.userOptions.package = pkg;
    },
  },
});
