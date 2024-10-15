import { StoreApi } from "zustand";
import { UseBoundStore } from "zustand";
import { create } from "zustand";
import User from "../data/responses/User";

const useUserStore: UseBoundStore<
  StoreApi<{ currentUser: User | undefined; setUser: (user: User) => void }>
> = create((set) => ({
  currentUser: undefined,
  setUser: (user: User) => set({ currentUser: user }),
}));

export default useUserStore;
