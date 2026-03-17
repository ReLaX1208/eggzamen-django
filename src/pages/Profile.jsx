// src/pages/Profile.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { meThunk } from "../features/auth/authSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const { user, status } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(meThunk());
  }, [dispatch]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-2xl font-semibold">Профиль</div>
      <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Данные берём из /api/auth/me/
      </div>

      {status === "loading" ? <div className="mt-6 text-zinc-400">Загрузка...</div> : null}

      <div className="mt-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 backdrop-blur p-6">
        {user ? (
          <div className="space-y-2">
            <div><span className="text-zinc-500">ID:</span> {user.id}</div>
            <div><span className="text-zinc-500">Username:</span> {user.username}</div>
            <div><span className="text-zinc-500">Email:</span> {user.email || "—"}</div>
            <div><span className="text-zinc-500">Superuser:</span> {user.is_superuser ? "Yes" : "No"}</div>
          </div>
        ) : (
          <div className="text-zinc-500">Нет данных пользователя.</div>
        )}
      </div>
    </main>
  );
}
