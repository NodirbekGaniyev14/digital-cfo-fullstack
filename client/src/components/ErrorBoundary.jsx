import { Component } from "react";

/**
 * ErrorBoundary — biror komponent render paytida xato bersa, butun sayt
 * "oq ekran" bo'lib qolmasin: do'stona xabar + qayta yuklash tugmasi.
 * Eng tashqi qatlamda turadi (i18n provideridan ham tashqarida bo'lishi
 * mumkin), shuning uchun matnlar statik — 3 tilda birga.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Konsolga to'liq xato — diagnostika uchun
    console.error("Sayt xatosi (ErrorBoundary):", error, info?.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div
        style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 14,
          fontFamily: "system-ui, sans-serif", background: "#0F172A",
          color: "#fff", padding: 24, textAlign: "center",
        }}
      >
        <div style={{ fontSize: 44 }}>⚠️</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
          Kutilmagan xatolik yuz berdi
        </h1>
        <p style={{ color: "#94A3B8", fontSize: 14, margin: 0, maxWidth: 420 }}>
          Sahifani qayta yuklang. / Перезагрузите страницу. / Please reload the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: 8, padding: "12px 28px", borderRadius: 12, border: "none",
            background: "#3B82F6", color: "#fff", fontSize: 15, fontWeight: 600,
            cursor: "pointer",
          }}
        >
          🔄 Qayta yuklash / Reload
        </button>
      </div>
    );
  }
}
