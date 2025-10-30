import { create } from "zustand";

export interface AppState {
  favorites: number[]; // user ids
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  loadFromLocal: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  favorites: [],
  toggleFavorite: (id: number) => {
    const favs = get().favorites;
    const exists = favs.includes(id);
    const next = exists ? favs.filter((x) => x !== id) : [...favs, id];
    set({ favorites: next });
    try {
      localStorage.setItem("ue_favorites", JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
  },
  isFavorite: (id: number) => {
    return get().favorites.includes(id);
  },
  loadFromLocal: () => {
    try {
      const raw = localStorage.getItem("ue_favorites");
      if (raw) set({ favorites: JSON.parse(raw) as number[] });
    } catch {
      // ignore parse errors
    }
  },
}));
