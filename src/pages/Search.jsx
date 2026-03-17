// src/pages/Search.jsx
import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchBbs } from "../features/bbs/bbsSlice";

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const dispatch = useDispatch();
  const { searchItems, searchStatus, searchError } = useSelector((s) => s.bbs);

  useEffect(() => {
    if (q.trim()) dispatch(searchBbs(q));
  }, [dispatch, q]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold">Поиск</div>
          <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Запрос: <span className="font-medium">{q || "—"}</span>
          </div>
        </div>
        <Link
          to="/app"
          className="px-4 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
        >
          ← На главную
        </Link>
      </div>

      {searchStatus === "loading" ? <div className="mt-6 text-zinc-400">Ищем...</div> : null}
      {searchError ? <div className="mt-6 text-red-500">{searchError}</div> : null}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {searchItems?.map((bb) => (
          <Link
            key={bb.id}
            to={`/app/bbs/${bb.id}`}
            className="block rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 backdrop-blur p-5 hover:shadow-soft transition"
          >
            <div className="text-lg font-semibold">{bb.title}</div>
            <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2">
              {bb.content}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
