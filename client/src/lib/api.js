// Maqolalar API klienti — public va admin so'rovlar.
// Token localStorage'da saqlanadi; admin so'rovlarga Bearer sifatida qo'shiladi.

const TOKEN_KEY = "cfo_admin_token";

export const auth = {
  get: () => {
    try { return localStorage.getItem(TOKEN_KEY) || ""; } catch { return ""; }
  },
  set: (t) => {
    try { localStorage.setItem(TOKEN_KEY, t); } catch { /* ignore */ }
  },
  clear: () => {
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
  },
  isAuthed: () => Boolean(auth.get()),
};

async function request(url, { method = "GET", body, admin = false } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (admin) headers["Authorization"] = `Bearer ${auth.get()}`;
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch { /* bo'sh javob */ }
  if (!res.ok) {
    if (res.status === 401 && admin) auth.clear();
    throw new Error(data?.error || `Xatolik (${res.status})`);
  }
  return data;
}

// --- Public ---
export const getArticles = () => request("/api/articles").then((d) => d.articles || []);
export const getArticle = (slug) => request(`/api/articles/${slug}`).then((d) => d.article);
export const subscribe = (email, source) =>
  request("/api/subscribe", { method: "POST", body: { email, source } });

// --- Admin ---
export const login = (username, password) =>
  request("/api/admin/login", { method: "POST", body: { username, password } });

export const adminMeta = () =>
  request("/api/admin/meta", { admin: true });
export const adminGetArticles = () =>
  request("/api/admin/articles", { admin: true }).then((d) => d.articles || []);
export const adminGetArticle = (id) =>
  request(`/api/admin/articles/${id}`, { admin: true }).then((d) => d.article);
export const adminCreate = (data) =>
  request("/api/admin/articles", { method: "POST", body: data, admin: true }).then((d) => d.article);
export const adminUpdate = (id, data) =>
  request(`/api/admin/articles/${id}`, { method: "PUT", body: data, admin: true }).then((d) => d.article);
export const adminDelete = (id) =>
  request(`/api/admin/articles/${id}`, { method: "DELETE", admin: true });

export const adminMedia = () =>
  request("/api/admin/media", { admin: true }).then((d) => d.media || []);
export const adminDeleteMedia = (name) =>
  request(`/api/admin/media/${encodeURIComponent(name)}`, { method: "DELETE", admin: true });
export const adminSubscribers = () =>
  request("/api/admin/subscribers", { admin: true });

// Rasm yuklash (FormData) — muqova uchun.
export async function uploadImage(file) {
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${auth.get()}` },
    body: fd,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "Rasm yuklanmadi");
  return data.url;
}
