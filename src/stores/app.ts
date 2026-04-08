import { defineStore } from "pinia";
import axios from "axios";
import { fallbackGallery } from "@/stores/state";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API = `${BASE_URL}/api`;

export const usePackageStore = defineStore("packages", {
  state: () => ({
    packages: [],
  }),
  getters: {
    allPackages: (state) => state.packages,
  },
  actions: {
    async fetchPackages() {
      try {
        const res = await axios.get(`${API}/packages?populate=*`);
        this.packages = res.data.data.map((pkg: any) => {
          // Based on your log: pkg.image is an array [ { url: '...' } ]
          const imgPath = pkg.image?.[0]?.url || null;

          return {
            id: pkg.id,
            ...pkg,
            imageUrl: imgPath
              ? `${BASE_URL}${imgPath}`
              : `https://placehold.co/600x400?text=No+Image+Found`,
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
          const imagesArray = item.image || [];

          return imagesArray.map((img: any, index: number) => {
            return imagesArray.map((img: any) => ({
              id: img.id,
              imageUrl: img?.url
                ? img.attributes?.url
                : `${BASE_URL}${img.attributes.url}`
                  ? fallbackGallery[index % fallbackGallery.length]
                  : `https://placehold.co/600x400?text=No+Image+Found`,
            }));
          });
        });

        if (allImages.length === 0) {
          this.galleries = this.shuffleArray(
            fallbackGallery.map((img, i) => ({
              id: `fallback-${i}`,
              imageUrl: img,
            })),
          );
        } else {
          this.galleries = this.shuffleArray(allImages);
        }
      } catch (error) {
        console.error("Failed to fetch galleries:", error);
        this.galleries = this.shuffleArray(
          fallbackGallery.map((img, i) => ({ id: `err-${i}`, imageUrl: img })),
        );
      }
    },

    shuffleArray(array: any[]) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
  },
});

export const useUserStore = defineStore("user", {
  state: () => ({
    userOptions: {
      theme: "light",
      package: null,
    },
  }),
  persist: {
    pick: ["userOptions.theme"],
  },
  getters: {
    currentTheme: (state) => state.userOptions.theme,
    selectedPackage: (state) => state.userOptions.package,
  },
  actions: {
    setTheme(theme: string) {
      this.userOptions.theme = theme;
    },
    setPackage(pkg: any) {
      this.userOptions.package = pkg;
    },
  },
});
