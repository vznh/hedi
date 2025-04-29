// stores/useSequenceStore
import { create } from "zustand";

interface SequenceState {
  currentView:
    | "intro"
    | "entrance"
    | "about"
    | "works"
    | "designs"
    | "competitions"
    | "philosophy"
    | "products"
    | "chatting";
  introCompleted: boolean;
  setCurrentView: (view: SequenceState["currentView"]) => void;
  completeIntro: () => void;
  resetSequence: () => void;
}

export const useSequenceStore = create<SequenceState>((set) => ({
  currentView: "intro",
  introCompleted: false,
  setCurrentView: (view) => set({ currentView: view }),
  completeIntro: () => set({ introCompleted: true, currentView: "entrance" }),
  resetSequence: () => set({ currentView: "intro", introCompleted: false }),
}));
