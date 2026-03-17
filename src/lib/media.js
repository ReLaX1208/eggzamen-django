// src/lib/media.js
const DJ = import.meta.env.VITE_DJANGO_ORIGIN || "http://127.0.0.1:8000";

/**
 * photo может быть:
 * - null
 * - абсолютный URL (http://127.0.0.1:8000/media/...)
 * - относительный (/media/....)
 */
export function mediaUrl(photo) {
  if (!photo) return "";
  if (photo.startsWith("http://") || photo.startsWith("https://")) return photo;
  if (photo.startsWith("/")) return `${DJ}${photo}`;
  return `${DJ}/${photo}`;
}
