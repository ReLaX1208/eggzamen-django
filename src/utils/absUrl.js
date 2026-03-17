const DJ = import.meta.env.VITE_DJANGO_ORIGIN || "http://127.0.0.1:8000";

// превращаем "http://127.0.0.1:8000/media/..." -> "/media/..." (чтобы работал vite proxy)
// а если null/"" -> ""
export function mediaUrl(url) {
  if (!url) return "";

  // если уже относительный media
  if (url.startsWith("/media/")) return url;

  // если пришёл абсолютный url с Django — режем домен
  if (url.startsWith(DJ + "/media/")) return url.replace(DJ, "");

  // если вдруг пришло что-то другое абсолютное — оставим как есть
  if (url.startsWith("http")) return url;

  // относительный путь без /
  if (url.startsWith("media/")) return "/" + url;

  return url;
}
