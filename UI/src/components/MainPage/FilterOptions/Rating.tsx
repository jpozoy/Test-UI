import { useState } from "react";

type Props = {
    value: number | null;
    onChange: (next: number | null) => void;
};

export default function RatingFilter({ value, onChange }: Props) {
    const [hover, setHover] = useState<number | null>(null);

    const stars = [1, 2, 3, 4, 5];

    const current = hover ?? value;

    return (
        <section className="rounded-lg overflow-hidden">
            {/* Título */}
            <div className="bg-[#007B61] px-3 py-2">
                <h3 className="text-center text-[22px] font-semibold tracking-wide text-[#303030]">
                    Rating
                </h3>
            </div>

            {/* Contenido gris */}
            <div className="bg-[#C2C2C2] px-3 py-4 flex items-center justify-center gap-4">
                {stars.map((s) => (
                    <span
                        key={s}
                        onMouseEnter={() => setHover(s)}
                        onMouseLeave={() => setHover(null)}
                        onClick={() => onChange(s === value ? null : s)}
                        className="cursor-pointer text-[26px]"
                        style={{
                            color: current && s <= current ? "#000" : "#777",
                        }}
                    >
                        ★
                    </span>
                ))}
            </div>
        </section>
    );
}
