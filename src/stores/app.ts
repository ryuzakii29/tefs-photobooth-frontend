import { defineStore } from "pinia";
import axios from "axios";

import { packageStore, userStore } from "./state";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:1337";
const API = `${BASE_URL}/api`;

export const usePackageStore = defineStore("packages", {
  state: () => ({
    packages: packageStore?.packages || [],
  }),
  getters: {
    allPackages: (state) => state.packages,
  },
  actions: {
    async fetchPackages() {
      try {
        const res = await axios.get(`${API}/packages?populate=*`);
        this.packages = res.data.data.map((pkg: any) => {
          const imgData = pkg.attributes?.image?.data || pkg.image?.data;

          let imgPath = null;

          if (Array.isArray(imgData)) {
            imgPath = imgData[0]?.attributes?.url;
          } else if (imgData) {
            imgPath = imgData.attributes?.url;
          }

          return {
            id: pkg.id,
            ...pkg.attributes,
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
          // Extract the array of images from the gallery item
          const imagesArray =
            item.attributes?.image?.data || item.image?.data || [];

          return imagesArray.map((img: any) => ({
            id: img.id,
            imageUrl: img.attributes?.url
              ? `${BASE_URL}${img.attributes.url}`
              : `https://placehold.co/600x400?text=No+Image`,
          }));
        });

        this.galleries = this.shuffleArray(allImages);
      } catch (error) {
        console.error("Failed to fetch galleries:", error);
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
    userOptions: userStore?.userOptions || {
      theme: "light",
      package: null,
    },
  }),
  persist: {
    // Specify only the nested path you want to save
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
