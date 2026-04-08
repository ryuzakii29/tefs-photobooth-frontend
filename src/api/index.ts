import { generateTrackingUrl } from "@/composables";
import axios from "axios";
import type { st } from "vue-router/dist/index-BzEKChPW.js";

const STRAPI_URL = import.meta.env.VITE_API_BASE_URL + "/api/reservations";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const submitReservation = async (formData: any) => {
  formData.value.url = generateTrackingUrl();

  const payload = {
    ...formData.value,
    event_time: formData.value.event_time
      ? `${formData.value.event_time}:00.000`
      : null,
  };

  try {
    const response = await fetch(`${apiBaseUrl}/api/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: payload }), // Use formatted payload here
    });

    return response;
  } catch (error) {
    return { error };
  }
};

export const fetchReservations = async () => {
  const token = localStorage.getItem("strapi_jwt");
  try {
    const response = await fetch(`${apiBaseUrl}/api/reservations?populate=*`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return { error };
  }
};

export const updateStatus = async (item: any) => {
  try {
    console.log("Updating reservation:", item);
    await axios.put(`${STRAPI_URL}/${item.documentId}`, {
      data: {
        progress: item.progress,
        payment:
          item.progress === "confirmed" || item.progress === "done"
            ? true
            : false,
      },
    });
    return true;
  } catch (error) {
    console.error("Error updating reservation status:", error);
    return false;
  }
};

export const handleLogin = async (email: string, password: string) => {
  if (!email || !password) return;

  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const response = await axios.post(`${apiBaseUrl}/api/auth/local`, {
      identifier: email,
      password: password,
    });

    localStorage.setItem("strapi_jwt", response.data.jwt);

    localStorage.setItem("user", JSON.stringify(response.data.user));

    return true;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
};
