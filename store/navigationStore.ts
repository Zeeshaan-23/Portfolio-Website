import { create } from "zustand";

export type SectionId =
  | "about"
  | "skills-certs"
  | "projects"
  | "experience"
  | "domains"
  | null;

interface NavigationState {
  currentSection: SectionId;
  setCurrentSection: (section: SectionId) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentSection: null,
  setCurrentSection: (section) => set({ currentSection: section }),
}));
