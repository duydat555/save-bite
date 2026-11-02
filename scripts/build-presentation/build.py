"""Build docs/presentation/SaveBite_ClaudeCode_Figma_to_Code.pdf (16:9, Vietnamese).

All numbers on the slides are counted from the repo at build time (inventory, app/, src/, git log, tests).
Run from the repo root:  python scripts/build-presentation/build.py
Needs: reportlab, pillow (pip install reportlab pillow) and node_modules (fonts from @expo-google-fonts).
"""

import re
import subprocess
import textwrap
from datetime import datetime
from pathlib import Path

from PIL import Image
from reportlab.lib.colors import Color, HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT
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


def collect():
    s = {}
    inv = (ROOT / "docs" / "01-FIGMA-INVENTORY.md").read_text(encoding="utf-8")
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

    app_tsx = list((ROOT / "app").rglob("*.tsx"))
    s["routes"] = len([p for p in app_tsx if p.name != "_layout.tsx"])
    s["layouts"] = len(app_tsx) - s["routes"]
    s["ui"] = len(list((ROOT / "src" / "components" / "ui").rglob("*.tsx")))
    s["features"] = len(list((ROOT / "src" / "components" / "features").rglob("*.tsx")))
    code = [p for d in ("app", "src") for p in (ROOT / d).rglob("*") if p.suffix in (".ts", ".tsx")]
    s["code_files"] = len(code)
    s["loc"] = sum(len(p.read_text(encoding="utf-8").splitlines()) for p in code)
    s["tests"] = sum(
        len(re.findall(r"^\s*(?:it|test)\(", p.read_text(encoding="utf-8"), re.M))
        for p in (ROOT / "__tests__").glob("*.ts")
    )
    s["test_files"] = len(list((ROOT / "__tests__").glob("*.ts")))
    s["docs"] = len(list((ROOT / "docs").glob("*.md")))
    s["figma_png"] = len(list(FIG.glob("SB-*.png")))
    s["stores"] = len(list((ROOT / "src" / "store").glob("*.ts")))
    colors = (ROOT / "src" / "design-system" / "tokens" / "colors.ts").read_text(encoding="utf-8")
    block = colors.split("export const colors = {")[1].split("} as const")[0]
    s["colors"] = len(re.findall(r"^\s+\w+:", block, re.M))
    s["color_literals"] = len(re.findall(r"figma: literal|ESTIMATE", block))

    log = git("log", "--reverse", "--format=%h|%ad|%s", "--date=format:%Y-%m-%d %H:%M")
    s["commits"] = [dict(zip(("hash", "date", "msg"), l.split("|", 2))) for l in log.strip().splitlines()]
    pkg = (ROOT / "package.json").read_text(encoding="utf-8")
    ver = lambda n: re.search(rf'"{re.escape(n)}":\s*"[~^]?([\d.]+)"', pkg).group(1)
    s["v"] = {n: ver(n) for n in ("expo", "react-native", "expo-router", "react-native-maps", "react-native-reanimated")}
    return s


S = collect()


# ---------------------------------------------------------------- drawing helpers
def rgba(c, a):
    return Color(c.red, c.green, c.blue, alpha=a)


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
    c.setFillAlpha(1)


def para(c, text_, x, y_top, w, size=12, color=TEXT, font="BVP", leading=None, align=TA_LEFT):
    text_ = text_.replace("→", "<font name='Mono'>→</font>")  # Be Vietnam Pro has no → glyph
    st = ParagraphStyle("p", fontName=font, fontSize=size, leading=leading or size * 1.42, textColor=color, alignment=align)
    p = Paragraph(text_, st)
    _, h = p.wrap(w, 1000)
    p.drawOn(c, x, y_top - h)
    return h


def text(c, s, x, y, size=12, color=TEXT, font="BVP", anchor="l"):
    c.setFont(font, size)
    c.setFillColor(color)
    {"l": c.drawString, "c": c.drawCentredString, "r": c.drawRightString}[anchor](x, y, s)


