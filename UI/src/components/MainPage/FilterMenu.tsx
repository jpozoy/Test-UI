// src/components/MainPage/FilterMenu.tsx
import React from "react";
import Categories from "./FilterOptions/Categories";
import PriceRange from "./FilterOptions/Price";
import Rating from "./FilterOptions/Rating";

type Props = {
  width?: number | string;
  topOffset?: number;
  className?: string;

  // control externo
  allCategories: string[];
  selectedCategories: string[];
  onChangeCategories: (next: string[]) => void;

  priceRange: [number, number];          // [min,max] actual
  onChangePrice: (next: [number, number]) => void;

  // límites (solo para el componente de precio)
  priceMin?: number;
  priceMax?: number;
  priceStep?: number;

  // Rating
  rating: number | null;
  onChangeRating: (r: number | null) => void;
};

export default function FilterMenu({
  width = 320,
  topOffset = 80,
  className = "",

  allCategories,
  selectedCategories,
  onChangeCategories,

  priceRange,
  onChangePrice,

  priceMin = 0,
  priceMax = 150,
  priceStep = 1,

  rating,
  onChangeRating,
}: Props) {
  const w = typeof width === "number" ? `${width}px` : width;
  const top = `${topOffset}px`;
  const h = `calc(100vh - ${top})`;

  const handleClear = () => {
    onChangeCategories([]);
    onChangePrice([priceMin, priceMax]);
    onChangeRating(null); 
  };

  return (
    <aside
      className={`fixed left-0 z-40 bg-[#D9D9D9] border-r border-black/10 ${className}`}
      style={{ width: w, top, height: h }}
      aria-label="Filter menu"
    >
      <div className="h-full overflow-auto p-4 space-y-6">
        <Categories
          options={allCategories}
          selected={selectedCategories}
          onChange={onChangeCategories}
        />

        <PriceRange
          min={priceMin}
          max={priceMax}
          step={priceStep}
          value={priceRange}
          onChange={onChangePrice}
        />

        <Rating
          value={rating}
          onChange={onChangeRating}
        />

        <div className="pt-2 pb-6 grid place-items-center">
          <button
            type="button"
            onClick={handleClear}
            className="px-5 py-2 rounded-lg bg-[#D92D20] hover:brightness-95 active:opacity-90
                        text-white font-medium shadow-md"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    </aside>
  );
}
