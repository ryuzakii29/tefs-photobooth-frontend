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

        this.packages = res.data.data.map((pkg: any) => {
          const attrs = pkg.attributes || pkg;
          const imgData = attrs.image?.data || attrs.image;

          let path = null;
          if (Array.isArray(imgData)) {
            path = imgData[0]?.attributes?.url || imgData[0]?.url;
          } else {
            path = imgData?.attributes?.url || imgData?.url;
          }

          return {
            id: pkg.id,
            ...attrs,
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
          const attrs = item.attributes || item;
          const imagesData = attrs.image?.data || attrs.image || [];

          // Ensure imagesData is treated as an array
          const imagesArray = Array.isArray(imagesData)
            ? imagesData
            : [imagesData];

          return imagesArray.map((img: any) => {
            const path = img.attributes?.url || img.url;
            return {
              id: img.id,
              imageUrl: formatImageUrl(path),
            };
          });
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
