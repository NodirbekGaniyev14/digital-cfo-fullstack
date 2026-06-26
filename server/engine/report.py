# -*- coding: utf-8 -*-
"""
report.py — uch tilli (uz/ru/en) professional PDF hisobot.
build_report(indicators, fd, out_path, lang) — lang ∈ {"uz","ru","en"}.
"""

from __future__ import annotations
import os
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether,
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from indicators import Indicator, summarize
from advice import build_conclusions, build_recommendations
import langr

BRAND = colors.HexColor("#0F4C81")
BRAND_LIGHT = colors.HexColor("#E8F0F7")
HEADER_FG = colors.white
GOOD = colors.HexColor("#2E7D32"); GOOD_BG = colors.HexColor("#E6F4EA")
WARN = colors.HexColor("#B26A00"); WARN_BG = colors.HexColor("#FFF4E0")
BAD = colors.HexColor("#C62828");  BAD_BG = colors.HexColor("#FDE7E7")
GREY = colors.HexColor("#666666")

STATUS_BG = {"good": GOOD_BG, "warn": WARN_BG, "bad": BAD_BG, "na": colors.whitesmoke}
STATUS_FG = {"good": GOOD, "warn": WARN, "bad": BAD, "na": GREY}


def _register_fonts():
    """Kirill va o'zbek harflarini qo'llaydigan shriftni yuklaydi.
    Qidirish tartibi:
      1) Loyiha ichidagi fonts/ papkasi yoki report.py yonidagi .ttf
      2) Tizim shriftlari: Calibri, Times, Arial, Segoe UI, Tahoma, Verdana...
      3) Shrift papkalarini to'liq skanerlash — ishlaydigan istalgan .ttf
      4) Eng oxirgi chora: Times-Roman (PDF hech qachon xato bilan to'xtamaydi)
    """
    import sys
    import glob
    here = os.path.dirname(os.path.abspath(__file__))

    candidates = [
        # 1) Loyiha bilan birga keladigan shriftlar
        (os.path.join(here, "fonts", "DejaVuSans.ttf"),
         os.path.join(here, "fonts", "DejaVuSans-Bold.ttf")),
        (os.path.join(here, "DejaVuSans.ttf"),
         os.path.join(here, "DejaVuSans-Bold.ttf")),
    ]

    font_dirs = []
    if sys.platform == "win32":
        wf = os.path.join(os.environ.get("WINDIR", r"C:\Windows"), "Fonts")
        font_dirs.append(wf)
        for reg, bold in (("calibri.ttf", "calibrib.ttf"),
                          ("times.ttf", "timesbd.ttf"),
                          ("arial.ttf", "arialbd.ttf"),
                          ("segoeui.ttf", "segoeuib.ttf"),
                          ("tahoma.ttf", "tahomabd.ttf"),
                          ("verdana.ttf", "verdanab.ttf"),
                          ("georgia.ttf", "georgiab.ttf"),
                          ("cour.ttf", "courbd.ttf")):
            candidates.append((os.path.join(wf, reg), os.path.join(wf, bold)))
    elif sys.platform == "darwin":
        sf = "/System/Library/Fonts/Supplemental"
        font_dirs.append(sf)
        candidates += [(f"{sf}/Arial.ttf", f"{sf}/Arial Bold.ttf"),
                       (f"{sf}/Times New Roman.ttf", f"{sf}/Times New Roman Bold.ttf")]
    else:
        font_dirs += ["/usr/share/fonts", "/usr/local/share/fonts"]
        candidates += [
            ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
             "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
            ("/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
             "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"),
        ]

    def _try(reg, bold):
        try:
            pdfmetrics.registerFont(TTFont("CfoFont", reg))
            pdfmetrics.registerFont(TTFont("CfoFont-Bold",
                                           bold if (bold and os.path.isfile(bold)) else reg))
            return True
        except Exception:
            return False

    # 1-2) Nomma-nom nomzodlar
    for reg, bold in candidates:
        if os.path.isfile(reg) and _try(reg, bold):
            return "CfoFont", "CfoFont-Bold"

    # 3) Papkalarni to'liq skanerlash — birinchi ishlagan .ttf
    for d in font_dirs:
        if not os.path.isdir(d):
            continue
        for reg in sorted(glob.glob(os.path.join(d, "**", "*.ttf"), recursive=True)):
            name = os.path.basename(reg).lower()
            if any(bad in name for bad in ("symbol", "wingding", "webding", "marlett", "emoji", "italic", "oblique")):
                continue
            if _try(reg, None):
                return "CfoFont", "CfoFont"

    # 4) Hech narsa topilmadi — baribir PDF chiqsin
    return "Times-Roman", "Times-Bold"



