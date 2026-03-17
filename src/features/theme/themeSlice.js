import { createSlice } from "@reduxjs/toolkit";

const KEY = "theme-mode";

function getInitialMode() {
  const saved = localStorage.getItem(KEY);
  if (saved === "dark" || saved === "light") return saved;

  // если ничего не сохранено — берём системную
  const prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "light";
}

function applyMode(mode) {
  const root = document.documentElement; // <html>
  if (mode === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  localStorage.setItem(KEY, mode);
}

const initialMode = getInitialMode();
applyMode(initialMode);

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: initialMode, // "light" | "dark"
  },
  reducers: {
    setTheme(state, action) {
      const mode = action.payload === "dark" ? "dark" : "light";
      state.mode = mode;
      applyMode(mode);
    },
    toggleTheme(state) {
      const next = state.mode === "dark" ? "light" : "dark";
      state.mode = next;
      applyMode(next);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
