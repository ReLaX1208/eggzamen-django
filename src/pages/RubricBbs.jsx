// src/pages/RubricBbs.jsx
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBbsByRubric } from "../features/bbs/bbsSlice";

export default function RubricBbs() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.bbs);

  useEffect(() => {
    dispatch(fetchBbsByRubric(id));
  }, [dispatch, id]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold">Объявления бренда</div>
          <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            /api/rubrics/{id}/bbs/
          </div>
        </div>

        <Link
          to="/app"
          className="px-4 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
        >
          ← Назад
        </Link>
      </div>

      {status === "loading" ? <div className="mt-6 text-zinc-400">Загрузка...</div> : null}
      {error ? <div className="mt-6 text-red-500">{error}</div> : null}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {items?.map((bb) => (
          <Link
            key={bb.id}
            to={`/app/bbs/${bb.id}`}
            className="block rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 backdrop-blur p-5 hover:shadow-soft transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold">{bb.title}</div>
                <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2">
                  {bb.content}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-zinc-500">Цена</div>
                <div className="text-xl font-semibold">{bb.price ?? "—"}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