def _fmt(ind: Indicator, lng: str) -> str:
    if ind.value is None:
        return "—"
    if ind.unit == "%":
        return f"{ind.value:.1f}%"
    if ind.unit == "kun":
        return f"{ind.value:.0f} {langr.t(langr.UI, 'unit_days', lng)}"
    return f"{ind.value:.2f}"


def _cf_chart(cf: dict, money_unit: str, CF, font: str, font_b: str):
    """OCF/ICF/FCF/sof o'zgarish uchun gorizontal bar-diagramma chizadi
    (musbat — yashil, manfiy — qizil), nol chizig'idan ikki tomonga."""
    if not cf:
        return None
    from reportlab.graphics.shapes import Drawing, Rect, String, Line

    rows = [("ocf_short", cf["ocf"]), ("icf_short", cf["icf"]),
            ("fcf_short", cf["fcf"]), ("net_short", cf["total"])]
    maxval = max((abs(v) for _, v in rows if v is not None), default=0) or 1.0

    W, H = 168 * mm, 30 * mm
    label_w, margin_r = 34 * mm, 6 * mm
    chart_l, chart_r = label_w, W - margin_r
    zero_x = chart_l + (chart_r - chart_l) / 2
    half = (chart_r - chart_l) / 2 - 3
    row_h = H / len(rows)
    bar_h = row_h * 0.5

    d = Drawing(W, H)
    d.add(Line(zero_x, 1, zero_x, H - 1, strokeColor=colors.HexColor("#AAAAAA"), strokeWidth=0.6))
    for i, (key, val) in enumerate(rows):
        v = val or 0.0
        yc = H - row_h * (i + 0.5)
        bw = (v / maxval) * half if maxval else 0
        color = GOOD if v >= 0 else BAD
        x0 = zero_x if v >= 0 else zero_x + bw
        d.add(Rect(x0, yc - bar_h / 2, abs(bw), bar_h, fillColor=color, strokeColor=None))
        d.add(String(0, yc - 3, CF(key), fontName=font_b, fontSize=8, fillColor=colors.black))
        val_str = f"{v:,.0f}".replace(",", " ") + " " + money_unit
        if v >= 0:
            d.add(String(x0 + abs(bw) + 3, yc - 3, val_str, fontName=font, fontSize=7.5,
                         fillColor=GREY))
        else:
            d.add(String(x0 - 3, yc - 3, val_str, fontName=font, fontSize=7.5,
                         fillColor=GREY, textAnchor="end"))
    return d


