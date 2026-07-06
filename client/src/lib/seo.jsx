import { useEffect } from "react";
import { SITE_URL } from "@/data/articles";

// Client-side head boshqaruvi. Prerender static HTML'ni beradi (crawler uchun),
// bu komponent esa SPA navigatsiyasida <head>'ni yangilab turadi (title, meta,
// canonical, Open Graph, Twitter va JSON-LD). Server render bilan bir xil natija.

const DEFAULTS = {
  title: "Digital CFO — AI moliyaviy tahlil va hisobot",
  description:
    "Balans va moliyaviy hisobotingizni yuboring — biz ularni tahlil qilib, KPI'lar va amaliy tavsiyalar bilan tayyor CFO darajasidagi hisobotni qaytaramiz.",
  image: `${SITE_URL}/og-image.svg`,
  type: "website",
};

function upsertMeta(selector, attr, value, content) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

// JSON-LD'ni id bo'yicha yangilaymiz (dublikat bo'lmasligi uchun).
function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!data) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * <Seo> — sahifa meta ma'lumotlarini o'rnatadi.
 * props: title, description, canonical (yo'l yoki to'liq URL), image, type,
 *        jsonLd (obyekt yoki massiv).
 */
export default function Seo({ title, description, canonical, image, type, jsonLd }) {
  useEffect(() => {
    const fullTitle = title
      ? title.includes("Digital CFO")
        ? title
        : `${title} — Digital CFO`
      : DEFAULTS.title;
    const desc = description || DEFAULTS.description;
    const img = image || DEFAULTS.image;
    const url = canonical
      ? canonical.startsWith("http")
        ? canonical
        : `${SITE_URL}${canonical}`
      : `${SITE_URL}/`;

    document.title = fullTitle;
    upsertMeta('meta[name="description"]', "name", "description", desc);
    upsertLink("canonical", url);

    upsertMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    upsertMeta('meta[property="og:description"]', "property", "og:description", desc);
    upsertMeta('meta[property="og:url"]', "property", "og:url", url);
    upsertMeta('meta[property="og:image"]', "property", "og:image", img);
    upsertMeta('meta[property="og:type"]', "property", "og:type", type || DEFAULTS.type);

    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", desc);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", img);

    upsertJsonLd("ld-page", jsonLd || null);
  }, [title, description, canonical, image, type, jsonLd]);

  return null;
}
