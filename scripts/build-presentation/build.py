"""Build docs/presentation/SaveBite_ClaudeCode_Figma_to_Code.pdf (16:9, Vietnamese).

Every project number on the slides is counted from the repo at build time (inventory, tokens, app/, src/, tests,
CHANGELOG, git log). Figma-vs-code values on the comparison page are parsed from docs/02-DESIGN-TOKENS.md, the
`// figma <node>` comments and the token/style values in code.
Run from the repo root:  python scripts/build-presentation/build.py
Needs: reportlab, pillow (pip install reportlab pillow) and node_modules (fonts from @expo-google-fonts).
"""

import math
import re
import subprocess
import textwrap
from datetime import datetime
from pathlib import Path

from PIL import Image
from reportlab.lib.colors import Color, HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "presentation" / "SaveBite_ClaudeCode_Figma_to_Code.pdf"
FIG = ROOT / "assets" / "figma-reference"
SHOTS = ROOT / "assets" / "app-screenshots"

TITLE = "Thiết kế 100 màn hình trên Figma và chuyển thiết kế thành code bằng Claude Code + Figma MCP"
TEAM = ["Lê Duy Đạt", "Lê Văn Quân", "Đặng Ngọc Tân", "Nguyễn Văn Rin", "Huỳnh Thanh Thuận"]
LECTURER = "TS. Lý Quỳnh Trân"
COURSE = "Thiết kế UI/UX"

W, H = 960, 540
M = 48

# SaveBite palette (src/design-system/tokens/colors.ts)
BG = HexColor("#FFFCF6")
PANEL = HexColor("#F4EFE6")
ACCENT = HexColor("#004337")
SECOND = HexColor("#B34021")
TEXT = HexColor("#092F29")
MUTED = HexColor("#606E66")
SAGE = HexColor("#EDF3E7")
BORDER = HexColor("#E8E2D8")
WHITE = HexColor("#FFFFFF")
FOREST = HexColor("#2D7055")
CODEBG = HexColor("#0E2A25")
WHEAT = HexColor("#F1D8AF")
MINT = HexColor("#E8F1EC")

# ---------------------------------------------------------------- fonts (embedded TTF)
FONTS = ROOT / "node_modules" / "@expo-google-fonts"
for name, rel in {
    "BVP": "be-vietnam-pro/400Regular/BeVietnamPro_400Regular.ttf",
    "BVP-Medium": "be-vietnam-pro/500Medium/BeVietnamPro_500Medium.ttf",
    "BVP-Semi": "be-vietnam-pro/600SemiBold/BeVietnamPro_600SemiBold.ttf",
    "BVP-Bold": "be-vietnam-pro/700Bold/BeVietnamPro_700Bold.ttf",
    "BVP-XBold": "be-vietnam-pro/800ExtraBold/BeVietnamPro_800ExtraBold.ttf",
    "Fraunces": "fraunces/700Bold/Fraunces_700Bold.ttf",
    "Mono": "jetbrains-mono/500Medium/JetBrainsMono_500Medium.ttf",
}.items():
    pdfmetrics.registerFont(TTFont(name, str(FONTS / rel)))
pdfmetrics.registerFontFamily("BVP", normal="BVP", bold="BVP-Bold", italic="BVP", boldItalic="BVP-Bold")


# ---------------------------------------------------------------- facts counted from the repo
def git(*args):
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True, encoding="utf-8").stdout


def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")


def block(src, name):
    """Body of `export const <name> = { ... } as const`."""
    return src.split(f"export const {name} = {{")[1].split("} as const")[0]


def collect():
    s = {}
    inv = read("docs/01-FIGMA-INVENTORY.md")
    groups, cur = [], None
    for line in inv.splitlines():
        g = re.match(r"^## (0\d) · (.+?) \((\d+)\)", line)
        if g:
            cur = {"no": g.group(1), "name": g.group(2), "count": 0, "kinds": {}}
            groups.append(cur)
        r = re.match(r"^\|\s*(SB-\d+)\s*\|[^|]*\|\s*(\w+)\s*\|", line)
        if r and cur:
            cur["count"] += 1
            cur["kinds"][r.group(2)] = cur["kinds"].get(r.group(2), 0) + 1
    s["groups"] = groups
    s["frames"] = sum(g["count"] for g in groups)
    s["kinds"] = {k: sum(g["kinds"].get(k, 0) for g in groups) for k in ("screen", "state", "sheet")}
    s["done"] = len(re.findall(r"\|\s*done\s*\|\s*$", inv, re.M))
    s["nodes"] = dict(re.findall(r"^\|\s*(SB-\d+)\s*\|.*?\[(\d+:\d+)\]", inv, re.M))

    app_tsx = list((ROOT / "app").rglob("*.tsx"))
    s["routes"] = len([p for p in app_tsx if p.name != "_layout.tsx"])
    s["ui"] = len(list((ROOT / "src" / "components" / "ui").rglob("*.tsx")))
    s["features"] = len(list((ROOT / "src" / "components" / "features").rglob("*.tsx")))
    code = [p for d in ("app", "src") for p in (ROOT / d).rglob("*") if p.suffix in (".ts", ".tsx")]
    s["code_files"] = len(code)
    s["loc"] = sum(len(p.read_text(encoding="utf-8").splitlines()) for p in code)
    s["tests"] = sum(
        len(re.findall(r"^\s*(?:it|test)\(", p.read_text(encoding="utf-8"), re.M))
        for p in (ROOT / "__tests__").glob("*.ts")
    )
    s["docs"] = len(list((ROOT / "docs").glob("*.md")))
    s["figma_png"] = len(list(FIG.glob("SB-*.png")))
    s["stores"] = len(list((ROOT / "src" / "store").glob("*.ts")))

    tok = ROOT / "src" / "design-system" / "tokens"
    s["colors_src"] = (tok / "colors.ts").read_text(encoding="utf-8")
    s["typo_src"] = (tok / "typography.ts").read_text(encoding="utf-8")
    s["radius_src"] = (tok / "radius.ts").read_text(encoding="utf-8")
    s["colors"] = len(re.findall(r"^\s+\w+:", block(s["colors_src"], "colors"), re.M))
    s["color_literals"] = len(re.findall(r"figma: literal|ESTIMATE", block(s["colors_src"], "colors")))
    s["typo"] = len(re.findall(r"^  \w+: \{", block(s["typo_src"], "typography"), re.M))
    s["radius"] = len(re.findall(r"^\s+\w+:", block(s["radius_src"], "radius"), re.M))

    log = git("log", "--reverse", "--format=%h|%ad|%s", "--date=format:%Y-%m-%d %H:%M")
    s["commits"] = [dict(zip(("hash", "date", "msg"), l.split("|", 2))) for l in log.strip().splitlines()]

    # build batches from CHANGELOG: "Đã dựng N màn" / "Tổng: N/100"
    batches = []
    for sec in re.split(r"^## ", read("docs/CHANGELOG.md"), flags=re.M)[1:]:
        head = sec.splitlines()[0]
        m = re.search(r"Tổng: (\d+)/100", sec) or re.search(r"Đã dựng (\d+) màn", sec)
        if m:
            date, _, title = head.partition(" — ")
            batches.append((date.strip(), title.strip(), int(m.group(1))))
    s["batches"] = batches

    pkg = read("package.json")
    ver = lambda n: re.search(rf'"{re.escape(n)}":\s*"[~^]?([\d.]+)"', pkg).group(1)
    s["v"] = {n: ver(n) for n in ("expo", "react-native", "react-native-maps", "react-native-reanimated", "typescript")}
    s["git_v"] = re.search(r"(\d+\.\d+)", git("--version")).group(1)

    plug = Path.home() / ".claude" / "plugins" / "cache"
    figma_dirs = sorted(plug.glob("claude-plugins-official/figma/*"))
    evon_dirs = sorted(plug.glob("evondevkit/evon/*"))
    s["figma_v"] = figma_dirs[-1].name if figma_dirs else "2.2.157"
    s["evon_v"] = evon_dirs[-1].name if evon_dirs else "0.3.12"
    s["figma_skills"] = sorted(p.name for p in (figma_dirs[-1] / "skills").iterdir()) if figma_dirs else []
    s["evon_skills"] = sorted(p.name for p in (evon_dirs[-1] / "skills").iterdir()) if evon_dirs else ["ui-ux"]
    if not s["figma_skills"]:  # machine without the plugin cache: names counted on the authoring machine
        s["figma_skills"] = ["figma-code-connect", "figma-code-workflows", "figma-create-new-file", "figma-design-to-code",
                             "figma-generate-design", "figma-generate-diagram", "figma-generate-library", "figma-generative-plugins",
                             "figma-implement-motion", "figma-shaders", "figma-spec", "figma-swiftui", "figma-use",
                             "figma-use-figjam", "figma-use-motion", "figma-use-slides"]
    return s


