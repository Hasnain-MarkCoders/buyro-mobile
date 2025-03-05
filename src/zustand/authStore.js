import { create } from 'zustand';
import { post } from '../config/requests';
import { persist, createJSONStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

// Initialize MMKV storage
const mmkvStorage = new MMKV();

// Define Zustand-compatible MMKV storage
const zustandStorage = {
  setItem: (name, value) => {
    mmkvStorage.set(name, value);
  },
  getItem: (name) => {
    const value = mmkvStorage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    mmkvStorage.delete(name);
  },
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,

      login: async (credentials) => {
        try {
          const res = await post("/app/customer/login", credentials);
          set({ user: res.data }); // Save user in Zustand state
          return res;
        } catch (error) {
          console.error("Login Error:", error);
          throw error;
        }
      },
      updateUser: (updatedCustomer) => {
        set((state) => ({
          user: {
            ...state.user, // Preserve existing user data (tokens)
            customer: { ...updatedCustomer }, // Update only customer details
          },
        }));
      },
      signup: async (credentials) => {
        try {
          const res = await post("/app/customer/signup", credentials);
          set({ user: res.data });
          return res;
        } catch (error) {
          console.error("Signup Error:", error);
          throw error;
        }
      },

      recoverPassword: async (email) => {
        try {
          return await post("/app/customer/recover", { email });
        } catch (error) {
          console.error("Password Recovery Error:", error);
          throw error;
        }
      },

      logout: () => {
        set({ user: null });
        zustandStorage.removeItem("auth-storage"); // Clear user from MMKV
      },
    }),
    {
      name: "auth-storage", // Key for MMKV
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export default useAuthStore;
