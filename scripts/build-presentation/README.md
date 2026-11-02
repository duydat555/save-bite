# build-presentation

Tạo `docs/presentation/SaveBite_ClaudeCode_Figma_to_Code.pdf` (13 trang 16:9, tiếng Việt) cho môn Thiết kế UI/UX.

```bash
pip install reportlab pillow     # một lần
npm install                      # cần node_modules/@expo-google-fonts để nhúng font
python scripts/build-presentation/build.py   # chạy từ thư mục gốc repo
```

- Mọi con số (số frame theo nhóm/loại, route, component, dòng code, commit, test) được **đếm lại lúc chạy** từ `docs/01-FIGMA-INVENTORY.md`, `app/`, `src/`, `__tests__/` và `git log` — không gõ tay.
- Ảnh: `assets/figma-reference/SB-xxx.png` (Figma) và `assets/app-screenshots/IMG_*.PNG` (chụp thật trên iPhone). Khung "[Chèn ảnh chụp từ iPhone]" là chỗ còn thiếu ảnh thật — thêm ảnh vào `assets/app-screenshots/` rồi sửa `p_compare2` trong `build.py`.
- Chỗ ghi `[CẦN BỔ SUNG]` là thông tin không có trong repo (prompt tạo Figma, tổng thời gian…), cần người làm dự án điền.
- Font nhúng: Be Vietnam Pro, Fraunces Bold, JetBrains Mono (TTF trong `node_modules/@expo-google-fonts`).
- Xem trước từng trang: `pip install pypdfium2`, rồi render bằng `pdfium.PdfDocument(path)[i].render(scale=1.5).to_pil()`.
