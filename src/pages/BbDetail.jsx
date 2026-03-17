// src/pages/BbDetail.jsx
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBbById } from "../features/bbs/bbsSlice";

export default function BbDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, status, error } = useSelector((s) => s.bbs);

  useEffect(() => {
    dispatch(fetchBbById(id));
  }, [dispatch, id]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to={-1}
        className="inline-flex px-4 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
      >
        ← Назад
      </Link>

      {status === "loading" ? <div className="mt-6 text-zinc-400">Загрузка...</div> : null}
      {error ? <div className="mt-6 text-red-500">{error}</div> : null}

      {current ? (
        <div className="mt-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 backdrop-blur p-6">
          <div className="text-2xl font-semibold">{current.title}</div>
          <div className="mt-2 text-sm text-zinc-500">ID: {current.id}</div>

          <div className="mt-6 text-zinc-700 dark:text-zinc-200 whitespace-pre-line">
            {current.content}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-zinc-500">Цена</div>
            <div className="text-3xl font-semibold">{current.price ?? "—"}</div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
