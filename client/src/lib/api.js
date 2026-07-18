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
export const adminStats = () =>
  request("/api/admin/stats", { admin: true });
export const adminAnalytics = (days = 30) =>
  request(`/api/admin/analytics?days=${days}`, { admin: true });
export const adminCategories = () =>
  request("/api/admin/categories", { admin: true }).then((d) => d.categories || []);
export const adminCreateCategory = (name) =>
  request("/api/admin/categories", { method: "POST", body: { name }, admin: true });
export const adminRenameCategory = (id, name) =>
  request(`/api/admin/categories/${id}`, { method: "PUT", body: { name }, admin: true });
export const adminDeleteCategory = (id) =>
  request(`/api/admin/categories/${id}`, { method: "DELETE", admin: true });
export const adminRevisions = (id) =>
  request(`/api/admin/articles/${id}/revisions`, { admin: true }).then((d) => d.revisions || []);
export const adminRevision = (revId) =>
  request(`/api/admin/revisions/${revId}`, { admin: true }).then((d) => d.revision);

// AI kontent generatori (DCOS) — status va generatsiya.
export const aiStatus = () =>
  request("/api/admin/ai/status", { admin: true }).then((d) => Boolean(d?.enabled));
export const aiGenerate = (payload) =>
  request("/api/admin/ai/generate", { method: "POST", body: payload, admin: true }).then((d) => d.article);

// Avtopilot (DCOS Faza 2) — status, sozlamalar, mavzu navbati, qo'lda ishga tushirish.
export const autopilotGet = () =>
  request("/api/admin/autopilot", { admin: true });
export const autopilotSettings = (payload) =>
  request("/api/admin/autopilot/settings", { method: "POST", body: payload, admin: true });
export const autopilotTopics = () =>
  request("/api/admin/autopilot/topics", { admin: true }).then((d) => d.topics || []);
export const autopilotAddTopic = (payload) =>
  request("/api/admin/autopilot/topics", { method: "POST", body: payload, admin: true });
export const autopilotRemoveTopic = (id) =>
  request(`/api/admin/autopilot/topics/${id}`, { method: "DELETE", admin: true });
export const autopilotRetryTopic = (id) =>
  request(`/api/admin/autopilot/topics/${id}/retry`, { method: "POST", admin: true });
export const autopilotTopicDraft = (id) =>
  request(`/api/admin/autopilot/topics/${id}/draft`, { method: "POST", admin: true });
export const autopilotSeedStarter = () =>
  request("/api/admin/autopilot/seed-starter", { method: "POST", admin: true });
export const autopilotRunNow = () =>
  request("/api/admin/autopilot/run", { method: "POST", admin: true });

// Social paket (DCOS Part 7) — maqola bo'yicha olish/generatsiya.
export const socialGet = (id) =>
  request(`/api/admin/articles/${id}/social`, { admin: true }).then((d) => d.social || null);
export const socialGenerate = (id) =>
  request(`/api/admin/articles/${id}/social/generate`, { method: "POST", admin: true }).then((d) => d.social);

// Sifat bahosi (DCOS Part 9) — maqolani baholaydi.
export const qualityScore = (id) =>
  request(`/api/admin/articles/${id}/quality`, { method: "POST", admin: true });

// Social tarqatish (DCOS Faza 3b) — platformalar holati, joylash, jurnal.
export const socialPublisherStatus = () =>
  request("/api/admin/social/status", { admin: true });
export const socialPosts = (id) =>
  request(`/api/admin/articles/${id}/social/posts`, { admin: true }).then((d) => d.posts || []);
export const socialPublish = (id, platforms) =>
  request(`/api/admin/articles/${id}/social/publish`, { method: "POST", body: platforms ? { platforms } : {}, admin: true });

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
