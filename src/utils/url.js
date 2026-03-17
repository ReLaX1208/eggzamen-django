const DJ = import.meta.env.VITE_DJANGO_ORIGIN || "http://127.0.0.1:8000";

export function absUrl(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${DJ}${url.startsWith("/") ? "" : "/"}${url}`;
}
