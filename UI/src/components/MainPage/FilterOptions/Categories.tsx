// src/components/MainPage/FilterMenuComponents/Categories.tsx
import { useMemo, useState } from "react";

type Props = {
  title?: string;
  options: string[];                 // títulos de los checkboxes
  selected?: string[];               // opcional: seleccionadas desde fuera
  onChange?: (next: string[]) => void;
  placeholder?: string;
  className?: string;
};

export default function Categories({
  title = "Categories",
  options,
  selected,
  onChange,
  placeholder = "search a categorie",
  className = "",
}: Props) {
  // estado controlado/ no controlado
  const [localSel, setLocalSel] = useState<string[]>(selected ?? []);
  const [q, setQ] = useState("");

  const sel = selected ?? localSel;

  const filtered = useMemo(() => {
    if (!q.trim()) return options;
    const qq = q.toLowerCase();
    return options.filter(o => o.toLowerCase().includes(qq));
  }, [q, options]);

  const toggle = (opt: string) => {
    const has = sel.includes(opt);
    const next = has ? sel.filter(x => x !== opt) : [...sel, opt];
    if (!selected) setLocalSel(next);
    onChange?.(next);
  };

  return (
    <section className={`rounded-lg overflow-hidden ${className}`} aria-label="Categories filter">
      {/* Título */}
      <div className="bg-[#007B61] px-3 py-2">
        <h3 className="text-center text-[22px] font-semibold tracking-wide text-[#303030]">
          {title}
        </h3>
      </div>

      {/* Buscador */}
      <div className="bg-[#C2C2C2] px-3 py-2">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md px-3 py-2 text-[#303030] placeholder-[#303030]/70
                     bg-[#C2C2C2] border-2 border-transparent focus:outline-none
                     focus:ring-0 focus:border-[#007B61]"
        />
      </div>

      {/* Checkboxes */}
      <div className="bg-[#D9D9D9] px-3 py-3 grid grid-cols-1 gap-2">
        {filtered.map((opt) => {
          const checked = sel.includes(opt);
          return (
            <label key={opt} className="inline-flex items-center gap-2 cursor-pointer select-none">
              {/* checkbox custom: fondo D9D9D9, borde 2, check 007B61 */}
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(opt)}
                className="appearance-none h-4 w-4 rounded-[3px]
                           border-2 border-[#303030]
                           bg-[#D9D9D9]
                           checked:bg-[#007B61] checked:border-[#007B61]
                           transition-colors duration-150
                           focus:outline-none focus:ring-2 focus:ring-[#007B61]/30"
              />
              <span className="text-[14px] text-[#303030]">{opt}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