def arrow(c, x1, y1, x2, y2, color=ACCENT, sw=1.6, head=6):
    import math

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
    """Screenshot at the 393:852 frame ratio, rounded, soft shadow, caption below. (x, y) = bottom-left of the image."""
    h = w * 852 / 393
    r = w * 0.085
    soft_shadow(c, x, y, w, h, r)
    if path is None:
        rrect(c, x, y, w, h, r, fill=PANEL, stroke=MUTED, sw=0.8)
        c.setDash(3, 3)
        rrect(c, x + 6, y + 6, w - 12, h - 12, r - 4, stroke=MUTED, sw=0.8)
        c.setDash()
        para(c, "[Chèn ảnh chụp từ iPhone]", x + 10, y + h / 2 + 14, w - 20, 9, MUTED, "BVP-Semi", align=TA_CENTER)
    else:
        c.saveState()
        p = c.beginPath()
        p.roundRect(x, y, w, h, r)
        c.clipPath(p, stroke=0, fill=0)
        c.drawImage(img(path), x, y, w, h)
        c.restoreState()
        rrect(c, x, y, w, h, r, stroke=BORDER, sw=0.6)
    if caption:
        text(c, caption, x + w / 2, y - 13, 8.5 if w < 120 else 10, TEXT, "BVP-Semi", "c")
    if sub:
        text(c, sub, x + w / 2, y - 25, 7.5 if w < 120 else 8.5, MUTED, "BVP", "c")
    return h


PAGES = []


def page(fn):
    PAGES.append(fn)
    return fn


def frame(c, n, kicker, title):
    c.setFillColor(BG)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    if kicker:
        text(c, kicker.upper(), M, H - 52, 9.5, SECOND, "BVP-Bold")
    if title:
        text(c, title, M, H - 84, 27, TEXT, "Fraunces")
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.6)
    c.line(M, 34, W - M, 34)
    text(c, "SaveBite · Claude Code × Figma MCP", M, 20, 8, MUTED)
    text(c, f"{n} / {len(PAGES)}", W - M, 20, 8, MUTED, "BVP-Semi", "r")


def card(c, x, y_top, w, h, title, body, fill=PANEL, title_color=ACCENT, size=10.5):
    rrect(c, x, y_top - h, w, h, 14, fill=fill)
    text(c, title, x + 16, y_top - 26, 12.5, title_color, "BVP-Bold")
    para(c, body, x + 16, y_top - 36, w - 32, size, TEXT)


def tag(c, s, x, y, fill=SAGE, color=ACCENT, size=8.5):
    c.setFont("BVP-Semi", size)
    w = c.stringWidth(s, "BVP-Semi", size) + 16
    rrect(c, x, y, w, size + 9, (size + 9) / 2, fill=fill)
    text(c, s, x + 8, y + 5, size, color, "BVP-Semi")
    return w


def loop_diagram(c, x, y, w, compact=False):
    """Ý tưởng → Claude Code + MCP (ghi) → Figma → Claude Code + MCP (đọc) → App → iPhone → phản hồi → quay lại."""
    nodes = [
        ("Ý tưởng / yêu cầu", "", PANEL, TEXT),
        ("Claude Code", "+ Figma MCP (ghi)", SECOND, WHITE),
        ("File Figma", f"{S['frames']} màn SB-xxx", PANEL, TEXT),
        ("Claude Code", "+ Figma MCP (đọc) · skill · docs", ACCENT, WHITE),
        ("App Expo / RN", f"{S['routes']} file route", PANEL, TEXT),
        ("iPhone · Expo Go", "quét QR, chạy thử", PANEL, TEXT),
    ]
    gap = 22
    bw = (w - gap * (len(nodes) - 1)) / len(nodes)
    bh = 62 if not compact else 54
    for i, (t1, t2, fill, col) in enumerate(nodes):
        bx = x + i * (bw + gap)
        rrect(c, bx, y, bw, bh, 12, fill=fill)
        text(c, t1, bx + bw / 2, y + bh / 2 + (4 if t2 else -4), 10.5 if not compact else 9.5, col, "BVP-Bold", "c")
        if t2:
            para(c, t2, bx + 6, y + bh / 2 - 4, bw - 12, 8 if not compact else 7.5, col if col == WHITE else MUTED, "BVP-Medium", align=TA_CENTER)
        if i < len(nodes) - 1:
            arrow(c, bx + bw + 3, y + bh / 2, bx + bw + gap - 3, y + bh / 2)
    # return path under the row
    yb = y - 22
    c.setStrokeColor(SECOND)
    c.setLineWidth(1.4)
    c.setDash(4, 3)
    x_end = x + w - bw / 2
    c.line(x_end, y - 2, x_end, yb)
    c.line(x_end, yb, x + bw / 2, yb)
    c.setDash()
    arrow(c, x + bw / 2, yb, x + bw / 2, y - 2, SECOND, 1.4)
    c.setFillColor(BG)
    lbl = "phản hồi, sửa, quay lại"
    lw = c.stringWidth(lbl, "BVP-Semi", 9) + 16
    c.rect(x + w / 2 - lw / 2, yb - 7, lw, 14, stroke=0, fill=1)
    text(c, lbl, x + w / 2, yb - 3, 9, SECOND, "BVP-Semi", "c")
    # direction labels
    b1 = x + 1 * (bw + gap)
    b3 = x + 3 * (bw + gap)
    text(c, "CHIỀU GHI · thiết kế", b1 + bw / 2, y + bh + 9, 8, SECOND, "BVP-Bold", "c")
    text(c, "CHIỀU ĐỌC · lập trình", b3 + bw / 2, y + bh + 9, 8, ACCENT, "BVP-Bold", "c")


