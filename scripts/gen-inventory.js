// Regenerates docs/01-FIGMA-INVENTORY.md from scripts/figma-frames.json.
// The "Trạng thái" column is preserved from the existing file (edit statuses by hand).
// Usage: node scripts/gen-inventory.js
const fs = require('fs');
const path = require('path');

const frames = require('./figma-frames.json');
const OUT = path.join(__dirname, '..', 'docs', '01-FIGMA-INVENTORY.md');

const GROUPS = {
  '01': '01 · Entry & Discovery',
  '02': '02 · Offer & Merchant',
  '03': '03 · Reserve & Orders',
  '04': '04 · Pantry & Account',
};

// kind: screen = own route · state = variant of another screen · sheet = bottom sheet / modal
const R = {
  1: ['/', 'screen'],
  2: ['/(entry)/onboarding (page 1)', 'screen'],
  3: ['/(entry)/onboarding (page 2)', 'screen'],
  4: ['/(entry)/onboarding (page 3)', 'screen'],
  5: ['/(entry)/welcome', 'screen'],
  6: ['/(entry)/register', 'screen'],
  7: ['/(entry)/verify-email', 'screen'],
  8: ['/(entry)/login', 'screen'],
  9: ['/(entry)/forgot-password', 'screen'],
  10: ['/(entry)/forgot-password-sent', 'screen'],
  11: ['/(entry)/permission-location', 'screen'],
  12: ['/(entry)/permission-notifications', 'screen'],
  13: ['/(tabs)/index (guest)', 'state'],
  14: ['/(tabs)/index (active order)', 'state'],
  15: ['/(tabs)/index', 'screen'],
  16: ['/discover/map', 'screen'],
  17: ['/discover/map (peek sheet)', 'sheet'],
  18: ['/discover/area', 'screen'],
  19: ['/discover/search', 'screen'],
  20: ['/discover/search (suggestions)', 'state'],
  21: ['/discover/results', 'screen'],
  22: ['/discover/results (no results)', 'state'],
  23: ['/discover/filters', 'sheet'],
  24: ['/discover/filter-budget', 'sheet'],
  25: ['/discover/filter-slots', 'sheet'],
  26: ['/discover/filter-dietary', 'sheet'],
  27: ['/discover/sort', 'sheet'],
  28: ['/discover/category?cat=meal', 'screen'],
  29: ['/discover/category?cat=bakery', 'screen'],
  30: ['/discover/category?cat=produce', 'screen'],
  31: ['/discover/urgent', 'screen'],
  32: ['/discover/nearby', 'screen'],
  33: ['/discover/saved', 'screen'],
  34: ['/offer/[id]', 'screen'],
  35: ['/offer/[id]/gallery', 'screen'],
  36: ['/offer/[id]/allergens', 'sheet'],
  37: ['/offer/[id]/shelf-life', 'sheet'],
  38: ['/offer/merchant/[id]', 'screen'],
  39: ['/offer/merchant/[id]/directions', 'screen'],
  40: ['/offer/handover-rules', 'sheet'],
  41: ['/offer/merchant/[id]/offers', 'screen'],
  42: ['/offer/merchant/[id]/reviews', 'screen'],
  43: ['/offer/merchant/[id]/review-report', 'screen'],
  44: ['/offer/surprise-bag', 'screen'],
  45: ['/offer/surprise-bag (explainer)', 'sheet'],
  46: ['/offer/[id] (sold out)', 'state'],
  47: ['/offer/[id] (window closed)', 'state'],
  48: ['/offer/[id] (closing soon)', 'state'],
  49: ['/offer/[id]/allergen-conflict', 'screen'],
  50: ['/reserve/[offerId] (quantity)', 'sheet'],
  51: ['/reserve/[offerId]', 'screen'],
  52: ['/reserve/[offerId]/checklist', 'screen'],
  53: ['/reserve/summary', 'screen'],
  54: ['/reserve/confirm', 'sheet'],
  55: ['/reserve/summary (processing)', 'state'],
  56: ['/reserve/success', 'screen'],
  57: ['/reserve/failed', 'screen'],
  58: ['/reserve/stock-changed', 'screen'],
  59: ['/offer/login-required', 'sheet'],
  60: ['/(tabs)/orders', 'screen'],
  61: ['/(tabs)/orders (Đang chờ nhận)', 'state'],
  62: ['/reserve/order/[id]', 'screen'],
  63: ['/reserve/order/[id]/pass', 'screen'],
  64: ['/reserve/order/[id]/handover', 'screen'],
  65: ['/reserve/order/[id]/directions', 'screen'],
  66: ['/reserve/order/[id] (ready)', 'state'],
  67: ['/reserve/order/[id] (closing soon)', 'state'],
  68: ['/reserve/order/[id] (expired)', 'state'],
  69: ['/reserve/order/[id]/incident', 'screen'],
  70: ['/reserve/order/[id]/cancel', 'sheet'],
  71: ['/reserve/order/[id]/cancelled', 'screen'],
  72: ['/reserve/order/[id] (completed)', 'state'],
  73: ['/(tabs)/orders (empty)', 'state'],
  74: ['/account/pantry/intro', 'screen'],
  75: ['/(tabs)/pantry', 'screen'],
  76: ['/(tabs)/pantry (empty)', 'state'],
  77: ['/account/pantry/add', 'screen'],
  78: ['/account/pantry/add/category', 'sheet'],
  79: ['/account/pantry/add/date', 'sheet'],
  80: ['/account/pantry/add/review', 'screen'],
  81: ['/account/pantry/[id]', 'screen'],
  82: ['/account/pantry/edit/[id]', 'screen'],
  83: ['/account/pantry/soon', 'screen'],
  84: ['/account/pantry/overdue', 'screen'],
  85: ['/account/pantry/reminder/[id]', 'screen'],
  86: ['/account/pantry/usage/[id]', 'screen'],
  87: ['/account/pantry/discard/[id]', 'screen'],
  88: ['/account/pantry/suggestions', 'screen'],
  89: ['/account/pantry/history', 'screen'],
  90: ['/account/pantry/data', 'screen'],
  91: ['/(tabs)/account', 'screen'],
  92: ['/account/edit', 'screen'],
  93: ['/account/areas', 'screen'],
  94: ['/account/areas/add', 'screen'],
  95: ['/account/notifications', 'screen'],
  96: ['/account/notifications (empty)', 'state'],
  97: ['/account/notification-settings', 'screen'],
  98: ['/account/privacy', 'screen'],
  99: ['/account/help', 'screen'],
  100: ['/account/impact', 'screen'],
};

