import { create } from "zustand";

interface MonthSelectState {
  isOpen: boolean;
  currentTarget: string; // "2026-07"
  onSelect: (year: number, month: number) => void;
  openMonthSelect: (
    currentTarget: string,
    onSelect: (year: number, month: number) => void,
  ) => void;
  closeMonthSelect: () => void;
}

export const useMonthSelectStore = create<MonthSelectState>((set) => ({
  isOpen: false,
  currentTarget: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`,
  onSelect: () => {},
  openMonthSelect: (currentTarget, onSelect) =>
    set({ isOpen: true, currentTarget, onSelect }),
  closeMonthSelect: () => set({ isOpen: false }),
}));
