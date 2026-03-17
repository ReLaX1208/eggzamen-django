import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError } from "../features/auth/authSlice";
import { useEffect } from "react";

// Django origin (через .env или fallback)
const DJANGO_ORIGIN =
  import.meta.env.VITE_DJANGO_ORIGIN || "http://127.0.0.1:8000";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error } = useSelector((s) => s.auth);

  // чистим возможные ошибки логина
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors">
      <div className="w-full max-w-md rounded-3xl bg-zinc-50/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 backdrop-blur p-6">
        <h1 className="text-2xl font-semibold">Регистрация</h1>

        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Регистрация сейчас выполняется через сервер Django.
          <br />
          После регистрации ты сможешь войти и пользоваться приложением.
        </p>

        {error && (
          <div className="mt-4 text-sm text-red-600 dark:text-red-300 border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 rounded-2xl px-4 py-3">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-3">
          {/* Django registration */}
          <a
            href={`${DJANGO_ORIGIN}/accounts/register/`}
            className="block w-full text-center rounded-2xl bg-zinc-900 text-white font-medium py-3 hover:bg-zinc-800 transition"
          >
            Перейти к регистрации
          </a>

          {/* Back to login */}
          <button
            onClick={() => navigate("/login")}
            className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            Уже есть аккаунт
          </button>
        </div>

        <div className="mt-4 text-sm text-zinc-500 dark:text-zinc-400 text-center">
          ←{" "}
          <Link to="/" className="hover:opacity-80">
            Вернуться на лендинг
          </Link>
        </div>
      </div>
    </div>
  );
}
