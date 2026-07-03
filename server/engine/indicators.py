# -*- coding: utf-8 -*-
"""
indicators.py — moliyaviy ko'rsatkichlar yadrosi (tilga bog'liq EMAS).

FinancialData -> ~50 ta koeffitsient. Har biri: kod + qiymat + birlik + status
+ izoh kaliti (comment key). Nom/norma/izoh matnlari i18n.py da (uz/ru/en).
"""

from __future__ import annotations
from dataclasses import dataclass
from typing import Optional

DAYS = 365


# ---------------------------------------------------------------------------
@dataclass
class FinancialData:
    company: str = "Korxona"
    period: str = ""
    stir: str = ""
    period_year: Optional[int] = None
    period_quarter: Optional[int] = None

    non_current_assets: float = 0.0
    current_assets: float = 0.0
    total_assets: float = 0.0
    inventories: float = 0.0
    receivables: float = 0.0
    cash: float = 0.0
    short_term_investments: float = 0.0
    equity: float = 0.0
    long_term_liabilities: float = 0.0
    current_liabilities: float = 0.0
    payables: float = 0.0

    total_assets_begin: Optional[float] = None
    current_assets_begin: Optional[float] = None
    inventories_begin: Optional[float] = None
    receivables_begin: Optional[float] = None
    payables_begin: Optional[float] = None
    equity_begin: Optional[float] = None
    cash_begin: Optional[float] = None
    non_current_assets_begin: Optional[float] = None
    long_term_liabilities_begin: Optional[float] = None
    short_term_investments_begin: Optional[float] = None
    current_liabilities_begin: Optional[float] = None

    revenue: float = 0.0
    cogs: float = 0.0
    gross_profit: float = 0.0
    period_expenses: float = 0.0
    operating_profit: float = 0.0
    profit_before_tax: float = 0.0
    income_tax: float = 0.0
    net_profit: float = 0.0

    revenue_prev: Optional[float] = None
    cogs_prev: Optional[float] = None
    gross_profit_prev: Optional[float] = None
    net_profit_prev: Optional[float] = None

    def normalize(self) -> "FinancialData":
        if not self.payables:
            self.payables = self.current_liabilities
        if self.gross_profit == 0 and self.revenue and self.cogs:
            self.gross_profit = self.revenue - self.cogs
        return self

    @property
    def total_liabilities(self) -> float:
        return self.long_term_liabilities + self.current_liabilities

    @property
    def has_pl(self) -> bool:
        """Shakl 2 ma'lumotlari bormi?"""
        return bool(self.revenue) or bool(self.net_profit)


# ---------------------------------------------------------------------------
@dataclass
class Indicator:
    code: str
    value: Optional[float]
    unit: str            # "x" | "%" | "kun"
    status: str          # "good" | "warn" | "bad" | "na"
    ck: str = ""         # izoh kaliti (i18n.CK)

    @property
    def group(self) -> str:
        return self.code[0]


def _safe_div(a, b):
    if a is None or b is None or b == 0:
        return None
    return a / b


def _avg(end, begin):
    if end is None:
        return None
    return end if begin is None else (end + begin) / 2.0


def _band(value, good, warn) -> str:
    if value is None:
        return "na"
    if good[0] <= value <= good[1]:
        return "good"
    if warn[0] <= value <= warn[1]:
        return "warn"
    return "bad"


def _growth(now, prev):
    if now is None or prev in (None, 0):
        return None
    return (now - prev) / abs(prev) * 100.0


