// Structured data (schema.org JSON-LD) qurilishi — SOF JS.
// Ham React <Seo>, ham build prerender skripti (Node) shu funksiyalarni ishlatadi,
// natijada crawler ko'radigan HTML va SPA bir xil struktura beradi.

// Nisbiy yo'l (alias emas) — bu modulni build-time Node skripti ham import qiladi.
import { SITE_URL, formatDateUz } from "../data/articles.js";

const ORG = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#org`,
  name: "Digital CFO",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/og-image.svg`,
};

// Bitta maqola uchun: BlogPosting + BreadcrumbList (API shakli: created_at/excerpt).
export function articleJsonLd(a) {
  const url = `${SITE_URL}/blog/${a.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: a.title,
        description: a.excerpt,
        inLanguage: "uz",
        datePublished: a.created_at,
        dateModified: a.updated_at || a.created_at,
        author: { "@type": "Organization", name: a.author || "Digital CFO" },
        publisher: ORG,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        articleSection: a.category,
        image: a.cover_image || `${SITE_URL}/og-image.svg`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Bosh sahifa", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Maqolalar", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: a.title, item: url },
        ],
      },
    ],
  };
}

// Maqolalar ro'yxati sahifasi uchun: CollectionPage + ItemList.
export function articlesListJsonLd(articles) {
  const url = `${SITE_URL}/blog`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#page`,
        name: "Maqolalar — Digital CFO",
        description:
          "Moliyaviy tahlil, likvidlik, rentabellik, Altman Z-Score va 1C hisobotlari bo'yicha amaliy maqolalar.",
        inLanguage: "uz",
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "ItemList",
        itemListElement: articles.map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/blog/${a.slug}`,
          name: a.title,
        })),
      },
    ],
  };
}

export { formatDateUz };
