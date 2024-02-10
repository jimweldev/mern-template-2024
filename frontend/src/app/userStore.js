import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const userStore = (set) => ({
  users: [],
  addUser: (user) => {
    set((state) => ({
      users: [user, ...state.users],
    }));
  },
  removeUser: (userId) => {
    set((state) => ({
      users: state.users.filter((c) => c.id !== userId),
    }));
  },
  removeUsers: () => {
    set(() => ({
      users: [],
    }));
  },
});

const useUserStore = create(
  devtools(
    persist(userStore, {
      name: "users",
    })
  )
);

export default useUserStore;
