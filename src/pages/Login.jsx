import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk, clearAuthError } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { status, error, user } = useSelector((s) => s.auth);

  useEffect(() => {
    // очистка ошибки при входе на страницу
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    // если уже залогинен — сразу в приложение
    if (user) nav("/app");
  }, [user, nav]);

  async function onSubmit(values) {
    const res = await dispatch(loginThunk(values));
    if (res.meta.requestStatus === "fulfilled") {
      nav("/app");
    }
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-zinc-50/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 backdrop-blur p-6">
        <div className="text-2xl font-semibold">Вход</div>
        <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Вводи логин или email (у тебя EmailAuthBackend поддерживает email как username).
        </div>

        <form className="mt-6 space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <input
            className="w-full rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
            placeholder="Логин или Email"
            {...register("username", { required: true })}
          />
          <input
            type="password"
            className="w-full rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
            placeholder="Пароль"
            {...register("password", { required: true })}
          />

          {error ? (
            <div className="text-sm text-red-600 dark:text-red-300 border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 rounded-2xl px-4 py-3">
              {error}
            </div>
          ) : null}

          <button
            disabled={status === "loading"}
            className="w-full rounded-2xl bg-zinc-900 text-white font-medium py-3 hover:bg-zinc-800 disabled:opacity-60 transition"
          >
            {status === "loading" ? "Входим..." : "Войти"}
          </button>
        </form>

        <div className="mt-4 flex justify-between text-sm text-zinc-600 dark:text-zinc-300">
          <Link to="/" className="hover:opacity-80">← На лендинг</Link>
          <Link to="/register" className="hover:opacity-80">Регистрация</Link>
        </div>
      </div>
    </div>
  );
}
