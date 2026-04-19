'use client';

import { useState } from 'react';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'data';

interface UnitDefinition {
  label: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

const units: Record<UnitCategory, Record<string, UnitDefinition>> = {
  length: {
    Meter: { label: 'Meter (m)', toBase: (v) => v, fromBase: (v) => v },
    Kilometer: { label: 'Kilometer (km)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    Centimeter: { label: 'Centimeter (cm)', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    Millimeter: { label: 'Millimeter (mm)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    Mile: { label: 'Mile (mi)', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    Yard: { label: 'Yard (yd)', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    Foot: { label: 'Foot (ft)', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    Inch: { label: 'Inch (in)', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
  },
  weight: {
    Kilogram: { label: 'Kilogram (kg)', toBase: (v) => v, fromBase: (v) => v },
    Gram: { label: 'Gram (g)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    Milligram: { label: 'Milligram (mg)', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
    Pound: { label: 'Pound (lb)', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    Ounce: { label: 'Ounce (oz)', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    Ton: { label: 'Metric Ton (t)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  },
  temperature: {
    Celsius: { label: 'Celsius (°C)', toBase: (v) => v, fromBase: (v) => v },
    Fahrenheit: { label: 'Fahrenheit (°F)', toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
    Kelvin: { label: 'Kelvin (K)', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  },
  data: {
    Byte: { label: 'Byte (B)', toBase: (v) => v, fromBase: (v) => v },
    Kilobyte: { label: 'Kilobyte (KB)', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
    Megabyte: { label: 'Megabyte (MB)', toBase: (v) => v * 1024 * 1024, fromBase: (v) => v / (1024 * 1024) },
    Gigabyte: { label: 'Gigabyte (GB)', toBase: (v) => v * 1024 * 1024 * 1024, fromBase: (v) => v / (1024 * 1024 * 1024) },
    Terabyte: { label: 'Terabyte (TB)', toBase: (v) => v * 1024 * 1024 * 1024 * 1024, fromBase: (v) => v / (1024 * 1024 * 1024 * 1024) },
  },
};

export default function ToolPageClient() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('Meter');
  const [toUnit, setToUnit] = useState('Kilometer');
  const [result, setResult] = useState<number | null>(null);

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult(null);
      return;
    }

    const unitDef = units[category];
    const baseValue = unitDef[fromUnit].toBase(value);
    const converted = unitDef[toUnit].fromBase(baseValue);
    setResult(converted);
  };

  const handleCategoryChange = (newCategory: UnitCategory) => {
    setCategory(newCategory);
    setFromUnit(Object.keys(units[newCategory])[0]);
    setToUnit(Object.keys(units[newCategory])[1] || Object.keys(units[newCategory])[0]);
    setResult(null);
  };

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    handleConvert();
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">⚖️</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Unit Converter</h1>
          <p className="text-text-secondary">Convert between different units of measurement</p>
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {(['length', 'weight', 'temperature', 'data'] as UnitCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                  category === cat
                    ? 'bg-primary text-white'
                    : 'bg-background text-text-secondary hover:bg-primary/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">From</label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary mb-3"
              >
                {Object.entries(units[category]).map(([key, def]) => (
                  <option key={key} value={key}>{def.label}</option>
                ))}
              </select>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value..."
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">To</label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary mb-3"
              >
                {Object.entries(units[category]).map(([key, def]) => (
                  <option key={key} value={key}>{def.label}</option>
                ))}
              </select>
              <div className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary min-h-[51px] flex items-center">
                {result !== null ? result.toLocaleString(undefined, { maximumFractionDigits: 10 }) : '—'}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSwap}
              className="px-6 py-3 bg-surface border border-border hover:border-primary/50 rounded-xl text-text-secondary hover:text-primary transition-all"
            >
              Swap
            </button>
            <button
              onClick={handleConvert}
              className="flex-1 px-8 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all hover:shadow-glow"
            >
              Convert
            </button>
          </div>
        </div>

        {result !== null && (
          <div className="bg-surface-elevated border border-border rounded-2xl p-6 text-center">
            <p className="text-text-secondary mb-2">
              {inputValue} {fromUnit} =
            </p>
            <p className="text-3xl font-bold text-primary">
              {result.toLocaleString(undefined, { maximumFractionDigits: 10 })} {toUnit}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