# ---------------------------------------------------------------------------
def compute_indicators(fd: FinancialData) -> list[Indicator]:
    fd.normalize()
    out: list[Indicator] = []

    def add(code, value, unit, status, ck=""):
        out.append(Indicator(code, value, unit, status, ck))

    CL = fd.current_liabilities
    CA = fd.current_assets
    TA = fd.total_assets
    TL = fd.total_liabilities
    EQ = fd.equity
    rev = fd.revenue
    own_wc = EQ - fd.non_current_assets

    avg_ta = _avg(TA, fd.total_assets_begin)
    avg_ca = _avg(CA, fd.current_assets_begin)
    avg_inv = _avg(fd.inventories, fd.inventories_begin)
    avg_rec = _avg(fd.receivables, fd.receivables_begin)
    avg_pay = _avg(fd.payables, fd.payables_begin)
    avg_eq = _avg(EQ, fd.equity_begin)

    # ===== A. LIKVIDLIK =====
    # MUHIM: yuqori likvidlik to'lov xavfi EMAS — bu SOG'LOM holat, "Yaxshi".
    # Normadan OSHSA — baho "good" va alohida izoh (ck) ortiqcha mablag'ni
    # samarali ishlatish bo'yicha maslahat beradi. "bad" faqat PAST tomonda
    # (haqiqiy to'lov xavfi).
    v = _safe_div(CA, CL)
    if v is not None and v > 2.5:
        add("A1", v, "x", "good", ck="a1_high")
    else:
        add("A1", v, "x", _band(v, (1.0, 2.5), (0.8, 1.0)))
    v = _safe_div((CA - fd.inventories), CL)
    if v is not None and v > 1.5:
        add("A2", v, "x", "good", ck="a2_high")
    else:
        add("A2", v, "x", _band(v, (0.7, 1.5), (0.5, 0.7)))
    # A3 ham: naqd qarzdan ko'p (>1.0) — "tanqis" emas, sog'lom zaxira ("good").
    v = _safe_div((fd.cash + fd.short_term_investments), CL)
    if v is not None and v > 1.0:
        add("A3", v, "x", "good", ck="a3_high")
    else:
        add("A3", v, "x", _band(v, (0.2, 1.0), (0.1, 0.2)))
    wc = CA - CL
    add("A4", wc, "x", "good" if wc > 0 else "bad")
    v = _safe_div(TA, TL)
    add("A5", v, "x", _band(v, (2.0, 1e9), (1.0, 2.0)))
    v = _safe_div(fd.receivables, fd.payables)
    add("A6", v, "x", _band(v, (0.9, 1.2), (0.5, 2.0)))
    v = _safe_div(own_wc, fd.inventories)
    add("A7", v, "x", _band(v, (0.5, 1e9), (0.1, 0.5)))
    v = _safe_div((fd.cash + fd.short_term_investments), CA)
    add("A8", (v * 100 if v is not None else None), "%", _band(v, (0.10, 1.0), (0.05, 0.10)))
    v = _safe_div(CA, TA)
    add("A9", (v * 100 if v is not None else None), "%", "good" if v else "na")
    v = _safe_div(own_wc, CA)
    add("A10", v, "x", _band(v, (0.1, 1e9), (0.0, 0.1)))

    # ===== B. BARQARORLIK =====
    v = _safe_div(EQ, TA)
    add("B1", v, "x", _band(v, (0.5, 1.0), (0.3, 0.5)))
    v = _safe_div(TL, TA)
    add("B2", v, "x", _band(v, (0.0, 0.5), (0.5, 0.7)))
    v = _safe_div(TL, EQ)
    add("B3", v, "x", _band(v, (0.0, 1.0), (1.0, 1.5)))
    # B4 ham ikki tomonlama: yuqori manyovrlik "immobilizatsiya" emas —
    # aksincha kapital aylanmada, bu ijobiy. Oshsa "good" + to'g'ri izoh.
    v = _safe_div(own_wc, EQ)
    if v is not None and v > 0.6:
        add("B4", v, "x", "good", ck="b4_high")
    else:
        add("B4", v, "x", _band(v, (0.2, 0.6), (0.0, 0.2)))
    v = _safe_div(fd.long_term_liabilities, (EQ + fd.long_term_liabilities))
    add("B5", v, "x", _band(v, (0.0, 0.4), (0.4, 0.6)))
    v = _safe_div(fd.non_current_assets, EQ)
    add("B6", v, "x", _band(v, (0.0, 1.0), (1.0, 1.3)))
    v = _safe_div(EQ, TL)
    add("B7", v, "x", _band(v, (1.0, 1e9), (0.7, 1.0)))
    v = _safe_div((EQ + fd.long_term_liabilities), fd.non_current_assets)
    add("B8", v, "x", _band(v, (1.0, 1e9), (0.8, 1.0)))
    v = _safe_div(fd.long_term_liabilities, EQ)
    add("B9", v, "x", _band(v, (0.0, 0.5), (0.5, 1.0)))
    v = _safe_div((EQ + fd.long_term_liabilities), TA)
    # B10: yuqori barqarorlik "bad" emas — yuqori chegara yo'q.
    add("B10", v, "x", _band(v, (0.6, 1e9), (0.5, 0.6)))

    # ===== C. RENTABELLIK =====
    v = _safe_div(fd.net_profit, avg_ta)
    add("C1", (v * 100 if v is not None else None), "%", _band(v, (0.05, 1e9), (0.0, 0.05)))
    v = _safe_div(fd.net_profit, avg_eq)
    add("C2", (v * 100 if v is not None else None), "%", _band(v, (0.10, 1e9), (0.0, 0.10)))
    v = _safe_div(fd.net_profit, rev)
    add("C3", (v * 100 if v is not None else None), "%", _band(v, (0.05, 1e9), (0.0, 0.05)))
    v = _safe_div(fd.gross_profit, rev)
    add("C4", (v * 100 if v is not None else None), "%", _band(v, (0.20, 1e9), (0.05, 0.20)))
    v = _safe_div(fd.operating_profit, rev)
    add("C5", (v * 100 if v is not None else None), "%", _band(v, (0.05, 1e9), (0.0, 0.05)))
    v = _safe_div(fd.net_profit, fd.cogs)
    add("C6", (v * 100 if v is not None else None), "%", _band(v, (0.05, 1e9), (0.0, 0.05)))
    v = _safe_div(fd.profit_before_tax, rev)
    add("C7", (v * 100 if v is not None else None), "%", _band(v, (0.05, 1e9), (0.0, 0.05)))
    tax_rate = _safe_div(fd.income_tax, fd.profit_before_tax) or 0
    roic_base = fd.operating_profit * (1 - tax_rate)
    v = _safe_div(roic_base, (EQ + fd.long_term_liabilities))
    add("C8", (v * 100 if v is not None else None), "%", _band(v, (0.08, 1e9), (0.0, 0.08)))
    v = _safe_div(fd.net_profit, (fd.cogs + fd.period_expenses))
    add("C9", (v * 100 if v is not None else None), "%", _band(v, (0.05, 1e9), (0.0, 0.05)))
    v = _safe_div(fd.operating_profit, avg_ta)
    add("C10", (v * 100 if v is not None else None), "%", _band(v, (0.05, 1e9), (0.0, 0.05)))

    # ===== D. AYLANUVCHANLIK =====
    at = _safe_div(rev, avg_ta)
    add("D1", at, "x", "good" if at and at >= 1 else ("warn" if at else "na"))
    v = _safe_div(rev, avg_ca)
    add("D2", v, "x", "good" if v and v >= 2 else ("warn" if v else "na"))
    inv_t = _safe_div(fd.cogs, avg_inv)
    add("D3", inv_t, "x", "good" if inv_t and inv_t >= 4 else ("warn" if inv_t else "na"))
    v = _safe_div(DAYS, inv_t)
    add("D4", v, "kun", "good" if inv_t and (DAYS / inv_t) <= 90 else ("warn" if inv_t else "na"))
    rec_t = _safe_div(rev, avg_rec)
    add("D5", rec_t, "x", "good" if rec_t and rec_t >= 6 else ("warn" if rec_t else "na"))
    dso = _safe_div(DAYS, rec_t)
    add("D6", dso, "kun", _band(dso, (0, 60), (60, 90)))
    pay_t = _safe_div(fd.cogs, avg_pay)
    add("D7", pay_t, "x", "good" if pay_t else "na")
    dpo = _safe_div(DAYS, pay_t)
    add("D8", dpo, "kun", "good" if dpo else "na")
    op_cycle = (dso + DAYS / inv_t) if (dso is not None and inv_t) else None
    add("D9", op_cycle, "kun", "good" if op_cycle and op_cycle <= 120 else ("warn" if op_cycle else "na"))
    ccc = (op_cycle - dpo) if (op_cycle is not None and dpo is not None) else None
    add("D10", ccc, "kun",
        "good" if ccc is not None and ccc <= 90 else ("warn" if ccc is not None else "na"),
        "neg_ccc" if (ccc is not None and ccc < 0) else "")

    # ===== E. O'SISH =====
    rev_g = _growth(rev, fd.revenue_prev)
    v = rev_g
    add("E1", v, "%", _band(v, (0, 1e9), (-5, 0)) if v is not None else "na")
    v = _growth(fd.net_profit, fd.net_profit_prev)
    add("E2", v, "%", _band(v, (0, 1e9), (-10, 0)) if v is not None else "na")
    v = _growth(fd.gross_profit, fd.gross_profit_prev)
    add("E3", v, "%", _band(v, (0, 1e9), (-10, 0)) if v is not None else "na")
    v = _growth(fd.cogs, fd.cogs_prev)
    cogs_status = "na"
    if v is not None and rev_g is not None:
        cogs_status = "good" if v <= rev_g else "warn"
    add("E4", v, "%", cogs_status)
    v = _growth(TA, fd.total_assets_begin)
    add("E5", v, "%", _band(v, (0, 1e9), (-5, 0)) if v is not None else "na")
    v = _growth(EQ, fd.equity_begin)
    add("E6", v, "%", _band(v, (0, 1e9), (-5, 0)) if v is not None else "na")
    v = _growth(fd.receivables, fd.receivables_begin)
    add("E7", v, "%",
        "warn" if (v is not None and rev_g is not None and v > rev_g + 10)
        else ("good" if v is not None else "na"))
    margin_now = _safe_div(fd.net_profit, rev)
    margin_prev = _safe_div(fd.net_profit_prev, fd.revenue_prev)
    md = (margin_now - margin_prev) * 100 if (margin_now is not None and margin_prev is not None) else None
    add("E8", md, "%", "good" if md is not None and md >= 0 else ("warn" if md is not None else "na"))

    return out


