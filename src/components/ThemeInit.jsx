import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function ThemeInit() {
  const mode = useSelector((s) => s.theme.mode);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [mode]);

  return null;
}
