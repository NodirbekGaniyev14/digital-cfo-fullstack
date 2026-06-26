# -*- coding: utf-8 -*-
"""
advice.py — avtomatik XULOSA va TAVSIYALAR (tilga bog'liq EMAS).
Qaytaradi: (kalit, parametrlar) ro'yxati. Matnlar i18n.py (CONCL, RECS) da.
"""

from __future__ import annotations
from indicators import Indicator


def build_conclusions(inds: list[Indicator], summary: dict, has_pl: bool) -> list[tuple]:
    """Vaziyatga qarab xulosa kalitlari. 'overall' report tomonidan
    alohida qo'shiladi (summary asosida)."""
    by = {i.code: i for i in inds}
    c: list[tuple] = []

    a1 = by.get("A1")
    if a1 and a1.value is not None:
        c.append(({"good": "liq_good", "warn": "liq_warn", "bad": "liq_bad"}
                  .get(a1.status, "liq_warn"), {}))

    b1 = by.get("B1")
    if b1 and b1.value is not None:
        c.append(("auto_good" if b1.status == "good" else "auto_bad",
                  {"x": f"{b1.value:.2f}"}))

    if has_pl:
        c3 = by.get("C3"); c1 = by.get("C1")
        if c3 and c3.value is not None:
            if c3.value < 0:
                c.append(("prof_loss", {}))
            elif c3.status == "good":
                c.append(("prof_good", {"m": f"{c3.value:.1f}",
                                        "r": f"{c1.value:.1f}" if c1 and c1.value is not None else "-"}))
            else:
                c.append(("prof_low", {"m": f"{c3.value:.1f}"}))

        d6 = by.get("D6")
        if d6 and d6.value is not None and d6.status != "good":
            c.append(("dso_slow", {"x": f"{d6.value:.0f}"}))

        e1 = by.get("E1")
        if e1 and e1.value is not None:
            c.append(("sales_up" if e1.value > 0 else "sales_down",
                      {"x": f"{e1.value:.1f}"}))

    return c


def build_recommendations(inds: list[Indicator], has_pl: bool) -> list[str]:
    by = {i.code: i for i in inds}

    def bw(code):
        i = by.get(code)
        return i is not None and i.status in ("warn", "bad")

    r: list[str] = []
    if bw("A1") or bw("A3"):
        r.append("liquidity")
    if bw("B1") or bw("B3"):
        r.append("capital")
    if has_pl and (bw("C1") or bw("C3")):
        r.append("profitability")
    if has_pl and (bw("D4") or bw("D3")):
        r.append("inventory")
    if has_pl and (bw("D6") or bw("E7")):
        r.append("receivables")
    if has_pl and bw("E4"):
        r.append("costs")
    if not r:
        r.append("all_ok")
    r.append("disclaimer")
    return r

# ---------------------------------------------------------------------------
# Pul oqimi: yo'nalishlar bo'yicha xulosa va takliflar (tilga bog'liq EMAS)
# ---------------------------------------------------------------------------
def _m(v) -> str:
    """Summani formatlash: 1 234 567"""
    return f"{abs(v):,.0f}".replace(",", " ")


def build_cf_conclusions(cf: dict, fd) -> dict:
    """Qaytaradi: {'ocf': (key, params), 'tied': [(key, params), ...],
                   'icf': (key, params), 'fcf': (key, params)}"""
    out = {"ocf": None, "tied": [], "icf": None, "fcf": None}
    if not cf:
        return out

    ocf, icf, fcf = cf["ocf"], cf["icf"], cf["fcf"]
    np_ = fd.net_profit
    scale = max(abs(fd.total_assets), 1.0)
    eps = scale * 0.002  # 0.2% dan kichik oqim "neytral"

    # --- Operatsion ---
    if ocf < 0:
        out["ocf"] = ("ocf_neg", {"x": _m(ocf)})
    elif np_ > 0 and ocf < 0.5 * np_:
        out["ocf"] = ("ocf_paper", {"p": _m(np_), "x": _m(ocf)})
    else:
        out["ocf"] = ("ocf_good", {"x": _m(ocf)})

    # --- Pul qayerda band (manfiy tuzatishlar = chiqim) ---
    tied_map = [
        ("tied_receivables", cf["d_receivables"]),
        ("tied_inventories", cf["d_inventories"]),
        ("tied_other_ca",    cf["d_other_ca"]),
        ("tied_creditors",   cf["d_current_liab"]),
    ]
    tied = [(k, v) for k, v in tied_map if v < -eps]
    tied.sort(key=lambda t: t[1])           # eng katta chiqim birinchi
    out["tied"] = [(k, {"x": _m(v)}) for k, v in tied[:3]]

    # --- Investitsion ---
    if icf < -eps:
        if cf["d_sti"] < cf["d_nca"]:
            out["icf"] = ("icf_fininv", {"x": _m(cf["d_sti"])})
        else:
            out["icf"] = ("icf_capex", {"x": _m(cf["d_nca"])})
    elif icf > eps:
        out["icf"] = ("icf_divest", {"x": _m(icf)})
    else:
        out["icf"] = ("icf_flat", {})

    # --- Moliyaviy ---
    if fcf > eps:
        out["fcf"] = ("fcf_inflow", {"x": _m(fcf)})
    elif fcf < -eps:
        out["fcf"] = ("fcf_outflow", {"x": _m(fcf)})
    else:
        out["fcf"] = ("fcf_flat", {})

    return out


def build_cf_solutions(cf: dict, fd) -> list:
    """Pul oqimini yaxshilash takliflari: [(key, params), ...] (maks. 4 ta)."""
    if not cf:
        return []
    sols = []
    scale = max(abs(fd.total_assets), 1.0)
    eps = scale * 0.002

    if cf["ocf"] < -eps and cf["fcf"] > eps:
        sols.append(("sol_debt_risk", {}))
    if cf["d_receivables"] < -eps:
        sols.append(("sol_receivables", {"x": _m(cf["d_receivables"])}))
    if cf["d_inventories"] < -eps:
        sols.append(("sol_inventories", {}))
    if cf["d_current_liab"] < -eps:
        sols.append(("sol_creditors", {}))
    if cf["d_sti"] < -eps:
        sols.append(("sol_sti", {"x": _m(cf["d_sti"])}))
    if cf["ocf"] < -eps and cf["d_nca"] < -eps:
        sols.append(("sol_capex", {}))

    if not sols:
        sols.append(("sol_ok", {}))
    return sols[:4]
