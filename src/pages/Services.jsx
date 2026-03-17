// src/pages/Services.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../features/services/servicesSlice";
import { mediaUrl } from "../lib/media";

export default function Services() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.services);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <section className="flex items-end justify-between gap-4">
        <div>
          <div className="text-3xl font-semibold tracking-tight">Сервисы</div>
          <div className="mt-2 text-zinc-600 dark:text-zinc-300">
            Витрина услуг. Дальше можно добавить CRUD для superuser.
          </div>
        </div>
      </section>

      {status === "loading" ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[260px] rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-100/60 dark:bg-zinc-900/40 animate-pulse"
            />
          ))}
        </div>
      ) : null}

      {error ? (
        <div className="mt-6 rounded-3xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 p-5 text-red-700 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {items?.map((s) => {
          const bg = mediaUrl(s.photo);
          return (
            <article
              key={s.id}
              className="overflow-hidden rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-zinc-900/35 backdrop-blur
                         shadow-[0_10px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
            >
              <div className="relative h-44">
                {bg ? (
                  <>
                    <div
                      className="absolute inset-0 bg-center bg-cover"
                      style={{ backgroundImage: `url("${bg}")` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-200/70 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800" />
                )}
              </div>

              <div className="p-6">
                <div className="text-xl font-semibold tracking-tight">{s.title}</div>
                <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-200 whitespace-pre-line">
                  {s.description}
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {s.created_at ? new Date(s.created_at).toLocaleDateString() : ""}
                  </div>
                  <button
                    className="px-4 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-800
                               hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                  >
                    Подробнее →
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
