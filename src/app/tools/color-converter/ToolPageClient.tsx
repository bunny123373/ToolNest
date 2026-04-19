'use client';

import { useState, useCallback, ChangeEvent } from 'react';

interface ColorValues {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max !== min) {
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

function parseRgb(rgb: string): { r: number; g: number; b: number } | null {
  const match = rgb.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
    };
  }
  return null;
}

function parseHsl(hsl: string): { h: number; s: number; l: number } | null {
  const match = hsl.match(/hsl\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/i);
  if (match) {
    return {
      h: parseInt(match[1]),
      s: parseInt(match[2]),
      l: parseInt(match[3]),
    };
  }
  return null;
}

export default function ToolPageClient() {
  const [colorInput, setColorInput] = useState('#6366f1');
  const [colorValues, setColorValues] = useState<ColorValues>({
    hex: '#6366f1',
    rgb: { r: 99, g: 102, b: 241 },
    hsl: { h: 239, s: 84, l: 67 },
    hsv: { h: 239, s: 59, v: 95 },
  });
  const [error, setError] = useState('');

  const updateColor = useCallback((input: string) => {
    setColorInput(input);
    setError('');

    let rgb: { r: number; g: number; b: number } | null = null;

    if (input.startsWith('#') || /^[a-f0-9]{6}$/i.test(input)) {
      rgb = hexToRgb(input.startsWith('#') ? input : '#' + input);
    } else if (input.startsWith('rgb')) {
      rgb = parseRgb(input);
    } else if (input.startsWith('hsl')) {
      const hsl = parseHsl(input);
      if (hsl) {
        const h = hsl.h / 360;
        const s = hsl.s / 100;
        const l = hsl.l / 100;
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        const r = hueToRgb(p, q, h + 1 / 3);
        const g = hueToRgb(p, q, h);
        const b = hueToRgb(p, q, h - 1 / 3);
        rgb = { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
      }
    } else if (/^[a-f0-9]{3}$/i.test(input)) {
      rgb = hexToRgb('#' + input[0] + input[0] + input[1] + input[1] + input[2] + input[2]);
    }

    if (rgb && rgb.r >= 0 && rgb.r <= 255 && rgb.g >= 0 && rgb.g <= 255 && rgb.b >= 0 && rgb.b <= 255) {
      setColorValues({
        hex: rgbToHex(rgb.r, rgb.g, rgb.b),
        rgb,
        hsl: rgbToHsl(rgb.r, rgb.g, rgb.b),
        hsv: rgbToHsv(rgb.r, rgb.g, rgb.b),
      });
    } else if (input.trim()) {
      setError('Invalid color format');
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateColor(e.target.value);
  };

  const copyValue = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      alert('Failed to copy');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">🎨</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Color Converter</h1>
          <p className="text-text-secondary">Convert between HEX, RGB, HSL, and HSV</p>
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div
              className="w-32 h-32 rounded-2xl border-4 border-border shadow-lg flex-shrink-0"
              style={{ backgroundColor: colorValues.hex }}
            />
            <div className="flex-1 w-full">
              <label className="text-text-primary font-medium mb-2 block">Enter Color</label>
              <input
                type="text"
                value={colorInput}
                onChange={handleInputChange}
                placeholder="#6366f1 or rgb(99,102,241)"
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
              />
              <p className="text-text-secondary text-sm mt-2">
                Supports HEX, RGB, and HSL formats
              </p>
            </div>
          </div>
          {error && <p className="mt-4 text-error text-sm">{error}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-surface-elevated border border-border rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-secondary text-sm">HEX</span>
              <button
                onClick={() => copyValue(colorValues.hex)}
                className="text-text-secondary hover:text-primary text-sm"
              >
                Copy
              </button>
            </div>
            <p className="text-text-primary font-mono text-lg">{colorValues.hex}</p>
          </div>

          <div className="bg-surface-elevated border border-border rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-secondary text-sm">RGB</span>
              <button
                onClick={() => copyValue(`rgb(${colorValues.rgb.r}, ${colorValues.rgb.g}, ${colorValues.rgb.b})`)}
                className="text-text-secondary hover:text-primary text-sm"
              >
                Copy
              </button>
            </div>
            <p className="text-text-primary font-mono text-lg">
              rgb({colorValues.rgb.r}, {colorValues.rgb.g}, {colorValues.rgb.b})
            </p>
          </div>

          <div className="bg-surface-elevated border border-border rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-secondary text-sm">HSL</span>
              <button
                onClick={() => copyValue(`hsl(${colorValues.hsl.h}, ${colorValues.hsl.s}%, ${colorValues.hsl.l}%)`)}
                className="text-text-secondary hover:text-primary text-sm"
              >
                Copy
              </button>
            </div>
            <p className="text-text-primary font-mono text-lg">
              hsl({colorValues.hsl.h}, {colorValues.hsl.s}%, {colorValues.hsl.l}%)
            </p>
          </div>

          <div className="bg-surface-elevated border border-border rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-secondary text-sm">HSV</span>
              <button
                onClick={() => copyValue(`hsv(${colorValues.hsv.h}, ${colorValues.hsv.s}%, ${colorValues.hsv.v}%)`)}
                className="text-text-secondary hover:text-primary text-sm"
              >
                Copy
              </button>
            </div>
            <p className="text-text-primary font-mono text-lg">
              hsv({colorValues.hsv.h}, {colorValues.hsv.s}%, {colorValues.hsv.v}%)
            </p>
          </div>
        </div>

        <div className="p-4 bg-surface-elevated border border-border rounded-xl">
          <p className="text-text-secondary text-sm">
            Click on any color format to copy it to your clipboard.
          </p>
        </div>
      </div>
    </div>
  );
}

function hueToRgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}