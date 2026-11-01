import fs from 'fs';
import path from 'path';

// Every map in the app is the real AppMap (src/components/features/MapView). This fails if a static map image comes back.
const ROOT = path.join(__dirname, '..');
const BANNED = /(campus-map|map-canvas|radius-1000|static-?map|MapCanvas|map-preview)/i;

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

describe('no static map images', () => {
  it('app/ and src/ do not reference static map assets', () => {
    const offenders = [...walk(path.join(ROOT, 'app')), ...walk(path.join(ROOT, 'src'))]
      .filter((f) => /\.(tsx?|jsx?)$/.test(f))
      .filter((f) => BANNED.test(fs.readFileSync(f, 'utf8')))
      .map((f) => path.relative(ROOT, f));
    expect(offenders).toEqual([]);
  });

  it('no static map image files remain in assets/images', () => {
    const imgs = walk(path.join(ROOT, 'assets', 'images')).map((f) => path.basename(f));
    expect(imgs.filter((n) => BANNED.test(n))).toEqual([]);
  });
});