S = collect()


def figma_vs_code():
    """Rows (thuộc tính, Figma, code, khớp) — Figma side from docs/02 or `// figma` comments, code side from code."""
    d02 = read("docs/02-DESIGN-TOKENS.md")
    rows = []
    for token, label in (("canvas", "Nền màn"), ("brand900", "Màu CTA"), ("price", "Màu giá"), ("textPrimary", "Chữ chính")):
        f = re.search(rf"\|\s*`{token}`\s*\|\s*`(#[0-9A-Fa-f]{{6}})`", d02).group(1)
        c = re.search(rf"{token}: '(#[0-9A-Fa-f]{{6}})'", S["colors_src"]).group(1)
        rows.append((label, f, c, f.upper() == c.upper()))
    m = re.search(r"Tên thương hiệu header[^|]*\|\s*(\w+) \d+\s*\|\s*(\d+)", d02)
    c = re.search(r"brandTitle: \{ fontFamily: fontFamily\.(\w+), fontSize: (\d+)", S["typo_src"])
    rows.append(("Chữ thương hiệu", f"{m.group(1)} {m.group(2)}", f"{c.group(1)} {c.group(2)}",
                 m.group(1).lower() == c.group(1).lower() and m.group(2) == c.group(2)))
    m = re.search(r"Banner tiêu đề[^|]*\|\s*(\w+) \d+\s*\|\s*(\d+) / (\d+)", d02)
    c = re.search(r"heroTitle: \{ fontFamily: fontFamily\.(\w+), fontSize: (\d+), lineHeight: (\d+)", S["typo_src"])
    rows.append(("Tiêu đề banner", f"{m.group(1)} {m.group(2)}/{m.group(3)}", f"{c.group(1)} {c.group(2)}/{c.group(3)}",
                 m.groups()[1:] == c.groups()[1:]))
    m = re.search(r"Fraunces 700 (\d+)/(\d+)", d02)
    c = re.search(r"displayHero: \{\s*fontFamily: fontFamily\.display,\s*fontSize: (\d+),\s*lineHeight: (\d+)", S["typo_src"])
    rows.append(("Tiêu đề onboarding", f"Fraunces {m.group(1)}/{m.group(2)}", f"Fraunces {c.group(1)}/{c.group(2)}", m.groups() == c.groups()))
    f = re.search(r"\|\s*`md`\s*\|\s*(\d+)", d02).group(1)
    c = re.search(r"\bmd: (\d+)", S["radius_src"]).group(1)
    rows.append(("Bo góc thẻ món", f, f"radius.md {c}", f == c))
    imp = read("app/account/impact.tsx")
    f = re.search(r"figma 461:4966:.*?hero (\d+)", imp).group(1)
    c = re.search(r"hero: \{\s*height: (\d+)", imp).group(1)
    rows.append(("Hero SB-100 cao", f, c, f == c))
    noti = read("app/account/notifications.tsx")
    f = re.search(r"figma 133:3547:.*?(\d+)-high rows", noti).group(1)
    c = re.search(r"row: \{\s*height: (\d+)", noti).group(1)
    rows.append(("Hàng SB-095 cao", f, c, f == c))
    rows.append(("Nền bản đồ SB-016", "ảnh bản đồ", "Apple Maps thật", None))
    return rows


# ---------------------------------------------------------------- drawing helpers
def rrect(c, x, y, w, h, r, fill=None, stroke=None, sw=1):
    if fill is not None:
        c.setFillColor(fill)
    if stroke is not None:
        c.setStrokeColor(stroke)
        c.setLineWidth(sw)
    c.roundRect(x, y, w, h, r, stroke=1 if stroke is not None else 0, fill=1 if fill is not None else 0)


def soft_shadow(c, x, y, w, h, r, depth=6):
    for i in range(depth, 0, -1):
        c.setFillColor(Color(0.035, 0.18, 0.16, alpha=0.018))
        c.roundRect(x - i * 0.6, y - i * 1.1 - 1, w + i * 1.2, h + i * 1.2, r + i, stroke=0, fill=1)
    c.setFillAlpha(1)  # the shadow's fill alpha would otherwise leak into drawImage


def P(t, size=11, color=TEXT, font="BVP", leading=None):
    t = t.replace("→", "<font name='Mono'>→</font>")  # Be Vietnam Pro has no → glyph
    st = ParagraphStyle("p", fontName=font, fontSize=size, leading=leading or size * 1.4, textColor=color, alignment=TA_LEFT)
    return Paragraph(t, st)


def para(c, t, x, y_top, w, size=11, color=TEXT, font="BVP", leading=None):
    p = P(t, size, color, font, leading)
    _, h = p.wrap(w, 1000)
    p.drawOn(c, x, y_top - h)
    return h


