import { useMemo } from 'react';
import { SvgXml } from 'react-native-svg';

import { svgData, type SvgName } from '@/design-system/icons/svg-data';

type Props = {
  name: SvgName;
  size: number;
  /** Recolours every hex colour in the file (keeps opacity). Used for icons on dark fills, e.g. selected tiles. */
  tint?: string;
};

/** Renders an SVG exported from Figma (see scripts/gen-svg.js). Colours are baked into the file unless `tint` is set. */
export function SvgIcon({ name, size, tint }: Props) {
  const xml = useMemo(
    () => (tint ? svgData[name].replace(/#[0-9A-Fa-f]{6}\b/g, tint) : svgData[name]),
    [name, tint],
  );
  return <SvgXml xml={xml} width={size} height={size} />;
}
