'use client';

import { useState, useEffect } from 'react';

interface ColorShade {
  hex: string;
  name: string;
}

function hexToHsl(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generateShades(baseHex: string): ColorShade[] {
  const [h, s, l] = hexToHsl(baseHex);
  const shades: ColorShade[] = [];
  const lightnesses = [95, 80, 60, 50, 40, 30, 20, 10];
  const names = ['50', '100', '200', '300', '400', '500', '600', '700'];

  lightnesses.forEach((newL, i) => {
    shades.push({
      hex: hslToHex(h, s, newL),
      name: names[i],
    });
  });

  return shades;
}

function generateComplementary(baseHex: string): string[] {
  const [h, s, l] = hexToHsl(baseHex);
  return [
    baseHex,
    hslToHex((h + 180) % 360, s, l),
    hslToHex((h + 120) % 360, s, l),
    hslToHex((h + 240) % 360, s, l),
  ];
}

export default function ToolPageClient() {
  const [color, setColor] = useState('#6366f1');
  const [shades, setShades] = useState<ColorShade[]>([]);
  const [complementary, setComplementary] = useState<string[]>([]);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    setShades(generateShades(color));
    setComplementary(generateComplementary(color));
  }, [color]);

  const handleCopy = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">🎨</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Color Palette Generator</h1>
          <p className="text-text-secondary">Generate beautiful color palettes from any base color</p>
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
            <div>
              <label className="block text-sm text-text-secondary mb-2">Base Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-16 h-12 rounded-lg cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={color.toUpperCase()}
                  onChange={(e) => {
                    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                      setColor(e.target.value);
                    }
                  }}
                  className="px-4 py-3 bg-background border border-border rounded-xl text-text-primary font-mono uppercase w-32"
                />
              </div>
            </div>
          </div>

          <div className="h-24 rounded-xl mb-8" style={{ backgroundColor: color }}>
            <div className="h-full flex items-end justify-center pb-4">
              <span className="px-4 py-2 bg-black/50 text-white rounded-lg font-mono text-sm backdrop-blur-sm">
                {color.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Color Shades</h3>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {shades.map((shade) => (
              <button
                key={shade.name}
                onClick={() => handleCopy(shade.hex)}
                className="group relative aspect-square rounded-lg transition-transform hover:scale-110"
                style={{ backgroundColor: shade.hex }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-lg">
                  <span className="text-white text-xs font-mono">{shade.name}</span>
                  <span className="text-white text-xs font-mono">{shade.hex}</span>
                </div>
                {copied === shade.hex && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <span className="text-white text-xs">Copied!</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Complementary Colors</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {complementary.map((hex, index) => (
              <button
                key={index}
                onClick={() => handleCopy(hex)}
                className="group relative h-24 rounded-xl transition-transform hover:scale-105"
                style={{ backgroundColor: hex }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="px-3 py-1 bg-black/50 text-white rounded-lg font-mono text-sm backdrop-blur-sm">
                    {hex.toUpperCase()}
                  </span>
                </div>
                {copied === hex && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                    <span className="text-white text-sm">Copied!</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
