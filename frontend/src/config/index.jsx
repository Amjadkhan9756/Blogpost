import axios from "axios";

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/";

const base = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;

/** Production-safe image URL: only returns URL when we have a real filename from DB. */
export function getImageUrl(filename) {
  if (!filename || typeof filename !== "string") return null;
  const trimmed = filename.trim();
  if (!trimmed || trimmed === "default.jpg") return null;
  return `${base}/uploads/${trimmed}`;
}

export const clientServer = axios.create({
  baseURL: BASE_URL,
});
