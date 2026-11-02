# build-presentation

Tạo `docs/presentation/SaveBite_ClaudeCode_Figma_to_Code.pdf` (13 trang 16:9, tiếng Việt) cho môn Thiết kế UI/UX.

```bash
pip install reportlab pillow     # một lần
npm install                      # cần node_modules/@expo-google-fonts để nhúng font
python scripts/build-presentation/build.py   # chạy từ thư mục gốc repo
```

- Số liệu dự án (frame theo nhóm/loại, route, component, dòng code, token, commit, test, các đợt trong CHANGELOG) được **đếm lại mỗi lần chạy** từ `docs/`, `app/`, `src/`, `__tests__/` và `git log`.
- Bảng "Thuộc tính · Figma · Code" lấy giá trị Figma từ `docs/02-DESIGN-TOKENS.md` và comment `// figma <node>`, giá trị code từ token/style thật; script in bảng này ra terminal để đối chiếu.
- Ảnh: `assets/figma-reference/SB-xxx.png` (frame Figma) và `assets/app-screenshots/IMG_*.PNG` (chụp thật trên iPhone, Expo Go).
- Thông tin bìa (đề tài, nhóm, giảng viên) ở đầu `build.py`; ngày lấy theo đồng hồ hệ thống lúc chạy.
- Font nhúng: Be Vietnam Pro, Fraunces Bold, JetBrains Mono (TTF trong `node_modules/@expo-google-fonts`).
- Xem trước từng trang: `pip install pypdfium2`, rồi render bằng `pdfium.PdfDocument(path)[i].render(scale=1.5).to_pil()`.
