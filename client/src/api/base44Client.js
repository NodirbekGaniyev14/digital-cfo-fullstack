// Minimal Base44-style API client.
// This is a PUBLIC marketing site, so no auth is required.
export const base44Client = {
  requiresAuth: false,
  baseURL: import.meta.env.VITE_API_URL || "/api",
};

/**
 * Submit the contact / lead form (optionally with an attached file)
 * to the Express backend. Falls back gracefully if the API is offline.
 */
export async function submitContact(formData) {
  const res = await fetch(`${base44Client.baseURL}/contact`, {
    method: "POST",
    body: formData, // FormData -> multipart/form-data (supports file upload)
  });
  if (!res.ok) throw new Error("So'rovni yuborib bo'lmadi");
  return res.json();
}

/**
 * Moliyaviy fayllarni (Balans + Moliyaviy) backendga yuborib, bot bilan
 * bir xil tahlil natijasini (ko'rsatkichlar + PDF) oladi. Fayllar saqlanmaydi.
 */
export async function analyzeFile(files) {
  const fd = new FormData();
  (Array.isArray(files) ? files : [files])
    .filter(Boolean)
    .forEach((f) => fd.append("files", f));
  const res = await fetch(`${base44Client.baseURL}/analyze`, {
    method: "POST",
    body: fd,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Tahlil amalga oshmadi");
  return data;
}