# ---------------------------------------------------------------- pages
@page
def p_cover(c, n):
    c.setFillColor(BG)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(ACCENT)
    c.rect(W * 0.6, 0, W * 0.4, H, stroke=0, fill=1)
    phone(c, FIG / "SB-001.png", W * 0.6 + 40, 70, 150)
    phone(c, FIG / "SB-015.png", W * 0.6 + 210, 110, 150)
    text(c, "MÔN THIẾT KẾ UI/UX · BÁO CÁO QUY TRÌNH", M, H - 90, 10, SECOND, "BVP-Bold")
    text(c, "SaveBite", M, H - 170, 64, ACCENT, "Fraunces")
    para(c, "Giải cứu món ăn còn dư cuối ngày quanh khu học xá — giữ chỗ trong app, nhận và trả tiền tại quầy.", M, H - 196, 470, 15, TEXT, "BVP-Medium")
    para(c, "Từ ý tưởng đến iPhone với <b>Claude Code + Figma MCP</b>: một công cụ, hai chiều — ghi ra thiết kế và đọc lại thành code.", M, H - 262, 470, 12, MUTED)
    y = 128
    for label, val in (("Sinh viên", "[Họ tên - MSSV]"), ("Giảng viên", "[Giảng viên]"), ("Ngày", "02/11/2026")):
        text(c, label, M, y, 9, MUTED, "BVP-Semi")
        text(c, val, M + 90, y, 11, TEXT, "BVP-Bold")
        y -= 22