# ---------------------------------------------------------------------------
def compute_cashflow(fd: FinancialData) -> Optional[dict]:
    """Bilvosita (indirect) usulda pul oqimi tahlili.

    Balansning davr boshi/oxiri va sof foydadan:
      Operatsion CF = Sof foyda − ΔDebitorlik − ΔZaxiralar − ΔBoshqa joriy aktivlar
                      + ΔJoriy majburiyatlar
      Investitsion CF = −ΔUzoq muddatli aktivlar − ΔQisqa muddatli investitsiyalar
      Moliyaviy CF   = ΔUzoq muddatli majburiyatlar + (ΔKapital − Sof foyda)
      Jami           = ΔPul mablag'lari  (balans ayniyati bo'yicha aynan tenglashadi)

    Eslatma: amortizatsiya ma'lumoti (Shakl 4/AV registri) bo'lmagani uchun
    investitsion CF — sof o'zgarish (capex − amortizatsiya) sifatida baholanadi.
    Davr boshi qiymatlari bo'lmasa None qaytadi (CF hisoblab bo'lmaydi).
    """
    need = (fd.total_assets_begin, fd.current_assets_begin, fd.equity_begin)
    if any(v is None for v in need):
        return None

    def b(v, fallback=0.0):
        return fallback if v is None else v

    # Davr boshi qiymatlari (yo'q bo'lsa 0 — odatda jami qiymatlar bor)
    inv0 = b(fd.inventories_begin)
    rec0 = b(fd.receivables_begin)
    cash0 = b(fd.cash_begin)
    sti0 = b(fd.short_term_investments_begin)
    ca0 = b(fd.current_assets_begin)
    nca0 = b(fd.non_current_assets_begin,
             b(fd.total_assets_begin) - ca0)  # bo'lmasa ayniyatdan
    eq0 = b(fd.equity_begin)
    ltl0 = b(fd.long_term_liabilities_begin)
    cl0 = b(fd.current_liabilities_begin,
            b(fd.total_assets_begin) - eq0 - ltl0)  # ayniyatdan

    # O'zgarishlar (Δ = oxiri − boshi)
    d_rec = fd.receivables - rec0
    d_inv = fd.inventories - inv0
    other_ca1 = fd.current_assets - fd.inventories - fd.receivables - fd.cash - fd.short_term_investments
    other_ca0 = ca0 - inv0 - rec0 - cash0 - sti0
    d_other_ca = other_ca1 - other_ca0
    d_cl = fd.current_liabilities - cl0
    d_nca = fd.non_current_assets - nca0
    d_sti = fd.short_term_investments - sti0
    d_ltl = fd.long_term_liabilities - ltl0
    d_eq_other = (fd.equity - eq0) - fd.net_profit  # dividend/ustav o'zgarishi va h.k.
    d_cash = fd.cash - cash0

    ocf = fd.net_profit - d_rec - d_inv - d_other_ca + d_cl
    icf = -d_nca - d_sti
    fcf = d_ltl + d_eq_other
    total = ocf + icf + fcf

    return {
        "net_profit": fd.net_profit,
        "d_receivables": -d_rec,      # belgisi bilan: o'sish = chiqim
        "d_inventories": -d_inv,
        "d_other_ca": -d_other_ca,
        "d_current_liab": d_cl,
        "ocf": ocf,
        "d_nca": -d_nca,
        "d_sti": -d_sti,
        "icf": icf,
        "d_ltl": d_ltl,
        "d_eq_other": d_eq_other,
        "fcf": fcf,
        "total": total,
        "d_cash_actual": d_cash,      # tekshiruv: balansdagi haqiqiy ΔPul
        "reconciled": abs(total - d_cash) < max(1.0, abs(d_cash) * 0.01),
    }


# ---------------------------------------------------------------------------
def summarize(indicators: list[Indicator]) -> dict:
    counts = {"good": 0, "warn": 0, "bad": 0, "na": 0}
    for i in indicators:
        counts[i.status] = counts.get(i.status, 0) + 1
    scored = counts["good"] + counts["warn"] + counts["bad"]
    score = (counts["good"] * 100 + counts["warn"] * 50) / scored if scored else 0.0
    if score >= 75:
        vk = "strong"
    elif score >= 50:
        vk = "satisfactory"
    elif score >= 30:
        vk = "weak"
    else:
        vk = "critical"
    return {"counts": counts, "score": round(score, 1), "verdict_key": vk}