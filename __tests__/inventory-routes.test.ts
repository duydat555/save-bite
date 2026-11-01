import fs from 'fs';
import path from 'path';

// Guards the "100 screens" claim: every SB frame in docs/01-FIGMA-INVENTORY.md that is a `screen` or `sheet` must have a
// route file under app/, and none may still be `todo`. `state` frames are variants of another route (not checked here).
const ROOT = path.join(__dirname, '..');
const md = fs.readFileSync(path.join(ROOT, 'docs', '01-FIGMA-INVENTORY.md'), 'utf8');

type Row = { code: string; kind: string; route: string; status: string };
const rows: Row[] = md
  .split('\n')
  .map((l) =>
    l.match(
      /^\|\s*(SB-\d+)\s*\|[^|]*\|\s*(\w+)\s*\|\s*`([^`]+)`\s*\|[^|]*\|\s*(\w[\w-]*)\s*\|\s*$/,
    ),
  )
  .filter((m): m is RegExpMatchArray => !!m)
  .map((m) => ({ code: m[1], kind: m[2], route: m[3], status: m[4] }));

function routeExists(route: string): boolean {
  const clean = route.split(' ')[0].split('?')[0].replace(/\/$/, '');
  const rel = clean.replace(/^\//, '') || 'index';
  const candidates = [
    `app/${rel}.tsx`,
    `app/${rel}/index.tsx`,
    `app/(tabs)/${rel}.tsx`,
    `app/(entry)/${rel}.tsx`,
    `app/${rel.replace(/^\(tabs\)\//, '(tabs)/')}.tsx`,
  ];
  return candidates.some((c) => fs.existsSync(path.join(ROOT, c)));
}

describe('inventory ↔ routes', () => {
  it('lists all 100 frames', () => {
    expect(rows).toHaveLength(100);
  });
  it('has no frame left as todo', () => {
    expect(rows.filter((r) => r.status === 'todo').map((r) => r.code)).toEqual([]);
  });
  it('every screen / sheet frame has a route file', () => {
    const missing = rows
      .filter((r) => r.kind !== 'state' && !routeExists(r.route))
      .map((r) => `${r.code} ${r.route}`);
    expect(missing).toEqual([]);
  });
});
