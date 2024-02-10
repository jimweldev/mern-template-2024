import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const authStore = (set) => ({
  auth: null,
  setAuth: (auth) => {
    set(() => ({
      auth: auth,
    }));
  },
  removeAuth: () => {
    set(() => ({
      auth: null,
    }));
  },
});

const useAuthStore = create(
  devtools(
    persist(authStore, {
      name: "auth",
    })
  )
);

export default useAuthStore;