def text(c, s, x, y, size=12, color=TEXT, font="BVP", anchor="l"):
    c.setFont(font, size)
    c.setFillColor(color)
    {"l": c.drawString, "c": c.drawCentredString, "r": c.drawRightString}[anchor](x, y, s)


def arrow(c, x1, y1, x2, y2, color=ACCENT, sw=1.6, head=6):
    c.setStrokeColor(color)
    c.setFillColor(color)
    c.setLineWidth(sw)
    a = math.atan2(y2 - y1, x2 - x1)
    bx, by = x2 - head * math.cos(a), y2 - head * math.sin(a)
    c.line(x1, y1, bx, by)
    p = c.beginPath()
    p.moveTo(x2, y2)
    p.lineTo(bx - head * 0.55 * math.sin(a), by + head * 0.55 * math.cos(a))
    p.lineTo(bx + head * 0.55 * math.sin(a), by - head * 0.55 * math.cos(a))
    p.close()
    c.drawPath(p, stroke=0, fill=1)


_img_cache = {}


def img(path, max_w=540):
    if path not in _img_cache:
        im = Image.open(path).convert("RGB")
        if im.width > max_w:
            im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
        _img_cache[path] = ImageReader(im)
    return _img_cache[path]


def phone(c, path, x, y, w, caption=None, sub=None):
    """Screenshot at the 393:852 frame ratio, rounded, soft shadow, caption below. (x, y) = bottom-left."""
    h = w * 852 / 393
    r = w * 0.085
    soft_shadow(c, x, y, w, h, r)
    c.saveState()
    p = c.beginPath()
    p.roundRect(x, y, w, h, r)
    c.clipPath(p, stroke=0, fill=0)
    c.drawImage(img(path), x, y, w, h)
    c.restoreState()
    rrect(c, x, y, w, h, r, stroke=BORDER, sw=0.6)
    small = w < 110
    if caption:
        text(c, caption, x + w / 2, y - 12, 8 if small else 9.5, TEXT, "BVP-Semi", "c")
    if sub:
        text(c, sub, x + w / 2, y - 23, 7 if small else 8, MUTED, "BVP", "c")
    return h


def table(c, x, y_top, widths, header, rows, size=9.5, head_fill=ACCENT, pad=7):
    """Wrapped table with a coloured header row; returns the y of its bottom edge."""
    tw = sum(widths)

    def cells(vals, header_row):
        out = []
        for i, v in enumerate(vals):
            font = "BVP-Bold" if header_row else ("BVP-Semi" if i == 0 else "BVP")
            p = P(v, size, WHITE if header_row else TEXT, font)
            _, h = p.wrap(widths[i] - 2 * pad, 1000)
            out.append((p, h))
        return out, max(h for _, h in out) + 2 * pad

    hc, hh = cells(header, True)
    rrect(c, x, y_top - hh, tw, hh, 8, fill=head_fill)
    c.rect(x, y_top - hh, tw, hh / 2, stroke=0, fill=1)
    cx = x
    for (p, h), w in zip(hc, widths):
        p.drawOn(c, cx + pad, y_top - pad - h)
        cx += w
    y = y_top - hh
    for i, r in enumerate(rows):
        rc, rh = cells(r, False)
        c.setFillColor(PANEL if i % 2 == 0 else BG)
        c.rect(x, y - rh, tw, rh, stroke=0, fill=1)
        cx = x
        for (p, h), w in zip(rc, widths):
            p.drawOn(c, cx + pad, y - pad - h)
            cx += w
        y -= rh
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.6)
    c.line(x, y, x + tw, y)
    return y


PAGES = []


def page(fn):
    PAGES.append(fn)
    return fn


def frame(c, n, kicker, title):
    c.setFillColor(BG)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    text(c, kicker.upper(), M, H - 50, 9.5, SECOND, "BVP-Bold")
    text(c, title, M, H - 80, 25, TEXT, "Fraunces")
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.6)
    c.line(M, 34, W - M, 34)
    text(c, "SaveBite · Claude Code × Figma MCP", M, 20, 8, MUTED)
    text(c, f"{n} / {len(PAGES)}", W - M, 20, 8, MUTED, "BVP-Semi", "r")


def card(c, x, y_top, w, h, title, body, fill=PANEL, title_color=ACCENT, size=10.5):
    rrect(c, x, y_top - h, w, h, 12, fill=fill)
    text(c, title, x + 14, y_top - 22, 11.5, title_color, "BVP-Bold")
    para(c, body, x + 14, y_top - 30, w - 28, size, TEXT)


def prompt_box(c, x, y_top, w, h, label, body, size=9.5):
    rrect(c, x, y_top - h, w, h, 10, fill=CODEBG)
    text(c, label, x + 12, y_top - 18, 8.5, WHEAT, "BVP-Bold")
    para(c, body, x + 12, y_top - 26, w - 24, size, MINT)


def loop_diagram(c, x, y, w):
    nodes = [
        ("Ý tưởng / yêu cầu", "bài toán, người dùng", PANEL, TEXT),
        ("Claude Code", "+ Figma MCP (ghi)", SECOND, WHITE),
        ("File Figma", f"{S['frames']} màn SB-xxx", PANEL, TEXT),
        ("Claude Code", "+ Figma MCP (đọc)", ACCENT, WHITE),
        ("App Expo / RN", f"{S['routes']} file route", PANEL, TEXT),
        ("iPhone · Expo Go", "quét QR, chạy thật", PANEL, TEXT),
    ]
    gap = 22
    bw = (w - gap * (len(nodes) - 1)) / len(nodes)
    bh = 60
    for i, (t1, t2, fill, col) in enumerate(nodes):
        bx = x + i * (bw + gap)
        rrect(c, bx, y, bw, bh, 12, fill=fill)
        text(c, t1, bx + bw / 2, y + bh / 2 + 4, 10.5, col, "BVP-Bold", "c")
        text(c, t2, bx + bw / 2, y + bh / 2 - 11, 8.5, col if col == WHITE else MUTED, "BVP-Medium", "c")
        if i < len(nodes) - 1:
            arrow(c, bx + bw + 3, y + bh / 2, bx + bw + gap - 3, y + bh / 2)
    yb = y - 22
    c.setStrokeColor(SECOND)
    c.setLineWidth(1.4)
    c.setDash(4, 3)
    x_end = x + w - bw / 2
    c.line(x_end, y - 2, x_end, yb)
    c.line(x_end, yb, x + bw / 2, yb)
    c.setDash()
    arrow(c, x + bw / 2, yb, x + bw / 2, y - 2, SECOND, 1.4)
    lbl = "phản hồi, sửa, quay lại"
    lw = c.stringWidth(lbl, "BVP-Semi", 9) + 16
    c.setFillColor(BG)
    c.rect(x + w / 2 - lw / 2, yb - 7, lw, 14, stroke=0, fill=1)
    text(c, lbl, x + w / 2, yb - 3, 9, SECOND, "BVP-Semi", "c")
    text(c, "CHIỀU GHI · thiết kế", x + 1 * (bw + gap) + bw / 2, y + bh + 9, 8, SECOND, "BVP-Bold", "c")
    text(c, "CHIỀU ĐỌC · lập trình", x + 3 * (bw + gap) + bw / 2, y + bh + 9, 8, ACCENT, "BVP-Bold", "c")


