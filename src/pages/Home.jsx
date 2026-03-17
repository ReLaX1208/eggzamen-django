// src/pages/Home.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRubrics } from "../features/rubrics/rubricsSlice";
import BentoCard from "../components/BentoCard";

export default function Home() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.rubrics);

  useEffect(() => {
    dispatch(fetchRubrics());
  }, [dispatch]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <section className="rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-zinc-900/30 backdrop-blur p-7">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="text-3xl md:text-4xl font-semibold tracking-tight">
              Каталог брендов
            </div>
            <div className="mt-2 text-sm md:text-base text-zinc-600 dark:text-zinc-300 max-w-2xl">
              Выбирай бренд — смотри объявления, цены и детали. Интерфейс сделан как витрина (bento + iOS minimal).
            </div>
          </div>

          <div className="flex gap-2">
            <div className="rounded-2xl px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/30">
              {items?.length || 0} брендов
            </div>
          </div>
        </div>
      </section>

      {/* States */}
      {status === "loading" ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[280px] rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-100/60 dark:bg-zinc-900/40 animate-pulse"
            />
          ))}
        </div>
      ) : null}

      {error ? (
        <div className="mt-6 rounded-3xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 p-5 text-red-700 dark:text-red-200">
          {error}
        </div>
      ) : null}

      {/* Grid */}
      <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items?.map((r) => (
          <BentoCard
            key={r.id}
            title={r.name}
            subtitle={`Просмотры: ${r.views ?? 0}`}
            photo={r.photo}                 // ВОТ ГЛАВНОЕ
            to={`/app/rubrics/${r.id}`}
          />
        ))}
      </section>
    </main>
  );
}
