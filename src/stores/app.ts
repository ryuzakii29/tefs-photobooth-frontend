import { defineStore } from "pinia";
import axios from "axios";

const formatImageUrl = (path: string | null) => {
  if (!path) return `https://placehold.co/600x400?text=No+Image`;
  if (path.startsWith("http")) return path;
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:1337";
  return `${BASE_URL}${path}`;
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:1337";
const API = `${BASE_URL}/api`;

export const usePackageStore = defineStore("packages", {
  state: () => ({
    packages: [] as any[],
  }),
  actions: {
    async fetchPackages() {
      try {
        const res = await axios.get(`${API}/packages?populate=*`);

        // Strapi 5 flat mapping
        this.packages = res.data.data.map((pkg: any) => {
          // In your log, image is an array: image: [{…}]
          const firstImage = pkg.image?.[0];
          const path = firstImage?.url || null;

          return {
            ...pkg, // This spreads name, price, description, etc. directly
            imageUrl: formatImageUrl(path),
          };
        });
      } catch (error) {
        console.error("Failed to fetch packages:", error);
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