@page
def p_overview(c, n):
    frame(c, n, "Tổng quan", "Một công cụ, hai chiều")
    para(c, "<b>Vấn đề:</b> cửa hàng quanh trường còn dư món cuối ngày. <b>Người dùng:</b> sinh viên, nhân viên quanh khu học xá (có chế độ khách). App giúp giữ chỗ, nhận tại quầy, và theo dõi hạn dùng trong <b>Tủ thực phẩm</b>.", M, H - 104, 500, 12)
    x = M + 530
    for i, g in enumerate(S["groups"]):
        cx = x + (i % 2) * 192
        cy = H - 104 - (i // 2) * 78
        rrect(c, cx, cy - 66, 180, 66, 12, fill=PANEL)
        text(c, str(g["count"]), cx + 14, cy - 44, 26, ACCENT, "BVP-XBold")
        text(c, f"màn · nhóm {g['no']}", cx + 62, cy - 30, 8.5, MUTED, "BVP-Semi")
        text(c, g["name"], cx + 62, cy - 44, 9.5, TEXT, "BVP-Bold")
    text(c, f"Tổng {S['frames']} frame (đếm từ docs/01-FIGMA-INVENTORY.md)", x, H - 272, 8.5, MUTED)
    loop_diagram(c, M, 112, W - 2 * M)


@page
def p_tools(c, n):
    frame(c, n, "Công cụ & thiết lập", "Bộ công cụ thật của dự án")
    v = S["v"]
    cols = [
        ("Claude Code", "Chạy trong VS Code trên <b>Windows 11</b>. Đọc docs, gọi Figma MCP, viết code, chạy tsc · eslint · jest, commit."),
        ("Figma MCP", "Server <font name='Mono' size='9'>mcp.figma.com/mcp</font> + plugin figma 2.2.157. Đăng nhập tài khoản Figma; cần quyền <b>Editor</b> trên file."),
        ("Skill / plugin", "figma-design-to-code (bắt buộc trước get_design_context), figma-use, figma-generate-design, figma-implement-motion · evon:ui-ux 0.3.12 (tham khảo)."),
        ("Expo · iPhone", f"Expo SDK {v['expo'].split('.')[0]}, React Native {v['react-native']}, Expo Router. Chạy bằng <b>Expo Go</b> trên iPhone thật, quét QR."),
    ]
    cw = (W - 2 * M - 3 * 16) / 4
    for i, (t, b) in enumerate(cols):
        card(c, M + i * (cw + 16), H - 110, cw, 210, t, b, size=12)
    rrect(c, M, 66, W - 2 * M, 136, 14, fill=SAGE)
    text(c, "Vì sao chọn bộ này", M + 18, 176, 13, ACCENT, "BVP-Bold")
    para(c, "Không có Mac/Xcode → Expo Go chạy app trên iPhone thật chỉ bằng QR. Figma MCP cho Claude Code <b>đọc số đo thật</b> của từng frame thay vì đoán từ ảnh. Expo Router: mỗi file là một màn, dễ khớp 1-1 với SB-xxx.", M + 18, 164, W - 2 * M - 36, 13)


@page
def p_figma_process(c, n):
    frame(c, n, "Phần 1 · Claude Code tạo Figma", "Từ nền móng tới 100 màn")
    steps = [
        ("Foundations", "Màu, chữ, khoảng cách, bo góc, bóng — biến dùng chung"),
        ("Components", "Nút, thẻ món, ô tìm kiếm, tab bar, sheet…"),
        ("App · All Screens", "4 nhóm, frame đặt tên SB-xxx · Tên"),
    ]
    bw, gap = 250, 57
    for i, (t, b) in enumerate(steps):
        bx = M + i * (bw + gap)
        rrect(c, bx, 300, bw, 110, 14, fill=PANEL if i < 2 else ACCENT)
        text(c, f"Page {i + 1}", bx + 18, 384, 9, SECOND if i < 2 else SAGE, "BVP-Bold")
        text(c, t, bx + 18, 362, 15, TEXT if i < 2 else WHITE, "BVP-Bold")
        para(c, b, bx + 18, 350, bw - 36, 10.5, MUTED if i < 2 else SAGE)
        if i < 2:
            arrow(c, bx + bw + 8, 355, bx + bw + gap - 8, 355)
    card(c, M, 268, 420, 170, "Vai trò của Figma MCP (chiều ghi)",
         "Claude Code gọi công cụ ghi của Figma MCP để tạo biến, component và frame ngay trong file, rồi chụp lại để tự kiểm. "
         "<font color='#B34021'>[CẦN BỔ SUNG: công cụ/skill ghi đã dùng thực tế]</font>", fill=SAGE, size=12.5)
    card(c, M + 436, 268, W - 2 * M - 436, 170, "Câu lệnh đã dùng",
         "<font color='#B34021'>[CẦN BỔ SUNG: prompt thực tế để tạo Figma]</font><br/>"
         "<font color='#B34021'>[CẦN BỔ SUNG: ra lệnh theo nhóm hay từng màn]</font><br/><br/>"
         "<font size='10' color='#606E66'>Repo này chỉ lưu Phase 2 (code). Quá trình tạo Figma không có log trong repo nên không tự điền.</font>", size=12.5)


@page
def p_figma_structure(c, n):
    frame(c, n, "Phần 1 · Kết quả trong Figma", "Cấu trúc file SaveBite V2")
    k = S["kinds"]
    para(c, f"3 page · <b>{S['frames']} frame</b> 393×852 · tên <font name='Mono' size='10'>SB-034 · Offer Detail · Exact Item</font>", M, H - 104, 520, 12)
    # stacked bars per group (vector)
    kc = {"screen": ACCENT, "state": SECOND, "sheet": HexColor("#2D7055")}
    y0, bh, maxw = H - 160, 26, 330
    scale = maxw / max(g["count"] for g in S["groups"])
    for i, g in enumerate(S["groups"]):
        y = y0 - i * 44
        text(c, f"{g['no']} · {g['name']}", M, y + 9, 10, TEXT, "BVP-Semi")
        x = M + 170
        for kind in ("screen", "state", "sheet"):
            v = g["kinds"].get(kind, 0)
            if v:
                c.setFillColor(kc[kind])
                c.rect(x, y, v * scale - 1.5, bh - 8, stroke=0, fill=1)
                if v * scale > 16:
                    text(c, str(v), x + v * scale / 2, y + 5, 8.5, WHITE, "BVP-Bold", "c")
                x += v * scale
        text(c, str(g["count"]), x + 8, y + 5, 10, TEXT, "BVP-Bold")
    lx = M + 170
    for kind, label in (("screen", f"màn chính {k['screen']}"), ("state", f"trạng thái {k['state']}"), ("sheet", f"bottom sheet {k['sheet']}")):
        c.setFillColor(kc[kind])
        c.rect(lx, y0 - 4 * 44 + 6, 10, 10, stroke=0, fill=1)
        text(c, label, lx + 15, y0 - 4 * 44 + 7, 9, TEXT)
        lx += 110
    x2 = M + 560
    card(c, x2, H - 104, W - M - x2, 140, "Làm tốt",
         f"Đặt tên nhất quán, frame cùng kích thước. Có sẵn {k['state']} trạng thái và {k['sheet']} sheet → code biết đủ trạng thái cần dựng. Màu/chữ là biến.", fill=SAGE, size=11.5)
    card(c, x2, H - 260, W - M - x2, 196, "Chưa tốt (đã gặp thật)",
         "Dây prototype không đọc được qua MCP → luồng phải suy luận (docs/04). "
         f"{S['color_literals']} màu là giá trị lẻ, không có biến. Ảnh hero xuất 1× hơi mờ. "
         "Vài nút không có màn đích (link chính sách SB-006, FAQ SB-099).", size=11.5)


@page
def p_figma_grid(c, n):
    frame(c, n, "Phần 1 · Ảnh chụp từ Figma", "16 trên 100 màn")
    codes = ["001", "002", "005", "015", "016", "019", "023", "029", "034", "044", "051", "056", "063", "075", "091", "100"]
    names = ["Splash", "Onboarding", "Chào mừng", "Khám phá", "Bản đồ", "Tìm kiếm", "Bộ lọc", "Bánh mì", "Chi tiết món", "Túi bất ngờ", "Chọn giờ", "Vé nhận", "Mã nhận", "Tủ thực phẩm", "Tài khoản", "Tác động"]
    cols, pw = 8, 78
    gx = (W - 2 * M - cols * pw) / (cols - 1)
    for i, (code, nm) in enumerate(zip(codes, names)):
        x = M + (i % cols) * (pw + gx)
        y = 270 if i < cols else 64
        phone(c, FIG / f"SB-{code}.png", x, y, pw, f"SB-{code}", nm)
    _ = n


@page
def p_read_pipeline(c, n):
    frame(c, n, "Phần 2 · Claude Code đọc Figma", "Từ frame tới code — ví dụ SB-100")
    steps = [
        ("get_metadata", "toạ độ, kích thước từng lớp"),
        ("get_design_context", "sau skill figma-design-to-code"),
        ("get_screenshot", f"lưu assets/figma-reference ({S['figma_png']} ảnh)"),
        ("Dựng bằng token", "component dùng chung, không hard-code"),
        ("Kiểm tra", "tsc · eslint · jest · bundle iOS"),
    ]
    y = H - 112
    for i, (t, b) in enumerate(steps):
        rrect(c, M, y - 46, 300, 46, 10, fill=ACCENT if i == 0 else PANEL)
        text(c, f"{i + 1}", M + 14, y - 28, 13, SAGE if i == 0 else SECOND, "BVP-XBold")
        text(c, t, M + 36, y - 20, 11, WHITE if i == 0 else TEXT, "Mono" if i < 3 else "BVP-Bold")
        text(c, b, M + 36, y - 36, 8.5, SAGE if i == 0 else MUTED)
        if i < len(steps) - 1:
            arrow(c, M + 150, y - 47, M + 150, y - 55, ACCENT, 1.2, 4)
        y -= 56
    phone(c, FIG / "SB-100.png", M + 330, 72, 172, "SB-100 · Figma", "node 461:4966")
    src = (ROOT / "app" / "account" / "impact.tsx").read_text(encoding="utf-8").splitlines()
    start = next(i for i, l in enumerate(src) if "figma 461:4966" in l)
    snippet = src[start : start + 9]
    cx = M + 530
    rrect(c, cx, 92, W - M - cx, 352, 14, fill=HexColor("#0E2A25"))
    text(c, "app/account/impact.tsx", cx + 16, 422, 9, SAGE, "BVP-Semi")
    yy = 398
    for line in snippet:
        indent = " " * max(len(line) - len(line.lstrip()) - 2, 0)
        for chunk in textwrap.wrap(line.strip(), 62, initial_indent=indent, subsequent_indent=indent + "   ") or [""]:
            text(c, chunk, cx + 16, yy, 8.2, HexColor("#E8F1EC") if "//" not in chunk else HexColor("#F1D8AF"), "Mono")
            yy -= 13
    para(c, "Comment ghi node Figma + số đo; style trong code khớp đúng các số đó (hero 164, mascot 100×100 tại 233,14).", cx + 16, yy - 8, W - M - cx - 32, 9.5, SAGE)


@page
def p_memory(c, n):
    frame(c, n, "Phần 2 · Bộ nhớ dự án", "CLAUDE.md + docs = trí nhớ giữa các phiên")
    docs = [
        ("CLAUDE.md", "luật cứng: Figma luôn đúng, Expo Go, token"),
        ("01 Inventory", f"{S['frames']} frame · route · trạng thái"),
        ("02 Tokens", f"khớp 1-1 với src/design-system ({S['colors']} màu)"),
        ("03 Component", "props, biến thể, trạng thái"),
        ("04 Navigation", "luồng đã nối + suy luận"),
        ("08 Checklist", "đối chiếu từng màn"),
        ("CHANGELOG", "làm tới đâu, chưa kiểm gì"),
    ]
    y = H - 112
    text(c, f"{S['docs']} file trong docs/", M, y, 10, SECOND, "BVP-Bold")
    y -= 10
    for t, b in docs:
        rrect(c, M, y - 36, 290, 32, 8, fill=PANEL)
        text(c, t, M + 12, y - 24, 10, ACCENT, "BVP-Bold")
        text(c, b, M + 106, y - 24, 8.5, TEXT)
        y -= 38
    # folder tree
    tx = M + 320
    tree = [
        ("app/", 0, "route = màn"), ("(entry)/ (tabs)/", 1, "đăng nhập · 4 tab"), ("discover/ offer/", 1, "khám phá · món"),
        ("reserve/ account/", 1, "giữ chỗ · tài khoản"), ("src/", 0, ""), ("components/ui", 1, f"{S['ui']} file"),
        ("components/features", 1, f"{S['features']} file"), ("design-system/tokens", 1, "màu · chữ · bóng"),
        ("services → data/repositories", 1, "delay 200–500 ms"), ("store/", 1, f"{S['stores']} store zustand"),
    ]
    text(c, "Cấu trúc thư mục", tx, H - 112, 10, SECOND, "BVP-Bold")
    yy = H - 136
    for name, lvl, note in tree:
        text(c, ("└ " if lvl else "") + name, tx + lvl * 14, yy, 9.5, TEXT, "Mono")
        if note:
            text(c, note, tx + 196, yy, 8.5, MUTED)
        yy -= 22
    # DoD checklist
    dx = M + 600
    rrect(c, dx, 60, W - M - dx, H - 160, 14, fill=SAGE)
    text(c, "Xong một màn khi…", dx + 16, H - 128, 12, ACCENT, "BVP-Bold")
    items = ["Có get_design_context + ảnh Figma", "Dựng bằng component + token", "Đủ trạng thái trong Figma", "Điều hướng đúng prototype", "tsc + lint sạch", "Cập nhật inventory, checklist, changelog"]
    yy = H - 156
    for it in items:
        rrect(c, dx + 16, yy - 3, 12, 12, 3, stroke=ACCENT, sw=1.2)
        c.setStrokeColor(ACCENT)
        c.setLineWidth(1.6)
        c.line(dx + 19, yy + 3, dx + 21.5, yy)
        c.line(dx + 21.5, yy, dx + 26, yy + 7)
        para(c, it, dx + 36, yy + 11, W - M - dx - 52, 9.5)
        yy -= 40


@page
def p_timeline(c, n):
    frame(c, n, "Phần 2 · Tiến độ & lỗi thật", f"{len(S['commits'])} commit trong git log")
    cm = S["commits"]
    t = [datetime.strptime(x["date"], "%Y-%m-%d %H:%M") for x in cm]
    t0, t1 = t[0], t[-1]
    x0, x1, ya = M + 10, W - M - 10, H - 176
    c.setStrokeColor(BORDER)
    c.setLineWidth(2)
    c.line(x0, ya, x1, ya)
    span = (t1 - t0).total_seconds()

    def kind(msg):
        return "revert" if msg.lower().startswith(("revert", '"revert')) or msg.startswith("Revert") else msg.split(":")[0].split("(")[0]

    col = {"feat": ACCENT, "fix": SECOND, "revert": MUTED}
    for x_, m in zip(t, cm):
        px = x0 + (x_ - t0).total_seconds() / span * (x1 - x0)
        c.setFillColor(col.get(kind(m["msg"]), HexColor("#2D7055")))
        c.circle(px, ya, 4.2, stroke=0, fill=1)
    marks = (("Khởi tạo", 0, 0), ("Scaffold + vòng 1–3", 3, 0), ("Nhóm 04", 4, 1), ("Bản đồ thật", 10, 0), ("Glass, rồi hoàn tác", 15, 1), ("Rà soát 100 màn", len(cm) - 1, 0))
    for lbl, idx, lvl in marks:
        px = x0 + (t[idx] - t0).total_seconds() / span * (x1 - x0)
        top = ya + 14 + lvl * 20
        c.setStrokeColor(BORDER)
        c.setLineWidth(0.8)
        c.line(px, ya + 6, px, top - 3)
        text(c, lbl, px, top, 8.5, TEXT, "BVP-Semi", "c" if 0 < idx < len(cm) - 1 else ("l" if idx == 0 else "r"))
    text(c, t0.strftime("%d/%m %H:%M"), x0, ya - 18, 8, MUTED)
    text(c, t1.strftime("%d/%m %H:%M"), x1, ya - 18, 8, MUTED, anchor="r")
    lx = M
    for k_, lbl in (("feat", "tính năng"), ("fix", "sửa lỗi"), ("revert", "hoàn tác")):
        c.setFillColor(col[k_])
        c.circle(lx + 4, ya - 39, 3.5, stroke=0, fill=1)
        text(c, lbl, lx + 12, ya - 42, 8.5, MUTED)
        lx += 80
    text(c, "Giờ commit không phải thời gian làm thật (3 commit cùng lúc 22:52). Tổng thời gian: [CẦN BỔ SUNG]", W - M, ya - 42, 8.5, SECOND, anchor="r")
    errs = [
        ("“No edit access”", "Gõ nhầm fileKey: <font name='Mono'>l</font> (L thường) thay vì <font name='Mono'>I</font> (i hoa) ở cuối key. Sửa key → MCP đọc được file."),
        ("Bấm Bánh mì chỉ reload", "Đoán sai lần 1 (tham số key). Gốc thật: SDK 58 không cho điều hướng tới tab ẩn → chuyển thành màn stack."),
        ("Nhận nhầm font", "Lúc đầu kết luận tiêu đề không dùng serif. Đối chiếu lại: SB-002/003/004/007 dùng Fraunces Bold → thêm font."),
    ]
    cw = (W - 2 * M - 32) / 3
    for i, (tt, b) in enumerate(errs):
        card(c, M + i * (cw + 16), 300, cw, 140, tt, b, fill=PANEL, title_color=SECOND, size=11.5)
    rrect(c, M, 62, W - 2 * M, 80, 12, fill=SAGE)
    text(c, "Cách kiểm thử", M + 18, 118, 12, ACCENT, "BVP-Bold")
    para(c, "Quét QR bằng Expo Go trên iPhone · dev hub để nhảy tới trạng thái (giữ splash 1,2 s, chạm 5 lần tiêu đề Tài khoản, <font name='Mono' size='9.5'>savebite://dev</font>) · chụp màn hình so với assets/figma-reference · mỗi đợt: tsc, eslint, jest, expo-doctor, bundle iOS.", M + 18, 110, W - 2 * M - 36, 10.5)
    text(c, "Nguồn: docs/CHANGELOG.md, docs/07-ARCHITECTURE.md, commit cd744a8 · 8b84e37", M, 46, 8, MUTED)


def compare_page(c, n, kicker, title, pairs, note):
    frame(c, n, kicker, title)
    pw = 128
    group_w = 2 * pw + 14
    gap = (W - 2 * M - len(pairs) * group_w) / max(len(pairs) - 1, 1)
    for i, (code, label, shot) in enumerate(pairs):
        gx = M + i * (group_w + gap)
        y = 84
        phone(c, FIG / f"SB-{code}.png", gx, y, pw, "Figma", f"SB-{code}")
        phone(c, SHOTS / shot if shot else None, gx + pw + 14, y, pw, "iPhone", "Expo Go" if shot else "chưa có ảnh")
        text(c, label, gx + group_w / 2, y + pw * 852 / 393 + 10, 10.5, ACCENT, "BVP-Bold", "c")
    para(c, note, M, H - 100, W - 2 * M, 10.5, MUTED)


@page
def p_compare1(c, n):
    compare_page(c, n, "So sánh Figma và iPhone", "Khám phá, bản đồ, danh mục",
                 [("015", "Khám phá", "IMG_8644.PNG"), ("016", "Bản đồ", "IMG_8642.PNG"), ("029", "Bánh mì & pastry", "IMG_8643.PNG")],
                 "Ảnh iPhone chụp thật trong Expo Go. Nút bánh răng xanh bên phải không thuộc app (lớp công cụ khi chạy bản dev). SB-016: Figma là ảnh bản đồ, app dùng Apple Maps thật.")


@page
def p_compare2(c, n):
    compare_page(c, n, "So sánh Figma và iPhone", "Bộ lọc, tủ thực phẩm, vé nhận",
                 [("023", "Bộ lọc tổng hợp", "IMG_8645.PNG"), ("081", "Chi tiết thực phẩm", "IMG_8646.PNG"), ("056", "Vé nhận món", None)],
                 "SB-081 trên iPhone hiển thị món người dùng tự nhập khi demo, nên chữ khác Figma. Khung trống: cần chụp thêm từ iPhone.")


@page
def p_ux(c, n):
    frame(c, n, "Nâng cấp trải nghiệm", "Thật hay xấp xỉ — ghi rõ")
    cols = [
        ("Bản đồ thật", f"Apple Maps qua react-native-maps {S['v']['react-native-maps']} cho 7 frame có bản đồ (SB-003, 011, 016/017, 032, 039, 065, 094). Ghim giá, gom cụm, sheet 3 nấc."),
        ("Liquid Glass", "GlassSurface: GlassView trên iOS 26, BlurView ở bản cũ hơn. Tab bar “thấu kính” đã thử rồi hoàn tác theo yêu cầu (52e5ecb → acf8457)."),
        ("Chuyển động", f"Mọi giá trị lấy từ motion.ts, spring khi nhấn, tôn trọng Reduce Motion. Reanimated {S['v']['react-native-reanimated']} chạy trên UI thread."),
    ]
    cw = (W - 2 * M - 32) / 3
    for i, (t, b) in enumerate(cols):
        card(c, M + i * (cw + 16), H - 108, cw, 170, t, b, size=12)
    rows = [
        ("Thật", "Apple Maps, phóng to/kéo, mở chỉ đường · haptic · spring · lưu dữ liệu trên máy"),
        ("Xấp xỉ", "Kính trên iOS < 26 · toạ độ cửa hàng và chấm vị trí là dữ liệu demo · thanh toán, QR, thông báo là mock"),
    ]
    y = 230
    for i, (k, v) in enumerate(rows):
        rrect(c, M, y - 50, W - 2 * M, 50, 12, fill=SAGE if i == 0 else PANEL)
        text(c, k, M + 18, y - 30, 13, ACCENT if i == 0 else SECOND, "BVP-Bold")
        para(c, v, M + 110, y - 17, W - 2 * M - 130, 10.5)
        y -= 62
    text(c, "Nguồn: docs/11-MOTION-SPEC.md, docs/12-MAP-AUDIT.md, docs/07-ARCHITECTURE.md", M, 80, 8, MUTED)


@page
def p_results(c, n):
    frame(c, n, "Kết quả & bài học", "Đã làm được gì")
    stats = [
        (f"{S['done']}/{S['frames']}", "frame đã dựng (inventory)"),
        (str(S["routes"]), "file route trong app/"),
        (str(S["ui"] + S["features"]), "file component dùng chung"),
        (f"{S['loc']:,}".replace(",", "."), f"dòng TS/TSX · {S['code_files']} file"),
        (str(len(S["commits"])), "commit"),
        (str(S["tests"]), f"test · {S['test_files']} file"),
    ]
    sw = (W - 2 * M - 5 * 12) / 6
    for i, (v, l) in enumerate(stats):
        x = M + i * (sw + 12)
        rrect(c, x, H - 176, sw, 70, 12, fill=PANEL)
        text(c, v, x + 12, H - 140, 20, ACCENT, "BVP-XBold")
        para(c, l, x + 12, H - 148, sw - 20, 8.5, MUTED)
    card(c, M, H - 192, 420, 150, "Giới hạn",
         "MCP không đọc được dây prototype → luồng phải suy luận. Hiệu ứng native (kính) khó làm giống. "
         "AI vẫn sai: chính người dùng phát hiện lỗi Bánh mì, SB-078, SB-092 khi thử trên iPhone → <b>luôn cần người duyệt</b>.", fill=PANEL, size=11.5)
    card(c, M + 436, H - 192, W - 2 * M - 436, 150, "Hướng tiếp",
         "Backend thật thay dữ liệu mock · quyền vị trí thật · bản build production qua EAS · kiểm thử với người dùng thật.", fill=SAGE, size=12)
    loop_diagram(c, M, 92, W - 2 * M, compact=True)


def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT), pagesize=(W, H))
    c.setTitle("SaveBite — Claude Code × Figma MCP: từ thiết kế tới iPhone")
    c.setAuthor("[Họ tên - MSSV]")
    c.setSubject("Báo cáo quy trình môn Thiết kế UI/UX")
    for i, fn in enumerate(PAGES, 1):
        fn(c, i)
        c.showPage()
    c.save()
    print(f"{OUT.relative_to(ROOT)} · {len(PAGES)} trang")
    print({k: S[k] for k in ("frames", "kinds", "done", "routes", "ui", "features", "code_files", "loc", "tests", "docs", "colors", "color_literals")}, len(S["commits"]), "commits")


if __name__ == "__main__":
    build()
