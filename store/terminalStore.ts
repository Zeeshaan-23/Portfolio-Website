import { create } from "zustand";

interface TerminalState {
  isOpen: boolean;
  setOpen: (val: boolean) => void;
  toggleOpen: () => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  isOpen: false,
  setOpen: (val) => set({ isOpen: val }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}));
