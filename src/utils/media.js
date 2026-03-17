// src/utils/media.js

// Делаем так, чтобы картинки всегда грузились через Vite proxy (/media)
// даже если бэк отдает абсолютный URL http://127.0.0.1:8000/media/...

export function normalizeMediaUrl(url) {
  if (!url) return "";

  // если уже относительный /media/...
  if (url.startsWith("/media/")) return url;

  // если абсолютный URL -> вырезаем домен, оставляем только /media/...
  // поддержим и localhost, и 127.0.0.1, и любой домен
  try {
    const u = new URL(url);
    if (u.pathname.startsWith("/media/")) {
      return u.pathname + (u.search || "");
    }
  } catch {
    // если это не валидный URL — пропускаем
  }

  return url; // fallback
}
