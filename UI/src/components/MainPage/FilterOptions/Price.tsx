// src/components/MainPage/FilterMenuComponents/PriceRange.tsx
import { useMemo, useState } from "react";

type Props = {
  title?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
  onChange?: (next: [number, number]) => void;
  className?: string;
};

export default function PriceRange({
  title = "Price",
  min = 0,
  max = 150,
  step = 1,
  value,
  onChange,
  className = "",
}: Props) {
  const [lo, setLo]   = useState(value?.[0] ?? min);
  const [hi, setHi]   = useState(value?.[1] ?? max);

  const low  = value ? value[0] : lo;
  const high = value ? value[1] : hi;

  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 0 });

  const label = useMemo(() => {
    const right = high >= max ? `$${fmt(high)}+` : `$${fmt(high)}`;
    return `$${fmt(low)}-${right}`;
  }, [low, high, max]);

  const setLow  = (v: number) => {
    const next = Math.min(Math.max(v, min), (value ? value[1] : hi) - step);
    if (!value) setLo(next);
    onChange?.([next, high]);
  };
  const setHigh = (v: number) => {
    const next = Math.max(Math.min(v, max), (value ? value[0] : lo) + step);
    if (!value) setHi(next);
    onChange?.([low, next]);
  };

  const parse = (s: string) => Number(String(s).replace(/[^\d]/g, "")) || 0;

  return (
    <section className={`rounded-lg overflow-hidden ${className}`} aria-label="Price filter">
      {/* CSS para permitir arrastrar ambos thumbs */}
      <style>{`
        .dual-range { pointer-events: none; }          
        .dual-range::-webkit-slider-thumb { pointer-events: auto; }
        .dual-range::-moz-range-thumb { pointer-events: auto; }
        /* opcional: pulgar cuadrado oscuro como tu mock */
        .dual-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px; height: 14px; background: #222; border-radius: 2px; border: 0;
        }
        .dual-range::-moz-range-thumb {
          width: 14px; height: 14px; background: #222; border-radius: 2px; border: 0;
        }
        .dual-range::-webkit-slider-runnable-track { height: 3px; background: transparent; }
        .dual-range::-moz-range-track { height: 3px; background: transparent; }
      `}</style>

      {/* Título */}
      <div className="bg-[#007B61] px-3 py-2">
        <h3 className="text-center text-[22px] font-semibold tracking-wide text-[#303030]">
          {title}
        </h3>
      </div>

      {/* Barra gris editable */}
      <div className="bg-[#C2C2C2] px-3 py-2">
        <div className="flex items-center gap-2 text-[#303030] text-[14px]">
          <span>$</span>
          <input
            type="text"
            inputMode="numeric"
            value={fmt(low)}
            onChange={(e) => setLow(parse(e.target.value))}
            onBlur={(e) => setLow(parse(e.target.value))}
            className="w-20 rounded px-2 py-1 bg-[#E0E0E0] border-2 border-transparent
                       focus:border-[#0E89EE] focus:outline-none text-right"
            aria-label="Minimum price"
          />
          <span>-</span>
          <span>$</span>
          <input
            type="text"
            inputMode="numeric"
            value={fmt(Math.min(high, max))}
            onChange={(e) => setHigh(parse(e.target.value))}
            onBlur={(e) => setHigh(parse(e.target.value))}
            className="w-20 rounded px-2 py-1 bg-[#E0E0E0] border-2 border-transparent
                       focus:border-[#0E89EE] focus:outline-none text-right"
            aria-label="Maximum price"
          />
          {high >= max && <span className="ml-1">+</span>}
        </div>
      </div>

      {/* Slider doble */}
      <div className="bg-[#D9D9D9]  py-5">
        <div className="relative h-10">
          {/* pista base */}
          <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-[3px] bg-black/20 rounded" />
          {/* tramo activo */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-[3px] rounded"
            style={{
              left:  `${((low  - min) / (max - min)) * 100}%`,
              right: `${(1 - (high - min) / (max - min)) * 100}%`,
              backgroundColor: "#0E89EE",
            }}
          />
          {/* LOW */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={low}
            onChange={(e) => setLow(Number(e.target.value))}
            className="dual-range absolute inset-0 w-full h-7 bg-transparent appearance-none z-20"
            aria-label="Minimum price slider"
            style={{ accentColor: "#0E89EE" }}
          />
          {/* HIGH */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={high}
            onChange={(e) => setHigh(Number(e.target.value))}
            className="dual-range absolute inset-0 w-full h-7 bg-transparent appearance-none z-10"
            aria-label="Maximum price slider"
            style={{ accentColor: "#0E89EE" }}
          />
        </div>
      </div>
    </section>
  );
}