// keep existing statuses (tolerates Prettier's padded table cells)
const status = {};
if (fs.existsSync(OUT)) {
  for (const line of fs.readFileSync(OUT, 'utf8').split('\n')) {
    const m = line.match(/^\| (SB-\d+)\s*\|.*\| (todo|in-progress|done|verified)\s*\|\s*$/);
    if (m) status[m[1]] = m[2];
  }
}

const FILE = 'https://www.figma.com/design/7suZz9C8oL5zV2NMxlsIVI/SaveBite-V2?node-id=';
const esc = (s) => s.replace(/\|/g, '\\|');
let md = `# 01 · Figma inventory

Nguồn: Figma \`7suZz9C8oL5zV2NMxlsIVI\` — page **App · All Screens** (\`11:3\`). **100 màn hình** (SB-001 → SB-100), tất cả 393×852.
File này sinh bởi \`node scripts/gen-inventory.js\` từ \`scripts/figma-frames.json\`; chỉ sửa cột *Trạng thái* bằng tay (script giữ nguyên).

- **screen** = route riêng · **state** = biến thể trạng thái của route khác (cùng component, đổi dữ liệu) · **sheet** = bottom sheet / modal
- Route là **đề xuất** (Expo Router). Trạng thái: \`todo / in-progress / done / verified\`. **done** = đã dựng + qua tsc/lint, chờ bạn kiểm tra trên iPhone; chuyển **verified** sau khi bạn duyệt.

`;
const count = { screen: 0, state: 0, sheet: 0 };
for (const g of Object.keys(GROUPS)) {
  const list = frames.filter((f) => f.group === g);
  md += `## ${GROUPS[g]} (${list.length})\n\n| Mã | Tên | Loại | Route đề xuất | Node | Trạng thái |\n|---|---|---|---|---|---|\n`;
  for (const f of list) {
    const n = parseInt(f.code.slice(3), 10);
    const [route, kind] = R[n];
    count[kind]++;
    md += `| ${f.code} | ${esc(f.title)} | ${kind} | \`${route}\` | [${f.nodeId}](${FILE}${f.node}) | ${status[f.code] || 'todo'} |\n`;
  }
  md += '\n';
}
md += `Tổng: ${count.screen} screen · ${count.state} state · ${count.sheet} sheet = ${count.screen + count.state + count.sheet}.\n`;
fs.writeFileSync(OUT, md);
console.log(count);