def pair(c, gx, y, pw, code, shot, label):
    phone(c, FIG / f"SB-{code}.png", gx, y, pw, "Figma", f"SB-{code}")
    phone(c, SHOTS / shot, gx + pw + 12, y, pw, "App · iPhone", "Expo Go")
    text(c, label, gx + pw + 6, y + pw * 852 / 393 + 9, 10.5, ACCENT, "BVP-Bold", "c")


# ---------------------------------------------------------------- pages
@page
def p_cover(c, n):
    c.setFillColor(BG)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(ACCENT)
    c.rect(W * 0.62, 0, W * 0.38, H, stroke=0, fill=1)
    phone(c, FIG / "SB-001.png", W * 0.62 + 34, 72, 146)
    phone(c, FIG / "SB-015.png", W * 0.62 + 196, 112, 146)
    text(c, f"MÔN {COURSE.upper()} · BÁO CÁO QUY TRÌNH", M, H - 70, 10, SECOND, "BVP-Bold")
    text(c, "SaveBite", M, H - 136, 56, ACCENT, "Fraunces")
    para(c, TITLE, M, H - 152, 500, 17, TEXT, "BVP-Bold", leading=24)
    y = H - 266
    text(c, "Nhóm sinh viên thực hiện", M, y, 9, MUTED, "BVP-Semi")
    for i, name in enumerate(TEAM):
        text(c, f"•  {name}", M + (i % 2) * 230, y - 22 - (i // 2) * 20, 12, TEXT, "BVP-Semi")
    y -= 22 + 3 * 20 + 14
    text(c, "Giảng viên hướng dẫn", M, y, 9, MUTED, "BVP-Semi")
    text(c, LECTURER, M, y - 20, 13, TEXT, "BVP-Bold")
    text(c, "Ngày", M + 300, y, 9, MUTED, "BVP-Semi")
    text(c, datetime.now().strftime("%d/%m/%Y"), M + 300, y - 20, 13, TEXT, "BVP-Bold")


@page
def p_overview(c, n):
    frame(c, n, "Tổng quan dự án", "Một công cụ, hai chiều")
    para(c, "<b>Bài toán:</b> cửa hàng quanh khu học xá còn dư món cuối ngày. <b>Người dùng:</b> sinh viên, nhân viên quanh trường (có chế độ khách). "
         "App cho phép <b>giữ chỗ</b>, <b>nhận và trả tiền tại quầy</b>, kèm <b>Tủ thực phẩm</b> theo dõi hạn dùng.<br/><br/>"
         "<b>Cách làm:</b> cùng một công cụ — Claude Code nối với Figma qua Figma MCP — vừa <font color='#B34021'><b>ghi</b></font> ra bản thiết kế, "
         "vừa <font color='#004337'><b>đọc</b></font> lại bản thiết kế để sinh code chạy trên iPhone.", M, H - 100, 470, 11.5)
    x = M + 510
    for i, g in enumerate(S["groups"]):
        cx = x + (i % 2) * 182
        cy = H - 100 - (i // 2) * 76
        rrect(c, cx, cy - 66, 172, 66, 12, fill=PANEL)
        text(c, str(g["count"]), cx + 14, cy - 44, 26, ACCENT, "BVP-XBold")
        text(c, f"màn · nhóm {g['no']}", cx + 60, cy - 30, 8.5, MUTED, "BVP-Semi")
        text(c, g["name"], cx + 60, cy - 44, 9, TEXT, "BVP-Bold")
    text(c, f"Tổng {S['frames']} frame · nguồn docs/01-FIGMA-INVENTORY.md", x, H - 266, 8.5, MUTED)
    loop_diagram(c, M, 104, W - 2 * M)


@page
def p_tools(c, n):
    frame(c, n, "Bộ công cụ", "Công cụ đã dùng và lý do chọn")
    v = S["v"]
    fs = S["figma_skills"]
    key = [k for k in ("figma-use", "figma-generate-library", "figma-generate-design", "figma-design-to-code", "figma-implement-motion") if k in fs]
    rows = [
        ("Claude Code (tiện ích VS Code)", "Đọc yêu cầu và docs, gọi Figma MCP để ghi/đọc thiết kế, viết code TypeScript, chạy kiểm tra, commit.",
         "Một tác tử làm cả thiết kế lẫn code; tự chạy lệnh và tự kiểm tra kết quả."),
        ("Figma + Figma MCP", f"Chứa file SaveBite V2. MCP (<font name='Mono' size='8.5'>mcp.figma.com/mcp</font>, plugin figma {S['figma_v']}) tạo/sửa node và đọc số đo, biến, ảnh.",
         "Lấy số đo thật thay vì đoán từ ảnh; một kết nối dùng cho cả hai chiều."),
        (f"Skills: figma ({len(fs)}), evon ({len(S['evon_skills'])})", "Quy trình cho từng việc: " + ", ".join(key) + f"; evon:ui-ux {S['evon_v']} để tham khảo UX.",
         "Làm đúng trình tự cho từng loại việc, giảm lỗi khi gọi công cụ MCP."),
        (f"Expo SDK {v['expo'].split('.')[0]} · React Native {v['react-native']} · TypeScript {v['typescript'][:3]}",
         f"Dựng app iOS bằng Expo Router (mỗi file = một màn), Reanimated {v['react-native-reanimated']}, react-native-maps {v['react-native-maps']}.",
         "Dev trên Windows, không cần Mac/Xcode; kiểu dữ liệu chặt giúp phát hiện lỗi sớm."),
        ("Expo Go trên iPhone", "Chạy app thật bằng cách quét QR từ <font name='Mono' size='8.5'>npx expo start</font>.",
         "Thử ngay trên thiết bị thật: chạm, cuộn, bản đồ, haptic."),
        (f"Git {S['git_v']}", f"Commit theo từng đợt ({len(S['commits'])} commit), hoàn tác khi cần.",
         "Lịch sử rõ ràng; quay lại an toàn (vd. bỏ hiệu ứng kính ở tab bar)."),
    ]
    table(c, M, H - 100, [200, 362, 302], ["Công cụ", "Dùng để làm gì", "Vì sao chọn"], rows, size=11, pad=11)


@page
def p_p1_method(c, n):
    frame(c, n, "Phần 1 · Thiết kế Figma bằng Claude Code", "Phương pháp: 5 bước")
    k = S["kinds"]
    g = "/".join(str(x["count"]) for x in S["groups"])
    rows = [
        ("1. Xác định bài toán", "Ý tưởng, người dùng, phạm vi", "Danh sách 100 màn, 4 nhóm luồng", "Mỗi màn thuộc một luồng, không trùng"),
        ("2. Foundations", "Bảng màu, chữ, khoảng cách", "Biến màu, kiểu chữ, radius, spacing, effect", "Chụp page Foundations, đối chiếu bảng"),
        ("3. Components", "Biến từ bước 2", "Component dùng chung + biến thể trạng thái", "Đủ trạng thái default / pressed / disabled"),
        ("4. Dựng 100 màn", "Component + luồng ở bước 1", f"{S['frames']} frame 393×852, nhóm {g}", "Tên SB-001 → SB-100 liên tục"),
        ("5. Rà soát", "Toàn bộ file", f"{k['screen']} màn chính, {k['state']} trạng thái, {k['sheet']} sheet", "Đếm frame, so ảnh chụp từng màn"),
    ]
    yb = table(c, M, H - 100, [170, 210, 260, 224], ["Bước", "Đầu vào", "Đầu ra", "Kiểm tra"], rows, size=10.5, pad=9)
    rrect(c, M, 52, W - 2 * M, yb - 66, 12, fill=SAGE)
    pages = [("Page 1", "Foundations"), ("Page 2", "Components"), ("Page 3", "App · All Screens")]
    bw, gap = 220, 60
    x0 = M + (W - 2 * M - 3 * bw - 2 * gap) / 2
    for i, (a, b) in enumerate(pages):
        bx = x0 + i * (bw + gap)
        rrect(c, bx, 72, bw, 56, 10, fill=ACCENT if i == 2 else WHITE)
        text(c, a, bx + 14, 108, 8.5, SAGE if i == 2 else SECOND, "BVP-Bold")
        text(c, b, bx + 14, 88, 13, WHITE if i == 2 else TEXT, "BVP-Bold")
        if i < 2:
            arrow(c, bx + bw + 8, 100, bx + bw + gap - 8, 100)
    para(c, "<b>Nguyên tắc:</b> đi từ nền móng lên (biến → component → màn) để mọi màn dùng chung một bộ biến; sửa một biến là cả 100 màn đổi theo. "
         "Sau mỗi bước, Claude Code chụp lại vùng vừa tạo để tự kiểm tra trước khi sang bước sau.", M + 16, yb - 30, W - 2 * M - 32, 11.5)


@page
def p_p1_howto(c, n):
    frame(c, n, "Phần 1 · Cách dùng Figma MCP để ghi vào Figma", "Thiết lập, ra lệnh, kiểm tra")
    steps = [
        "Cài plugin <b>figma</b> trong Claude Code (kèm Figma MCP server).",
        "Đăng nhập tài khoản Figma để MCP được xác thực.",
        "Đưa link file cho Claude Code; lấy <b>fileKey</b> từ link.",
        "Tài khoản phải có quyền <b>Edit</b> trên file.",
        "Claude Code nạp skill <b>figma-use</b> rồi gọi công cụ ghi: tạo biến, component, frame, gán style.",
    ]
    text(c, "Thiết lập", M, H - 106, 12, ACCENT, "BVP-Bold")
    y = H - 118
    for i, s_ in enumerate(steps):
        c.setFillColor(ACCENT)
        c.circle(M + 9, y - 9, 9, stroke=0, fill=1)
        text(c, str(i + 1), M + 9, y - 12.5, 9.5, WHITE, "BVP-Bold", "c")
        h = para(c, s_, M + 26, y - 1, 250, 11)
        y -= max(h, 20) + 14
    px, pw = M + 300, W - 2 * M - 300
    text(c, "Câu lệnh mẫu (minh họa cách ra lệnh)", px, H - 106, 12, ACCENT, "BVP-Bold")
    prompts = [
        ("BIẾN MÀU", "“Trên page Foundations, tạo collection biến SaveBite từ bảng token: brand-900 #004337, canvas #FFFCF6, price #B34021… Chụp lại để kiểm tra.”"),
        ("COMPONENT", "“Tạo component Button có biến thể Primary/Secondary × Default/Pressed/Disabled, cao 52, bo tròn hết, dùng biến màu vừa tạo.”"),
        ("DỰNG MÀN", "“Dựng frame 393×852 ‘SB-034 · Offer Detail · Exact Item’: ảnh món, giá, giờ nhận, nút giữ chỗ — chỉ dùng component có sẵn.”"),
        ("SẮP XẾP", "“Đổi tên và xếp mọi frame theo SB-001 → SB-100 vào 4 nhóm 01–04, rồi liệt kê số frame mỗi nhóm.”"),
    ]
    bw = (pw - 12) / 2
    for i, (lb, body) in enumerate(prompts):
        prompt_box(c, px + (i % 2) * (bw + 12), H - 116 - (i // 2) * 116, bw, 106, lb, body, 10.5)
    y0 = H - 116 - 2 * 116 - 6
    rrect(c, M, 52, W - 2 * M, y0 - 52, 12, fill=PANEL)
    text(c, "Lưu ý thực tế", M + 16, y0 - 22, 11.5, SECOND, "BVP-Bold")
    para(c, "• Chụp screenshot sau <b>mỗi</b> lần ghi để thấy ngay lỗi bố cục.<br/>"
         "• Lỗi “no edit access” từng gặp do gõ nhầm một ký tự trong fileKey: <font name='Mono'>l</font> (L thường) thay vì <font name='Mono'>I</font> (i hoa) — sửa key là hết (docs/CHANGELOG.md).<br/>"
         "• Không có quyền Edit thì MCP chỉ đọc được, không ghi được.", M + 16, y0 - 32, W - 2 * M - 32, 11)


@page
def p_p1_result(c, n):
    frame(c, n, "Phần 1 · Kết quả", "File Figma SaveBite V2")
    para(c, f"3 page: Foundations · Components · App · All Screens<br/><b>{S['frames']} frame</b> 393×852, tên dạng<br/>"
         "<font name='Mono' size='9'>SB-034 · Offer Detail · Exact Item</font>", M, H - 100, 270, 10.5)
    kc = {"screen": ACCENT, "state": SECOND, "sheet": FOREST}
    scale = 170 / max(g["count"] for g in S["groups"])
    y = H - 214
    for g in S["groups"]:
        text(c, f"{g['no']} · {g['name']}", M, y + 16, 9, TEXT, "BVP-Semi")
        x = M
        for kind in ("screen", "state", "sheet"):
            v = g["kinds"].get(kind, 0)
            if v:
                c.setFillColor(kc[kind])
                c.rect(x, y, v * scale - 1.2, 12, stroke=0, fill=1)
                if v * scale > 14:
                    text(c, str(v), x + v * scale / 2, y + 3, 7.5, WHITE, "BVP-Bold", "c")
                x += v * scale
        text(c, str(g["count"]), x + 6, y + 2, 9.5, TEXT, "BVP-Bold")
        y -= 44
    k = S["kinds"]
    for i, (kind, label) in enumerate((("screen", f"màn chính {k['screen']}"), ("state", f"trạng thái {k['state']}"), ("sheet", f"sheet {k['sheet']}"))):
        c.setFillColor(kc[kind])
        c.rect(M + i * 86, y + 14, 9, 9, stroke=0, fill=1)
        text(c, label, M + i * 86 + 13, y + 15, 8, TEXT)
    codes = ["001", "002", "005", "015", "016", "023", "029", "034", "044", "056", "075", "100"]
    names = ["Splash", "Onboarding", "Chào mừng", "Khám phá", "Bản đồ", "Bộ lọc", "Bánh mì", "Chi tiết món", "Túi bất ngờ", "Vé nhận", "Tủ thực phẩm", "Tác động"]
    gx0, cols, pw = M + 300, 6, 76
    gap = (W - M - gx0 - cols * pw) / (cols - 1)
    for i, (code, nm) in enumerate(zip(codes, names)):
        x = gx0 + (i % cols) * (pw + gap)
        yy = 262 if i < cols else 60
        phone(c, FIG / f"SB-{code}.png", x, yy, pw, f"SB-{code}", nm)


@page
def p_p2_method(c, n):
    frame(c, n, "Phần 2 · Từ Figma sang code", "Phương pháp: pipeline 8 bước")
    steps = [
        ("Đọc design context", "get_design_context"),
        ("Đọc biến", "get_variable_defs"),
        ("Ảnh + asset", f"get_screenshot · {S['figma_png']} ảnh"),
        ("Design tokens", f"{S['colors']} màu · {S['typo']} kiểu chữ"),
        ("Component", f"{S['ui'] + S['features']} file dùng chung"),
        ("Dựng màn", f"{S['routes']} file route"),
        ("Điều hướng + mock", "Expo Router · repository"),
        ("Chạy Expo Go", "iPhone thật, quét QR"),
    ]
    bw, gap = 190, 28
    for i, (t, sub) in enumerate(steps):
        row, col = divmod(i, 4)
        col = col if row == 0 else 3 - col  # snake order
        bx = M + col * (bw + gap)
        by = H - 160 - row * 78
        hi = i in (0, 7)
        rrect(c, bx, by, bw, 54, 10, fill=ACCENT if hi else PANEL)
        text(c, f"{i + 1}. {t}", bx + 12, by + 32, 10.5, WHITE if hi else TEXT, "BVP-Bold")
        text(c, sub, bx + 12, by + 14, 8.5, SAGE if hi else MUTED, "Mono" if i < 3 else "BVP")
        if i in (0, 1, 2):
            arrow(c, bx + bw + 3, by + 27, bx + bw + gap - 3, by + 27)
        elif i == 3:
            arrow(c, bx + bw / 2, by - 2, bx + bw / 2, by - 22)
        elif i in (4, 5, 6):
            arrow(c, bx - 3, by + 27, bx - gap + 3, by + 27)
    y = H - 268
    rrect(c, M, 52, 250, y - 52, 12, fill=SECOND)
    text(c, "Figma luôn đúng", M + 16, y - 28, 15, WHITE, "Fraunces")
    para(c, "Không tự “cải tiến” màu, chữ, khoảng cách. Chi tiết nào Expo Go không làm được thì ghi rõ giới hạn, đề xuất cách gần nhất và hỏi trước khi đổi. "
         "Giá trị lẻ trong Figma được ghi chú bằng comment <font name='Mono' size='9.5'>figma: node</font>.", M + 16, y - 40, 218, 11, WHITE)
    cx = M + 266
    rrect(c, cx, 52, 300, y - 52, 12, fill=SAGE)
    text(c, "Checklist độ giống Figma (docs/08)", cx + 14, y - 24, 10.5, ACCENT, "BVP-Bold")
    para(c, "• kích thước · padding / gap<br/>• radius · shadow · màu<br/>• font / weight / line-height<br/>• ảnh (crop, tỉ lệ) · icon<br/>• trạng thái · điều hướng<br/>• so với screenshot Figma",
         cx + 14, y - 36, 272, 12, leading=20)
    src = read("app/account/impact.tsx").splitlines()
    start = next(i for i, l in enumerate(src) if "figma 461:4966" in l)
    sx = M + 582
    rrect(c, sx, 52, W - M - sx, y - 52, 12, fill=CODEBG)
    text(c, "Ví dụ: app/account/impact.tsx", sx + 12, y - 20, 8.5, SAGE, "BVP-Semi")
    yy = y - 38
    for idx, line in enumerate([src[start]] + src[start + 2 : start + 9]):
        for chunk in textwrap.wrap(line.strip(), 38) or [""]:
            text(c, chunk, sx + 12, yy, 8.2, WHEAT if idx == 0 else MINT, "Mono")
            yy -= 13
    para(c, "Comment ghi node và số đo Figma; style ngay dưới dùng đúng các số đó.", sx + 12, yy - 4, W - M - sx - 24, 9.5, SAGE)


@page
def p_p2_howto(c, n):
    frame(c, n, "Phần 2 · Cách dùng Claude Code để sinh code", "Môi trường, bộ nhớ, câu lệnh")
    cw = (W - 2 * M - 32) / 3
    x1, x2, x3 = M, M + cw + 16, M + 2 * (cw + 16)
    top = H - 100
    text(c, "Thiết lập môi trường", x1, top - 6, 11.5, ACCENT, "BVP-Bold")
    env = [
        ("Windows 11 · Node · Git", "không cần Mac/Xcode"),
        (f"Expo SDK {S['v']['expo'].split('.')[0]} + TypeScript", "npx create-expo-app"),
        ("Cài Expo Go trên iPhone", "tải từ App Store"),
        ("npx expo start", "quét QR · --tunnel khi LAN chặn"),
        ("npx tsc --noEmit · npx expo lint", "kiểm tra trước khi commit"),
    ]
    y = top - 18
    for t, sub in env:
        rrect(c, x1, y - 64, cw, 58, 8, fill=PANEL)
        text(c, t, x1 + 14, y - 29, 10.5, TEXT, "Mono" if t.startswith("npx") else "BVP-Semi")
        text(c, sub, x1 + 14, y - 47, 9.5, MUTED)
        y -= 68
    text(c, "Bộ nhớ ngữ cảnh", x2, top - 6, 11.5, ACCENT, "BVP-Bold")
    h = para(c, f"<b>CLAUDE.md</b>: luật cứng (Figma luôn đúng, chỉ thư viện có trong Expo Go, không hard-code màu). "
             f"<b>docs/</b> ({S['docs']} file): inventory, token, component, điều hướng, checklist, CHANGELOG — đọc đầu mỗi phiên.", x2, top - 16, cw, 10)
    tree = [("app/", 0, "route = màn"), ("(entry) (tabs) discover", 1, ""), ("offer reserve account", 1, ""), ("src/", 0, ""),
            ("components/ui", 1, f"{S['ui']} file"), ("components/features", 1, f"{S['features']} file"), ("design-system/tokens", 1, ""),
            ("services → repositories", 1, "mock"), ("store/", 1, f"{S['stores']} store")]
    rrect(c, x2, 52, cw, top - 30 - h - 52, 10, fill=SAGE)
    yy = top - 46 - h
    for name, lvl, note in tree:
        text(c, ("└ " if lvl else "") + name, x2 + 12 + lvl * 10, yy, 9.5, TEXT, "Mono")
        if note:
            text(c, note, x2 + cw - 12, yy, 9, MUTED, anchor="r")
        yy -= 25
    text(c, "Câu lệnh mẫu", x3, top - 6, 11.5, ACCENT, "BVP-Bold")
    node = S["nodes"].get("SB-015", "17:49")
    prompts = [
        ("ĐỌC FRAME, DỰNG MÀN", f"“Đọc frame SB-015 (node {node}) bằng Figma MCP, dựng màn Khám phá bằng token và component có sẵn, lưu screenshot tham chiếu.”"),
        ("BẢN ĐỒ THẬT", "“Thay ảnh bản đồ tĩnh ở SB-016 bằng Apple Maps qua react-native-maps (có trong Expo Go), ghim giá theo Figma.”"),
        ("HIỆU ỨNG KÍNH", "“Thêm kính cho nút tròn bằng expo-glass-effect, fallback BlurView, tôn trọng Reduce Transparency.”"),
        ("KIỂM TRA + GHI LẠI", "“Chạy tsc, eslint, jest, expo-doctor; cập nhật docs/01, docs/08, CHANGELOG rồi commit.”"),
    ]
    y = top - 16
    for lb, body in prompts:
        prompt_box(c, x3, y, cw, 86, lb, body, 10)
        y -= 94


@page
def p_p2_batches(c, n):
    frame(c, n, "Phần 2 · Quy trình theo đợt", f"{len(S['commits'])} commit, dựng dần tới {S['frames']} màn")
    cm = S["commits"]
    t = [datetime.strptime(x["date"], "%Y-%m-%d %H:%M") for x in cm]
    x0, x1, ya = M + 6, W - M - 6, H - 112
    c.setStrokeColor(BORDER)
    c.setLineWidth(2)
    c.line(x0, ya, x1, ya)
    span = (t[-1] - t[0]).total_seconds()
    col = {"feat": ACCENT, "fix": SECOND, "revert": MUTED}
    kind = lambda m: "revert" if m.lower().startswith(("revert", '"revert')) else m.split(":")[0].split("(")[0]
    for x_, m in zip(t, cm):
        px = x0 + (x_ - t[0]).total_seconds() / span * (x1 - x0)
        c.setFillColor(col.get(kind(m["msg"]), FOREST))
        c.circle(px, ya, 4, stroke=0, fill=1)
    text(c, t[0].strftime("%d/%m %H:%M"), x0, ya - 16, 8, MUTED)
    text(c, t[-1].strftime("%d/%m %H:%M"), x1, ya - 16, 8, MUTED, anchor="r")
    lx = M + 200
    for k_, lbl in (("feat", "tính năng"), ("fix", "sửa lỗi"), ("revert", "hoàn tác")):
        c.setFillColor(col[k_])
        c.circle(lx, ya - 13, 3.5, stroke=0, fill=1)
        text(c, lbl, lx + 7, ya - 16, 8, MUTED)
        lx += 76
    text(c, "mỗi chấm là một commit trong git log", lx + 10, ya - 16, 8, MUTED)
    rows = [(b[1], b[0], f"{b[2]}/{S['frames']}") for b in S["batches"]]
    yb = table(c, M, ya - 32, [200, 80, 80], ["Đợt (docs/CHANGELOG.md)", "Ngày", "Màn xong"], rows, size=10, pad=9)
    rrect(c, M, 52, 360, yb - 64, 10, fill=SAGE)
    para(c, "<b>Mỗi đợt kiểm tra:</b> tsc · eslint · jest · expo-doctor · bundle iOS, rồi chạy trên iPhone bằng Expo Go và so với ảnh Figma; lỗi phát hiện được sửa ở đợt sau.",
         M + 14, yb - 26, 332, 11)
    ex = M + 380
    errs = [
        ("“no edit access”", "nhầm <font name='Mono'>l</font> (L thường) với <font name='Mono'>I</font> (i hoa) trong fileKey", "dùng đúng key"),
        ("Bấm Bánh mì chỉ tải lại", "SDK 58 không cho điều hướng tới tab ẩn", "chuyển thành màn stack"),
        ("Nhận nhầm font", "ghi “không có serif”", "đối chiếu lại, thêm Fraunces"),
        ("Bản đồ mất zoom", "props native đổi mỗi lần render", "cố định initialRegion, mapPadding"),
        ("Lưới SB-078 vỡ 1 cột", "168+16+168 làm tròn vượt 353", "dựng 2 ô mỗi hàng"),
    ]
    table(c, ex, ya - 32, [150, 172, W - M - ex - 322], ["Lỗi thật", "Nguyên nhân", "Cách xử lý"], errs, size=10.5, head_fill=SECOND, pad=12)


@page
def p_compare1(c, n):
    frame(c, n, "So sánh Figma và code", "Cặp ảnh Figma | App trên iPhone")
    para(c, "Ảnh App là ảnh chụp màn hình thật trên iPhone (Expo Go), đặt cạnh frame xuất từ Figma. Nút bánh răng xanh ở mép phải là lớp công cụ phát triển, "
         "không thuộc giao diện app. SB-016: app dùng Apple Maps thật thay cho ảnh bản đồ trong Figma.", M, H - 92, W - 2 * M, 9.5, MUTED)
    pw = 128
    gw = 2 * pw + 12
    gap = (W - 2 * M - 3 * gw) / 2
    for i, (code, shot, label) in enumerate((("015", "IMG_8644.PNG", "Khám phá"), ("016", "IMG_8642.PNG", "Bản đồ"), ("029", "IMG_8643.PNG", "Bánh mì & pastry"))):
        pair(c, M + i * (gw + gap), 74, pw, code, shot, label)


@page
def p_compare2(c, n):
    frame(c, n, "So sánh Figma và code", "Cặp ảnh và giá trị đo được")
    pw = 104
    for i, (code, shot, label) in enumerate((("023", "IMG_8645.PNG", "Bộ lọc tổng hợp"), ("081", "IMG_8646.PNG", "Chi tiết thực phẩm"))):
        pair(c, M + i * (2 * pw + 30), 150, pw, code, shot, label)
    para(c, "SB-081: món trên iPhone do người dùng tự nhập khi demo nên chữ khác Figma; bố cục, cỡ chữ và màu trùng nhau.", M, 108, 2 * (2 * pw + 30) - 18, 8.5, MUTED)
    tx = M + 2 * (2 * pw + 30) + 6
    rows = [(a, f, cv, "Khớp" if ok else ("Khác, chủ đích" if ok is None else "Lệch")) for a, f, cv, ok in figma_vs_code()]
    table(c, tx, H - 100, [92, 78, 92, W - M - tx - 262], ["Thuộc tính", "Figma", "Code", "Khớp?"], rows, size=9, pad=8)


@page
def p_match(c, n):
    frame(c, n, "So sánh Figma và code", "Mức độ khớp theo nhóm yếu tố")
    rows = [
        ("Màu", "Khớp", f"{S['colors']} token màu khớp docs/02; {S['color_literals']} giá trị lẻ có ghi chú // figma, trong đó 1 màu nền là ước lượng."),
        ("Chữ", "Khớp", f"Be Vietnam Pro 5 độ đậm, Fraunces cho tiêu đề editorial, JetBrains Mono cho mã nhận; {S['typo']} kiểu chữ. Trục SOFT/WONK của Fraunces không có ở font tĩnh."),
        ("Khoảng cách", "Khớp sau rà soát", "Số đo lấy bằng get_metadata; vd. nút “Lưu thay đổi” SB-092 đặt đúng y488, nút CTA cách đáy 36–44pt theo từng màn."),
        ("Bo góc", "Khớp", f"{S['radius']} token radius (thẻ 20, hàng 18, ô 16, input 14…)."),
        ("Icon", "Gần khớp", "Icon Phosphor/brand xuất SVG từ Figma; icon hệ thống iOS dùng SF Symbols."),
        ("Bố cục", "Khớp", "Đúng ở 393×852, màn khác co giãn bằng flex; ảnh hero xuất 1× hơi mờ trên màn Retina."),
        ("Hiệu ứng", "Xấp xỉ", "Liquid Glass: GlassView trên iOS 26, BlurView ở bản cũ; bản đồ là Apple Maps thật nên nền khác Figma."),
        ("Điều hướng", "Suy luận", "Dây prototype không đọc được qua MCP; luồng được nối theo suy luận và ghi ở docs/04."),
    ]
    table(c, M, H - 100, [130, 140, W - 2 * M - 270], ["Nhóm yếu tố", "Mức khớp", "Nhận xét"], rows, size=11, pad=10)
    para(c, "<b>Phương pháp so sánh:</b> ảnh chụp thật trên iPhone đặt cạnh ảnh frame Figma; giá trị đo đối chiếu giữa docs/02, comment // figma và code. "
         "Nguồn nhận xét: docs/08, docs/CHANGELOG.md.", M, 74, W - 2 * M, 9.5, MUTED)


@page
def p_lessons(c, n):
    frame(c, n, "Hạn chế, bài học và kết luận", "Đã làm được gì")
    stats = [
        (f"{S['done']}/{S['frames']}", "màn đã dựng"),
        (str(S["routes"]), "file route"),
        (str(S["ui"] + S["features"]), "file component"),
        (f"{S['loc']:,}".replace(",", "."), "dòng TS/TSX"),
        (str(len(S["commits"])), "commit"),
        (str(S["tests"]), "test tự động"),
    ]
    sw = (W - 2 * M - 5 * 12) / 6
    for i, (v, l) in enumerate(stats):
        x = M + i * (sw + 12)
        rrect(c, x, H - 162, sw, 60, 12, fill=PANEL)
        text(c, v, x + 12, H - 132, 19, ACCENT, "BVP-XBold")
        text(c, l, x + 12, H - 150, 8.5, MUTED)
    cw = (W - 2 * M - 24) / 3
    card(c, M, H - 176, cw, 182, "Hạn chế",
         "• Figma MCP không đọc được dây nối prototype.<br/>• Component bọc Code Connect che số đo, phải đọc thêm bằng get_metadata.<br/>"
         "• Hiệu ứng native (kính) khó tái hiện trong Expo Go.<br/>• AI vẫn sai, cần người kiểm tra trên máy thật.", size=11.5)
    card(c, M + cw + 12, H - 176, cw, 182, "Bài học",
         "• Biến và component trước, màn sau.<br/>• CLAUDE.md + docs giữ ngữ cảnh giữa các phiên.<br/>• Kiểm tra bằng screenshot sau mỗi lần ghi hoặc dựng.<br/>• Commit từng đợt để hoàn tác an toàn.",
         fill=SAGE, size=11.5)
    card(c, M + 2 * (cw + 12), H - 176, cw, 182, "Hướng phát triển",
         "• Backend thật thay dữ liệu mock.<br/>• Xin quyền vị trí thật.<br/>• Bản build production qua EAS.<br/>• Kiểm thử với người dùng thật.", size=11.5)
    rrect(c, M, 52, W - 2 * M, 96, 12, fill=ACCENT)
    text(c, "Kết luận", M + 18, 124, 14, WHITE, "Fraunces")
    para(c, f"Với <b>Claude Code + Figma MCP</b>, nhóm dùng một công cụ cho hai chiều: ghi ra file Figma {S['frames']} màn theo 4 nhóm, rồi đọc lại để sinh app Expo chạy trên iPhone "
         f"với {S['routes']} route, {S['ui'] + S['features']} component, {S['colors']} token màu; kiểm tra bằng {S['tests']} test tự động và so sánh trực tiếp với Figma.",
         M + 18, 114, W - 2 * M - 36, 10.5, WHITE)


def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT), pagesize=(W, H))
    c.setTitle("SaveBite: " + TITLE)
    c.setAuthor(", ".join(TEAM))
    c.setSubject(f"Báo cáo quy trình môn {COURSE}")
    for i, fn in enumerate(PAGES, 1):
        fn(c, i)
        c.showPage()
    c.save()
    print(f"{OUT.relative_to(ROOT)} · {len(PAGES)} trang")
    for row in figma_vs_code():
        print(row)


if __name__ == "__main__":
    build()
