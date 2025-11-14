import React from "react";
import { Link } from "react-router-dom";

export type GridLibroProps = {
  id: string | null;
  title: string;
  description: string;
  price: number;
  reviews: number;
  rating: number;       // se muestra como "X/10"
  link?: string | null; // ruta interna, p.ej. "/book/123"
  className?: string;
};

/**
 * GridLibro
 * - Presentacional.
 * - Si `link` existe: se envuelve en <Link> clickeable (navegación interna).
 * - Si no hay `link`: se renderiza como <article> normal.
 * - Descripción clamped a 2 líneas con “…” (webkit-line-clamp).
 */
export default function GridLibro({
  id,
  title,
  description,
  price,
  reviews,
  rating,
  link,
  className = "",
}: GridLibroProps) {
  const CardInner = (
    <div
      className={[
        "rounded-xl bg-[#464646] text-[#D9D9D9] shadow px-6 py-5",
        link
          ? "cursor-pointer transition hover:-translate-y-0.5 hover:shadow-lg hover:bg-[#4d4d4d]"
          : "",
        className,
      ].join(" ")}
    >
      {/* Título */}
      <h3 className="text-[18px] md:text-[20px] font-semibold mb-2">
        {title}
      </h3>

      {/* Descripción (máx 2 líneas + “…”) */}
      <p
        className="text-[14px] md:text-[15px] opacity-90 mb-4"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
        title={description}
      >
        {description}
      </p>

      {/* Línea inferior: Precio | Reviews | Rating */}
      <div className="grid grid-cols-3 gap-4 text-[14px] md:text-[15px]">
        <div>
          <span className="opacity-80">Price: </span>
          <span>${price}</span>
        </div>
        <div className="text-center">
          <span className="opacity-80">Reviews: </span>
          <span>{reviews}</span>
        </div>
        <div className="text-right">
          <span className="opacity-80">Rating: </span>
          <span>{rating}/5</span>
        </div>
      </div>
    </div>
  );

  // Si hay link → usamos <Link>; si no → <article>.
  return link ? (
    <Link
      to={link}
      aria-label={title}
      className="block"
      title={`Ver detalles de ${title}`}
    >
      {CardInner}
    </Link>
  ) : (
    <article aria-label={title}>{CardInner}</article>
  );
}
