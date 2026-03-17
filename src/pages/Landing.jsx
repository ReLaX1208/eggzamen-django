// src/pages/Landing.jsx
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

const DJ = import.meta.env.VITE_DJANGO_ORIGIN || "http://127.0.0.1:8000";
const API = import.meta.env.VITE_API_BASE || "/api";

function cx(...arr) {
  return arr.filter(Boolean).join(" ");
}

function mediaUrl(url) {
  if (!url) return "";
  // если бэк уже отдает абсолютный URL — оставляем
  if (/^https?:\/\//i.test(url)) return url;
  // если относительный /media/... — приводим к Django origin
  if (url.startsWith("/")) return `${DJ}${url}`;
  return `${DJ}/${url}`;
}

function IconArrowRight({ className = "" }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconStar({ className = "" }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3l2.6 6.6 7 .6-5.3 4.4 1.7 6.8L12 18.7 6 21.4l1.7-6.8L2.4 10.2l7-.6L12 3z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-zinc-900/40 px-3 py-1 text-xs text-zinc-600 dark:text-zinc-300 backdrop-blur">
      {children}
    </span>
  );
}

function BentoCard({ className = "", children }) {
  return (
    <div
      className={cx(
        "rounded-[28px] border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-zinc-900/40 backdrop-blur shadow-soft",
        className
      )}
    >
      {children}
    </div>
  );
}

function BrandCard({ brand }) {
  const img = mediaUrl(brand?.photo);
  return (
    <Link
      to={`/app/rubrics/${brand.id}`}
      className="group relative rounded-[28px] overflow-hidden border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-950/5 dark:bg-zinc-900/30 shadow-soft focus:outline-none focus:ring-2 focus:ring-zinc-400/50 dark:focus:ring-zinc-700/60"
    >
      {/* background image */}
      <div className="absolute inset-0">
        {img ? (
          <img
            src={img}
            alt={brand?.name || "Brand"}
            className="h-full w-full object-cover opacity-90 group-hover:scale-[1.03] transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-zinc-200/60 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900" />
        )}
        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
      </div>

      {/* content */}
      <div className="relative p-5 flex flex-col justify-end min-h-[170px]">
        <div className="flex items-center justify-between gap-3">
          <div className="text-lg font-semibold tracking-tight text-white">
            {brand?.name || "—"}
          </div>
          <span className="text-xs text-white/75">
            {brand?.views ?? 0} просмотров
          </span>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 text-sm text-white/85">
          Открыть <IconArrowRight className="opacity-90" />
        </div>
      </div>
    </Link>
  );
}

function ServiceCard({ service }) {
  const img = mediaUrl(service?.photo);
  return (
    <div className="rounded-[28px] overflow-hidden border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-zinc-900/40 backdrop-blur shadow-soft">
      <div className="relative h-44 w-full bg-zinc-200/40 dark:bg-zinc-800/40">
        {img ? (
          <img
            src={img}
            alt={service?.title || "Service"}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-white font-semibold tracking-tight text-lg">
            {service?.title || "—"}
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-4">
          {service?.description || "Описание скоро появится."}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {service?.created_at ? new Date(service.created_at).toLocaleDateString() : ""}
          </span>
          <Link
            to="/login"
            className="text-sm font-medium text-zinc-900 dark:text-white hover:opacity-80"
          >
            Заказать <IconArrowRight className="inline-block -mb-[2px]" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const { t } = useTranslation();
  const user = useSelector((s) => s.auth.user);

  // Search (API: /api/search/?q=...)
  const [q, setQ] = useState("");
  const [searchStatus, setSearchStatus] = useState("idle"); // idle|loading|done|error
  const [searchError, setSearchError] = useState("");
  const [searchItems, setSearchItems] = useState([]);

  // Popular brands (rubrics)
  const [brandsStatus, setBrandsStatus] = useState("idle");
  const [brandsError, setBrandsError] = useState("");
  const [brands, setBrands] = useState([]);

  // Services preview
  const [servicesStatus, setServicesStatus] = useState("idle");
  const [servicesError, setServicesError] = useState("");
  const [services, setServices] = useState([]);

  // Hero slider images (берем из брендов, если есть фото)
  const sliderImages = useMemo(() => {
    const imgs = brands
      .map((b) => mediaUrl(b?.photo))
      .filter(Boolean)
      .slice(0, 6);
    return imgs.length ? imgs : [
      // fallback placeholders (не критично)
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=70",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=70",
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=70",
    ];
  }, [brands]);

  const [slide, setSlide] = useState(0);

  useEffect(() => {
    // автослайдер
    if (!sliderImages.length) return;
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % sliderImages.length);
    }, 3500);
    return () => clearInterval(id);
  }, [sliderImages.length]);

  useEffect(() => {
    // load popular brands
    (async () => {
      try {
        setBrandsStatus("loading");
        setBrandsError("");
        const res = await fetch(`${API}/rubrics/`, { credentials: "include" });
        const data = await res.json().catch(() => []);
        if (!res.ok) throw new Error("Не удалось загрузить бренды");
        setBrands(Array.isArray(data) ? data : []);
        setBrandsStatus("done");
      } catch (e) {
        setBrandsStatus("error");
        setBrandsError(e?.message || "Ошибка");
      }
    })();
  }, []);

  useEffect(() => {
    // load services preview
    (async () => {
      try {
        setServicesStatus("loading");
        setServicesError("");
        const res = await fetch(`${API}/services/`, { credentials: "include" });
        const data = await res.json().catch(() => []);
        if (!res.ok) throw new Error("Не удалось загрузить сервисы");
        setServices(Array.isArray(data) ? data : []);
        setServicesStatus("done");
      } catch (e) {
        setServicesStatus("error");
        setServicesError(e?.message || "Ошибка");
      }
    })();
  }, []);

  async function runSearch(e) {
    e?.preventDefault?.();
    const query = q.trim();
    if (!query) {
      setSearchItems([]);
      setSearchStatus("idle");
      setSearchError("");
      return;
    }
    try {
      setSearchStatus("loading");
      setSearchError("");
      const res = await fetch(`${API}/search/?q=${encodeURIComponent(query)}`, {
        credentials: "include",
      });
      const data = await res.json().catch(() => []);
      if (!res.ok) throw new Error("Поиск недоступен");
      setSearchItems(Array.isArray(data) ? data : []);
      setSearchStatus("done");
    } catch (e2) {
      setSearchStatus("error");
      setSearchError(e2?.message || "Ошибка поиска");
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* HERO + HEADER-LIKE SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left: hero */}
        <BentoCard className="md:col-span-7 p-8 relative overflow-hidden">
          {/* subtle background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-zinc-900/5 dark:bg-white/5 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-zinc-900/5 dark:bg-white/5 blur-3xl" />
          </div>

          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <Pill>
                <IconStar className="opacity-70" />
                Premium cars
              </Pill>
              <Pill>Бронирование</Pill>
              <Pill>Проверка</Pill>
            </div>

            <h1 className="mt-5 text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
              Премиальные авто{" "}
              <span className="text-zinc-500 dark:text-zinc-400">
                без лишнего шума
              </span>
            </h1>

            <p className="mt-4 text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed">
              Выбери бренд, смотри объявления и бронируй подбор.
              Поможем найти авто под бюджет и запрос, а также проверим перед покупкой.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to={user ? "/app" : "/login"}
                className="px-5 py-3 rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 transition"
              >
                Забронировать
              </Link>

              {!user ? (
                <Link
                  to="/login"
                  className="px-5 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                >
                  Войти
                </Link>
              ) : null}
            </div>

            {/* Search bar */}
            <form onSubmit={runSearch} className="mt-7">
              <div className="flex gap-2">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Поиск объявлений (например: Porsche, 911, S-класс)…"
                  className="flex-1 rounded-2xl bg-white/70 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 px-4 py-3 outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                />
                <button
                  type="submit"
                  className="rounded-2xl px-4 py-3 bg-zinc-900 text-white hover:bg-zinc-800 transition"
                >
                  Найти
                </button>
              </div>

              {searchStatus === "loading" ? (
                <div className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                  Ищем…
                </div>
              ) : null}
              {searchStatus === "error" ? (
                <div className="mt-3 text-sm text-red-600 dark:text-red-300">
                  {searchError}
                </div>
              ) : null}

              {searchStatus === "done" ? (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {searchItems.slice(0, 4).map((bb) => (
                    <div
                      key={bb.id}
                      className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-zinc-900/40 backdrop-blur p-4"
                    >
                      <div className="font-semibold tracking-tight">
                        {bb.title || "Без названия"}
                      </div>
                      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2">
                        {bb.content || ""}
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">
                          Цена: {bb.price ?? "—"}
                        </span>
                        <Link
                          to={user ? `/app/rubrics/${bb.rubric}` : "/login"}
                          className="font-medium hover:opacity-80"
                        >
                          Открыть
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </form>
          </div>
        </BentoCard>

        {/* Right: bento stack */}
        <div className="md:col-span-5 grid grid-cols-2 gap-4">
          <BentoCard className="col-span-2 overflow-hidden">
            <div className="relative h-[220px] w-full">
              <img
                src={sliderImages[slide]}
                alt="Hero car"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <div className="text-white font-semibold tracking-tight">
                    Коллекция дня
                  </div>
                  <div className="text-white/80 text-sm">
                    Популярные бренды и свежие предложения
                  </div>
                </div>
                <div className="flex gap-1">
                  {sliderImages.slice(0, 6).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSlide(i)}
                      className={cx(
                        "h-2 w-2 rounded-full",
                        i === slide ? "bg-white" : "bg-white/40"
                      )}
                      aria-label={`Slide ${i + 1}`}
                      type="button"
                    />
                  ))}
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Replaced cards (site-focused) */}
          <BentoCard className="p-5">
            <div className="text-sm text-zinc-500">Подбор</div>
            <div className="mt-2 font-semibold tracking-tight">
              Подберём авто под ваш запрос
            </div>
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              Бюджет, год, пробег, кузов — соберём варианты и покажем лучшие.
            </div>
          </BentoCard>

          <BentoCard className="p-5">
            <div className="text-sm text-zinc-500">Гарантии</div>
            <div className="mt-2 font-semibold tracking-tight">
              Проверка перед покупкой
            </div>
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              Документы, история, диагностика — минимум рисков, максимум прозрачности.
            </div>
          </BentoCard>
        </div>
      </section>

      {/* ABOUT + CTA */}
      <section className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-4">
        <BentoCard className="md:col-span-8 p-8">
          <div className="text-xl font-semibold tracking-tight">О сервисе</div>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Здесь собраны популярные бренды и актуальные объявления — можно быстро выбрать марку,
            посмотреть варианты и перейти к подбору. Мы помогаем с выбором, проверкой и
            сопровождением сделки — от первого запроса до покупки.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={user ? "/app/services" : "/login"}
              className="px-5 py-3 rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 transition"
            >
              Забронировать подбор
            </Link>
            {!user ? (
              <Link
                to="/login"
                className="px-5 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
              >
                Войти
              </Link>
            ) : null}
          </div>
        </BentoCard>

        <BentoCard className="md:col-span-4 p-6">
          <div className="text-sm text-zinc-500">Контакты</div>
          <div className="mt-2 font-semibold tracking-tight">Связаться быстро</div>
          <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Оставь email — мы ответим и уточним детали запроса.
          </div>

          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Заявка отправлена (демо).");
            }}
          >
            <input
              className="flex-1 rounded-2xl bg-white/70 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 px-4 py-3 outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
              placeholder="Email"
            />
            <button className="rounded-2xl px-4 py-3 bg-zinc-900 text-white hover:bg-zinc-800 transition">
              Отправить
            </button>
          </form>
        </BentoCard>
      </section>

      {/* POPULAR BRANDS */}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-2xl font-semibold tracking-tight">Популярные бренды</div>
            <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Выбирай бренд — открывай предложения и объявления.
            </div>
          </div>

          <Link
            to={user ? "/app" : "/login"}
            className="text-sm font-medium hover:opacity-80"
          >
            Смотреть все <IconArrowRight className="inline-block -mb-[2px]" />
          </Link>
        </div>

        {brandsStatus === "loading" ? (
          <div className="mt-6 text-zinc-500 dark:text-zinc-400">Загрузка…</div>
        ) : null}
        {brandsError ? (
          <div className="mt-6 text-red-600 dark:text-red-300">{brandsError}</div>
        ) : null}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.slice(0, 6).map((b) => (
            <BrandCard key={b.id} brand={b} />
          ))}
        </div>
      </section>

      {/* POPULAR / FEATURE CARDS (your sketch "cards") */}
      <section className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-4">
        <BentoCard className="md:col-span-4 p-6">
          <div className="text-sm text-zinc-500">Сделка</div>
          <div className="mt-2 text-lg font-semibold tracking-tight">
            Сопровождение покупки
          </div>
          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Поможем оформить документы и провести сделку спокойно и прозрачно.
          </div>
          <div className="mt-4">
            <Link
              to={user ? "/app/services" : "/login"}
              className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80"
            >
              Подробнее <IconArrowRight />
            </Link>
          </div>
        </BentoCard>

        <BentoCard className="md:col-span-4 p-6">
          <div className="text-sm text-zinc-500">Подбор</div>
          <div className="mt-2 text-lg font-semibold tracking-tight">
            Варианты под ваш бюджет
          </div>
          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Сравним комплектации и состояние, покажем самые выгодные варианты.
          </div>
          <div className="mt-4">
            <Link
              to={user ? "/app" : "/login"}
              className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80"
            >
              Начать <IconArrowRight />
            </Link>
          </div>
        </BentoCard>

        <BentoCard className="md:col-span-4 p-6">
          <div className="text-sm text-zinc-500">Проверка</div>
          <div className="mt-2 text-lg font-semibold tracking-tight">
            Диагностика и история
          </div>
          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Проверим пробег, кузов, сервисную историю и юридическую чистоту.
          </div>
          <div className="mt-4">
            <Link
              to={user ? "/app/services" : "/login"}
              className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80"
            >
              Узнать <IconArrowRight />
            </Link>
          </div>
        </BentoCard>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-2xl font-semibold tracking-tight">Сервисы</div>
            <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Витрина услуг — подбор, проверка, сопровождение.
            </div>
          </div>
          <Link
            to={user ? "/app/services" : "/login"}
            className="text-sm font-medium hover:opacity-80"
          >
            Все сервисы <IconArrowRight className="inline-block -mb-[2px]" />
          </Link>
        </div>

        {servicesStatus === "loading" ? (
          <div className="mt-6 text-zinc-500 dark:text-zinc-400">Загрузка…</div>
        ) : null}
        {servicesError ? (
          <div className="mt-6 text-red-600 dark:text-red-300">{servicesError}</div>
        ) : null}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.slice(0, 2).map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </section>

      {/* REVIEWS (static) */}
      <section className="mt-10">
        <div className="text-2xl font-semibold tracking-tight">Отзывы</div>
        <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Несколько реальных сценариев (демо-тексты).
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: "Алия",
              text: "Подобрали вариант за 2 дня. Всё прозрачно: фото, диагностика, документы — без сюрпризов.",
            },
            {
              name: "Тимур",
              text: "Понравилась скорость и подход. Сразу предложили 3 варианта и объяснили плюсы/минусы.",
            },
            {
              name: "Данияр",
              text: "Сделку сопровождали до конца. Проверили историю, помогли с оформлением — спокойно купил.",
            },
          ].map((r) => (
            <BentoCard key={r.name} className="p-6">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                <div className="h-9 w-9 rounded-full bg-zinc-900/10 dark:bg-white/10 flex items-center justify-center font-semibold">
                  {r.name[0]}
                </div>
                <div className="font-semibold tracking-tight">{r.name}</div>
              </div>
              <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {r.text}
              </div>
              <div className="mt-4 flex gap-1 text-zinc-500">
                <IconStar />
                <IconStar />
                <IconStar />
                <IconStar />
                <IconStar />
              </div>
            </BentoCard>
          ))}
        </div>
      </section>

      {/* CONTACT US */}
      <section className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-4">
        <BentoCard className="md:col-span-8 p-8">
          <div className="text-2xl font-semibold tracking-tight">Связаться с нами</div>
          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Оставь контакты — уточним запрос и предложим варианты.
          </div>

          <form
            className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Сообщение отправлено (демо).");
            }}
          >
            <input
              className="md:col-span-4 rounded-2xl bg-white/70 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 px-4 py-3 outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
              placeholder="Имя"
            />
            <input
              className="md:col-span-4 rounded-2xl bg-white/70 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 px-4 py-3 outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
              placeholder="Телефон или Email"
            />
            <button className="md:col-span-4 rounded-2xl bg-zinc-900 text-white font-medium py-3 hover:bg-zinc-800 transition">
              Отправить заявку
            </button>
          </form>
        </BentoCard>

        <BentoCard className="md:col-span-4 p-6">
          <div className="text-sm text-zinc-500">График</div>
          <div className="mt-2 font-semibold tracking-tight">Каждый день</div>
          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            10:00 — 20:00
          </div>

          <div className="mt-6 text-sm text-zinc-500">Город</div>
          <div className="mt-2 font-semibold tracking-tight">Астана / Алматы</div>

          <div className="mt-6">
            <a
              className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80"
              href={DJ}
              target="_blank"
              rel="noreferrer"
            >
              Открыть сервер <IconArrowRight />
            </a>
          </div>
        </BentoCard>
      </section>

      {/* FOOTER */}
      <footer className="mt-12 mb-6">
        <div className="rounded-[28px] border border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-zinc-900/30 backdrop-blur px-6 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="font-semibold tracking-tight">
              {t("brand") || "LuxDrive"}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Подбор • Проверка • Сопровождение
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <Link className="hover:opacity-80" to={user ? "/app" : "/login"}>
              Каталог
            </Link>
            <Link className="hover:opacity-80" to={user ? "/app/services" : "/login"}>
              Сервисы
            </Link>
            <Link className="hover:opacity-80" to="/register">
              Регистрация
            </Link>
          </div>

          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} Demo. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
