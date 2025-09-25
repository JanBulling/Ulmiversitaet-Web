export interface HsvColor {
  h: number;
  s: number;
  v: number;
}

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export function hsvToHex(color: HsvColor) {
  const { r, g, b } = hsvToRgb(color);
  return `#${formatHexPart(r)}${formatHexPart(g)}${formatHexPart(b)}`;
}

export function hsvToRgb({ h, s, v }: HsvColor): RgbColor {
  const _h = (h / 360) * 6;
  const _s = s / 100;
  const _v = v / 100;

  const hh = Math.floor(_h);
  const l = _v * (1 - _s);
  const c = _v * (1 - (_h - hh) * _s);
  const d = _v * (1 - (1 - _h + hh) * _s);
  const mod = hh % 6;

  return {
    r: round([_v, c, l, l, d, _v][mod] * 255),
    g: round([d, _v, _v, c, l, l][mod] * 255),
    b: round([l, l, d, _v, _v, c][mod] * 255),
  };
}

export function hexToHsv(hex: string): HsvColor | undefined {
  hex = hex.replace(/^#/, "");

  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    return undefined;
  }

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return rgbToHsv({ r, g, b });
}

export function rgbToHsv({ r, g, b }: RgbColor): HsvColor {
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);

  const hh = delta
    ? max === r
      ? (g - b) / delta
      : max === g
        ? 2 + (b - r) / delta
        : 4 + (r - g) / delta
    : 0;

  return {
    h: round(60 * (hh < 0 ? hh + 6 : hh), 3),
    s: round(max ? (delta / max) * 100 : 0, 3),
    v: round((max / 255) * 100, 3),
  };
}

function formatHexPart(number: number) {
  const hex = number.toString(16);
  return hex.length < 2 ? `0${hex}` : hex;
}

function round(number: number, digits = 0, base = 10 ** digits) {
  return Math.round(base * number) / base;
}