def build_report(indicators: list[Indicator], fd, out_path: str, lng: str = "uz") -> str:
    FONT, FONT_B = _register_fonts()
    summary = summarize(indicators)
    U = lambda k: langr.t(langr.UI, k, lng)

    doc = SimpleDocTemplate(
        out_path, pagesize=A4,
        leftMargin=16 * mm, rightMargin=16 * mm, topMargin=16 * mm, bottomMargin=16 * mm,
        title=U("title"), author="Digital CFO")

    ss = getSampleStyleSheet()
    h_title = ParagraphStyle("t", parent=ss["Title"], fontName=FONT_B, fontSize=20,
                             textColor=BRAND, spaceAfter=2, alignment=TA_LEFT)
    h_sub = ParagraphStyle("s", parent=ss["Normal"], fontName=FONT, fontSize=10, textColor=GREY)
    h_grp = ParagraphStyle("g", parent=ss["Heading2"], fontName=FONT_B, fontSize=12.5,
                           textColor=BRAND, spaceBefore=10, spaceAfter=4)
    h_sec = ParagraphStyle("sec", parent=ss["Heading2"], fontName=FONT_B, fontSize=13,
                           textColor=BRAND, spaceBefore=12, spaceAfter=6)
    body = ParagraphStyle("b", parent=ss["Normal"], fontName=FONT, fontSize=9.5, leading=13)
    bullet = ParagraphStyle("bl", parent=body, leftIndent=10, spaceAfter=4)
    cell = ParagraphStyle("c", parent=ss["Normal"], fontName=FONT, fontSize=8.5, leading=10.5)
    cell_b = ParagraphStyle("cb", parent=cell, fontName=FONT_B)
    cell_c = ParagraphStyle("cc", parent=cell, alignment=TA_CENTER)
    cell_h = ParagraphStyle("ch", parent=cell_b, textColor=HEADER_FG)
    status_cell = {
        k: ParagraphStyle(f"st_{k}", parent=cell_c, fontName=FONT_B, textColor=v)
        for k, v in STATUS_FG.items()
    }

    story = []

    # --- Sarlavha ---
    story.append(Paragraph(U("title"), h_title))
    story.append(Paragraph(U("subtitle"), h_sub))
    story.append(HRFlowable(width="100%", thickness=2, color=BRAND, spaceBefore=4, spaceAfter=8))

    # Hisobot davri (yil + chorak) — tilga moslab
    _STIR = {"uz": "STIR", "ru": "ИНН", "en": "TIN"}
    _QTR = {"uz": "{}-chorak", "ru": "{}-кв.", "en": "Q{}"}
    if fd.period_year:
        period_str = str(fd.period_year)
        if fd.period_quarter:
            period_str += ", " + _QTR.get(lng, "Q{}").format(fd.period_quarter)
    else:
        period_str = fd.period or "—"

    missing_meta = {"uz": "Faylda yo'q", "ru": "Нет в файле", "en": "Not in file"}.get(lng, "Not in file")

    # Korxona nomi alohida, to'liq kenglikda — uzun nomlar boshqa ustunlarga
    # "yopishib" qolmasligi uchun (Paragraph o'zi qatorlarga bo'lib chiqaradi).
    company_style = ParagraphStyle("comp", parent=cell_b, fontSize=10.5, leading=13)
    company_row = Table(
        [[Paragraph(U("company") + ":", company_style),
          Paragraph(fd.company or missing_meta, company_style)]],
        colWidths=[26 * mm, 130 * mm])
    company_row.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 1),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3), ("VALIGN", (0, 0), (-1, -1), "TOP")]))
    story.append(company_row)

    meta = [
        [_STIR.get(lng, "STIR") + ":", fd.stir or missing_meta,
         U("period") + ":", period_str,
         U("date") + ":", datetime.now().strftime("%d.%m.%Y")],
    ]
    mt = Table(meta, colWidths=[18 * mm, 38 * mm, 18 * mm, 38 * mm, 16 * mm, 28 * mm])
    mt.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, -1), FONT),
        ("FONTNAME", (0, 0), (0, -1), FONT_B), ("FONTNAME", (2, 0), (2, -1), FONT_B),
        ("FONTNAME", (4, 0), (4, -1), FONT_B),
        ("FONTSIZE", (0, 0), (-1, -1), 9), ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3)]))
    story.append(mt)
    story.append(Spacer(1, 8))

    # --- Scorecard ---
    cnt = summary["counts"]
    verdict = langr.t(langr.VERDICT, summary["verdict_key"], lng)
    score_st = ParagraphStyle("score", parent=cell_c, leading=20)
    big_st = ParagraphStyle("big", parent=cell_c, leading=18)
    score_tbl = Table([[
        Paragraph(f"<font size=9 color='#666666'>{U('overall')}</font><br/>"
                  f"<font size=20 color='#0F4C81'><b>{summary['score']}</b></font>"
                  f"<font size=10 color='#666666'>/100</font><br/>"
                  f"<font size=9><b>«{verdict}»</b></font>", score_st),
        Paragraph(f"<font size=18 color='#2E7D32'><b>{cnt['good']}</b></font><br/>{langr.t(langr.STATUS,'good',lng)}", big_st),
        Paragraph(f"<font size=18 color='#B26A00'><b>{cnt['warn']}</b></font><br/>{langr.t(langr.STATUS,'warn',lng)}", big_st),
        Paragraph(f"<font size=18 color='#C62828'><b>{cnt['bad']}</b></font><br/>{langr.t(langr.STATUS,'bad',lng)}", big_st),
    ]], colWidths=[58 * mm, 33 * mm, 33 * mm, 34 * mm])
    score_tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), BRAND_LIGHT), ("BOX", (0, 0), (-1, -1), 0.5, BRAND),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.white), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 8), ("BOTTOMPADDING", (0, 0), (-1, -1), 8)]))
    story.append(score_tbl)

    # --- Shakl 2 yo'qligi haqida eslatma ---
    if not fd.has_pl:
        story.append(Spacer(1, 6))
        story.append(Paragraph(U("no_form2"),
                     ParagraphStyle("nf", parent=body, fontSize=8.5, textColor=WARN,
                                    backColor=WARN_BG, borderPadding=5)))

    # --- Guruhlar bo'yicha jadvallar ---
    groups: dict[str, list[Indicator]] = {}
    for ind in indicators:
        groups.setdefault(ind.group, []).append(ind)

    header = [Paragraph(U(h), cell_h) for h in
              ("c_num", "c_name", "c_value", "c_norm", "c_eval", "c_comment")]

    for gkey, items in groups.items():
        rows = [header]
        sc = [
            ("BACKGROUND", (0, 0), (-1, 0), BRAND), ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, -1), FONT), ("FONTSIZE", (0, 0), (-1, -1), 8.5),
            ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#CCCCCC")),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("ALIGN", (0, 0), (0, -1), "CENTER"), ("ALIGN", (2, 1), (2, -1), "CENTER"),
            ("ALIGN", (4, 1), (4, -1), "CENTER"),
            ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F7F9FB")])]
        for r, ind in enumerate(items, start=1):
            rows.append([
                Paragraph(ind.code, cell_c),
                Paragraph(langr.t_ind_name(ind.code, lng), cell),
                Paragraph(_fmt(ind, lng), cell_c),
                Paragraph(langr.t_ind_norm(ind.code, lng), cell_c),
                Paragraph(langr.t(langr.STATUS, ind.status, lng), status_cell[ind.status]),
                Paragraph(langr.t_comment(ind.ck, lng)
                          or langr.t_auto_comment(ind.code, ind.status, lng), cell)])
            sc.append(("BACKGROUND", (4, r), (4, r), STATUS_BG[ind.status]))
            sc.append(("TEXTCOLOR", (4, r), (4, r), STATUS_FG[ind.status]))
        tbl = Table(rows, colWidths=[10 * mm, 58 * mm, 18 * mm, 24 * mm, 20 * mm, 48 * mm],
                    repeatRows=1)
        tbl.setStyle(TableStyle(sc))
        story.append(KeepTogether([Paragraph(langr.t_group(gkey, lng), h_grp)]))
        story.append(tbl)

    # --- Pul oqimlari (bilvosita usul) ---
    from indicators import compute_cashflow
    cf = compute_cashflow(fd)
    CF = lambda k: langr.t(langr.CF, k, lng)

    def _money(v):
        if v is None:
            return "—"
        return f"{v:,.0f}".replace(",", " ")

    money_unit = U("money_unit")

    def _with_unit(params: dict) -> dict:
        """'x'/'p' summalariga o'lchov birligini ('ming so'm' va h.k.) qo'shadi."""
        out = dict(params)
        for k in ("x", "p"):
            if k in out:
                out[k] = f"{out[k]} {money_unit}"
        return out

    story.append(Paragraph(CF("title"), h_sec))
    if cf is None:
        story.append(Paragraph(CF("no_data"), bullet))
    else:
        cf_rows = [[Paragraph(CF("item"), cell_h), Paragraph(CF("amount"), cell_h)]]
        cf_style = [
            ("BACKGROUND", (0, 0), (-1, 0), BRAND), ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, -1), FONT), ("FONTSIZE", (0, 0), (-1, -1), 8.5),
            ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#CCCCCC")),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("ALIGN", (1, 1), (1, -1), "RIGHT"),
            ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3)]

        # (kalit, bold satr?, indent?)
        cf_lines = [
            ("net_profit", False, False),
            ("d_receivables", False, True),
            ("d_inventories", False, True),
            ("d_other_ca", False, True),
            ("d_current_liab", False, True),
            ("ocf", True, False),
            ("d_nca", False, True),
            ("d_sti", False, True),
            ("icf", True, False),
            ("d_ltl", False, True),
            ("d_eq_other", False, True),
            ("fcf", True, False),
            ("total", True, False),
            ("d_cash_actual", False, False),
        ]
        r = 0
        for key, is_bold, indent in cf_lines:
            r += 1
            label = CF(key)
            if indent:
                label = "&nbsp;&nbsp;&nbsp;" + label
            val = cf[key]
            st = cell_b if is_bold else cell
            cf_rows.append([Paragraph(label, st), Paragraph(_money(val), st)])
            if is_bold:
                cf_style.append(("BACKGROUND", (0, r), (-1, r), BRAND_LIGHT))
                # manfiy jami — qizil, musbat — yashil
                cf_style.append(("TEXTCOLOR", (1, r), (1, r),
                                 BAD if (val is not None and val < 0) else GOOD))

        cf_tbl = Table(cf_rows, colWidths=[128 * mm, 50 * mm], repeatRows=1)
        cf_tbl.setStyle(TableStyle(cf_style))
        story.append(cf_tbl)

        # Izoh va ogohlantirishlar
        small_grey = ParagraphStyle("cfn", parent=body, fontSize=8, textColor=GREY,
                                    spaceBefore=4)
        story.append(Paragraph(CF("note"), small_grey))

        h_sub2 = ParagraphStyle("cfsub", parent=ss["Heading3"], fontName=FONT_B,
                                fontSize=10.5, textColor=BRAND,
                                spaceBefore=8, spaceAfter=3)

        # --- Pul oqimlari diagrammasi (OCF / ICF / FCF / sof o'zgarish) ---
        chart = _cf_chart(cf, money_unit, CF, FONT, FONT_B)
        if chart is not None:
            story.append(KeepTogether([
                Spacer(1, 6), Paragraph(CF("chart_title"), h_sub2), chart]))

        # --- Yo'nalishlar bo'yicha xulosa (operatsion / investitsion / moliyaviy) ---
        from advice import build_cf_conclusions, build_cf_solutions
        CFA = lambda k: langr.t(langr.CFA, k, lng)
        cfa = build_cf_conclusions(cf, fd)

        story.append(Paragraph(CFA("dir_title"), h_sub2))

        def _dir_line(label_key, item):
            key, params = item
            txt = langr.t(langr.CFA, key, lng).format(**_with_unit(params))
            story.append(Paragraph(
                f"•&nbsp; <b>{CFA(label_key)}:</b> {txt}", bullet))

        if cfa["ocf"]:
            _dir_line("lbl_ocf", cfa["ocf"])
        if cfa["tied"]:
            tied_txts = [langr.t(langr.CFA, k, lng).format(**_with_unit(p))
                         for k, p in cfa["tied"]]
            story.append(Paragraph(
                f"•&nbsp; <b>{CFA('lbl_tied')}:</b> " + "; ".join(tied_txts) + ".",
                bullet))
        if cfa["icf"]:
            _dir_line("lbl_icf", cfa["icf"])
        if cfa["fcf"]:
            _dir_line("lbl_fcf", cfa["fcf"])

        # --- Takliflar ---
        story.append(Paragraph(CFA("sol_title"), h_sub2))
        for n, (key, params) in enumerate(build_cf_solutions(cf, fd), 1):
            txt = langr.t(langr.CFA, key, lng).format(**_with_unit(params))
            story.append(Paragraph(f"{n}.&nbsp; {txt}", bullet))

    # --- Xulosa ---
    story.append(Paragraph(U("conclusions"), h_sec))
    overall = langr.t(langr.CONCL, "overall", lng).format(
        v=verdict, s=summary["score"], g=cnt["good"], w=cnt["warn"], b=cnt["bad"])
    story.append(Paragraph(f"•&nbsp; {overall}", bullet))
    for key, params in build_conclusions(indicators, summary, fd.has_pl):
        line = langr.t(langr.CONCL, key, lng).format(**params)
        story.append(Paragraph(f"•&nbsp; {line}", bullet))

    # --- Tavsiyalar ---
    story.append(Paragraph(U("recommendations"), h_sec))
    for n, key in enumerate(build_recommendations(indicators, fd.has_pl), 1):
        line = langr.t(langr.RECS, key, lng)
        story.append(Paragraph(f"{n}.&nbsp; {line}", bullet))

    # --- Footer ---
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=0.5, color=GREY))
    story.append(Paragraph(U("disclaimer"),
                 ParagraphStyle("f", parent=body, fontSize=8, textColor=GREY)))

    def _footer(canvas, d):
        canvas.saveState()
        canvas.setFont(FONT, 7.5); canvas.setFillColor(GREY)
        canvas.drawString(16 * mm, 10 * mm, U("footer"))
        canvas.drawRightString(A4[0] - 16 * mm, 10 * mm, U("page").format(d.page))
        canvas.restoreState()

    doc.build(story, onFirstPage=_footer, onLaterPages=_footer)
    return out_path


if __name__ == "__main__":
    from parser import demo_data
    from indicators import compute_indicators
    fd = demo_data()
    inds = compute_indicators(fd)
    for lg in ("uz", "ru", "en"):
        p = build_report(inds, fd, f"/tmp/demo_{lg}.pdf", lg)
        print(lg, "->", os.path.getsize(p), "bayt")
