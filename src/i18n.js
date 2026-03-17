import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const LANG_KEY = "lang";
const saved = localStorage.getItem(LANG_KEY) || "ru";

const resources = {
  ru: {
    translation: {
      // common
      brand: "HyperCars",
      login: "Войти",
      register: "Регистрация",
      logout: "Выйти",
      home: "Главная",
      services: "Сервисы",
      searchPlaceholder: "Поиск…",
      loading: "Загрузка…",

      // landing (clean)
      heroTitleA: "Премиальные авто",
      heroTitleB: "без лишнего шума",
      heroDesc:
        "Выбирай бренд, смотри объявления и бронируй подбор. Проверка, сопровождение и прозрачная покупка.",
      ctaBook: "Забронировать",
      ctaExplore: "Смотреть бренды",
      ctaLogin: "Войти",

      sectionPopularBrands: "Популярные бренды",
      sectionPopularDesc: "Быстрый вход в каталог по марке.",
      sectionServices: "Сервисы",
      sectionServicesDesc: "Подбор, проверка, сопровождение.",
      sectionReviews: "Отзывы",
      sectionContact: "Связаться",
      contactTitle: "Оставь контакты — мы ответим",
      contactDesc: "Уточним запрос и предложим варианты.",
      contactName: "Имя",
      contactContact: "Телефон или Email",
      contactSend: "Отправить",

      open: "Открыть",
      views: "Просмотры",
      allServices: "Все сервисы",
    },
  },
  en: {
    translation: {
      // common
      brand: "HyperCars",
      login: "Sign in",
      register: "Sign up",
      logout: "Log out",
      home: "Home",
      services: "Services",
      searchPlaceholder: "Search…",
      loading: "Loading…",

      // landing (clean)
      heroTitleA: "Premium cars",
      heroTitleB: "without the noise",
      heroDesc:
        "Pick a brand, browse listings, and book подбор. Inspection and full deal support.",
      ctaBook: "Book now",
      ctaExplore: "Explore brands",
      ctaLogin: "Sign in",

      sectionPopularBrands: "Popular brands",
      sectionPopularDesc: "Fast entry to the catalog by brand.",
      sectionServices: "Services",
      sectionServicesDesc: "Selection, inspection, deal support.",
      sectionReviews: "Reviews",
      sectionContact: "Contact",
      contactTitle: "Leave your details — we’ll reach out",
      contactDesc: "We’ll уточним the request and propose options.",
      contactName: "Name",
      contactContact: "Phone or Email",
      contactSend: "Send",

      open: "Open",
      views: "Views",
      allServices: "All services",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: saved,
  fallbackLng: "ru",
  interpolation: { escapeValue: false },
});

export function setLang(lang) {
  const next = lang === "en" ? "en" : "ru";
  localStorage.setItem(LANG_KEY, next);
  i18n.changeLanguage(next);
}

export function getLang() {
  return i18n.language || saved || "ru";
}

export default i18n;
