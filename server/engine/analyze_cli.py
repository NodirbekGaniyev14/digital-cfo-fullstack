# -*- coding: utf-8 -*-
"""
analyze_cli.py — website backend uchun ko'prik.

Botning AYNAN o'sha yadrosini (parser/indicators/advice/report) ishlatadi,
shuning uchun natijalar Telegram bot bilan bir xil bo'ladi.

Foydalanish:
  python analyze_cli.py <fayl1> [<fayl2>] --lang uz --pdf /path/out.pdf

stdout ga bitta JSON qator chiqaradi (ekranda ko'rsatish uchun) va --pdf
berilgan bo'lsa, bot bilan bir xil PDF hisobotni yaratadi.
"""
import sys
import os
import json
import argparse

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from parser import parse_excel, FormParseError  # noqa: E402
from indicators import compute_indicators, summarize  # noqa: E402
import langr  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("files", nargs="+")
    ap.add_argument("--lang", default="uz")
    ap.add_argument("--pdf", default="")
    args = ap.parse_args()
    lang = args.lang if args.lang in ("uz", "ru", "en") else "uz"

    try:
        filenames = [os.path.basename(p) for p in args.files]
        fd = parse_excel(args.files, filenames=filenames)
        inds = compute_indicators(fd)
        summary = summarize(inds)

        pdf_path = ""
        if args.pdf:
            from report import build_report
            build_report(inds, fd, args.pdf, lang)
            pdf_path = args.pdf

        result = {
            "ok": True,
            "company": fd.company,
            "stir": fd.stir,
            "period_year": fd.period_year,
            "period_quarter": fd.period_quarter,
            "has_pl": fd.has_pl,
            "score": summary["score"],
            "verdict": langr.t(langr.VERDICT, summary["verdict_key"], lang),
            "verdict_key": summary["verdict_key"],
            "counts": summary["counts"],
            "groups": {},
            "indicators": [],
            "pdf": os.path.basename(pdf_path) if pdf_path else "",
        }
        for ind in inds:
            g = ind.group
            if g not in result["groups"]:
                result["groups"][g] = langr.t_group(g, lang)
            result["indicators"].append({
                "code": ind.code,
                "group": g,
                "name": langr.t_ind_name(ind.code, lang),
                "value": ind.value,
                "unit": ind.unit,
                "status": ind.status,
                "norm": langr.t_ind_norm(ind.code, lang),
            })
        sys.stdout.write(json.dumps(result, ensure_ascii=False))
    except FormParseError as e:
        sys.stdout.write(json.dumps(
            {"ok": False, "error": e.message, "code": e.code}, ensure_ascii=False))
    except Exception as e:  # noqa: BLE001
        sys.stdout.write(json.dumps(
            {"ok": False, "error": "Faylni tahlil qilib bo'lmadi: " + str(e)},
            ensure_ascii=False))


if __name__ == "__main__":
    main()
