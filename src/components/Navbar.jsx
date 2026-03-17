// src/components/Navbar.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { setLang } from "../i18n";
import { toggleTheme } from "../features/theme/themeSlice";
import { logoutThunk, meThunk } from "../features/auth/authSlice";
import { useState } from "react";

function cx(...a) {
  return a.filter(Boolean).join(" ");
}

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const user = useSelector((s) => s.auth.user);
  const mode = useSelector((s) => s.theme?.mode || "light");

  const [q, setQ] = useState("");

  async function onLogout() {
    await dispatch(logoutThunk());
    await dispatch(meThunk());
    navigate("/");
  }

  function onSearchSubmit(e) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    navigate(`/app/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="rounded-[24px] border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-zinc-950/60 backdrop-blur shadow-soft px-4 py-3 flex items-center gap-3">
          {/* left */}
          <Link to="/" className="font-semibold tracking-tight">
            {t("brand")}
          </Link>

          {/* center nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cx(
                  "px-3 py-2 rounded-xl text-sm transition",
                  isActive
                    ? "bg-zinc-900 text-white"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-900/60"
                )
              }
            >
              {t("home")}
            </NavLink>

            <NavLink
              to={user ? "/app/services" : "/login"}
              className={({ isActive }) =>
                cx(
                  "px-3 py-2 rounded-xl text-sm transition",
                  isActive
                    ? "bg-zinc-900 text-white"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-900/60"
                )
              }
            >
              {t("services")}
            </NavLink>

            {user ? (
              <NavLink
                to="/app/profile"
                className={({ isActive }) =>
                  cx(
                    "px-3 py-2 rounded-xl text-sm transition",
                    isActive
                      ? "bg-zinc-900 text-white"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-900/60"
                  )
                }
              >
                {t("profile") || "Профиль"}
              </NavLink>
            ) : null}
          </nav>

          {/* search (only when logged in) */}
          {user ? (
            <form
              onSubmit={onSearchSubmit}
              className="hidden lg:flex items-center gap-2 flex-1 max-w-md mx-2"
            >
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="w-full rounded-2xl bg-white/80 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 px-4 py-2 outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
              />
              <button
                className="px-3 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                type="submit"
                title="Search"
              >
                ↵
              </button>
            </form>
          ) : (
            <div className="flex-1" />
          )}

          {/* right actions */}
          <div className="ml-auto flex items-center gap-2">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition text-sm"
                >
                  {t("login")}
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition text-sm"
                >
                  {t("register")}
                </Link>
              </>
            ) : (
              <button
                onClick={onLogout}
                className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition text-sm"
                type="button"
              >
                {t("logout")}
              </button>
            )}

            <button
              onClick={() => setLang(i18n.language === "ru" ? "en" : "ru")}
              className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition text-sm"
              title="Language"
              type="button"
            >
              {(i18n.language || "ru").toUpperCase()}
            </button>

            <button
              onClick={() => dispatch(toggleTheme())}
              className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition text-sm"
              title="Theme"
              type="button"
            >
              {mode === "dark" ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
