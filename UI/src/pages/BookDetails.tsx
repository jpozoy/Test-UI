// src/pages/BookDetails.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopMenu from "../components/MainPage/TopMenu";

// AJUSTA ESTE TYPE a lo que devuelve tu API de detalle
type BookDetail = {
  id: string;
  title: string;
  description: string;
  categories: string[];
  upc: string;
  availability: string;
  number_of_reviews: number;
  price: number;        // o string, según tu API
  rating: number;       // si tu API manda 1..5
  image_url: string;
};

// 🔹 AJUSTA ESTA CONSTANTE a la URL real de tu backend
const API_URL = import.meta.env.VITE_API_URL || "http://api-service:8000";

function normalizeImageUrl(raw: string | undefined | null): string {
  if (!raw) return "https://via.placeholder.com/200x280?text=Sin+imagen";

  // Si ya es absoluta (http/https) la devolvemos tal cual
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }

  // Caso típico BooksToScrape: "../../media/cache/..."
  // BASE de la página original (ajústalo si usaste otra)
  const BASE = "https://books.toscrape.com/";

  // quitamos los "../" del inicio
  const cleaned = raw.replace(/^(\.\.\/)+/, "");
  return BASE + cleaned;
}

export default function BookDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchBook() {
      try {
        setLoading(true);
        setError(null);

        // Ajusta este endpoint al que tengas en tu backend
        // por ejemplo: GET /books/:id o /api/books/:id
        const res = await fetch(`${API_URL}/books/${id}`);
        if (!res.ok) throw new Error("No se pudo cargar el libro");

        const data = await res.json();

        // Si tu backend devuelve { book: {...} } cambia esto a setBook(data.book)
        setBook(data as BookDetail);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    }

    fetchBook();
  }, [id]);

  if (!id) {
    return (
      <div className="min-h-screen bg-[#101010] text-white flex items-center justify-center">
        <p className="text-red-400">No se encontró el ID del libro en la URL.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#101010] text-white flex items-center justify-center">
        <p>Cargando libro...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-[#101010] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error || "Libro no encontrado"}</p>
          <button
            onClick={() => navigate("/mainpage")}
            className="px-3 py-1.5 rounded bg-[#3f3f3f] hover:bg-[#555555]"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const imgUrl = normalizeImageUrl(book.image_url);

  return (
    <div className="min-h-screen bg-[#101010] text-white">
      {/* TopMenu fijo arriba a la derecha */}
      <div className="fixed top-4 right-6 z-20">
        <TopMenu />
      </div>

      <div className="max-w-5xl mx-auto pt-20 pb-10 px-4">
        {/* Botón volver */}
        <button
          onClick={() => navigate("/mainpage")}
          className="mb-6 inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded bg-[#3f3f3f] hover:bg-[#555555] transition"
        >
          ← Volver al inicio
        </button>

        {/* Tarjeta principal */}
        <div className="bg-black/80 border border-[#2b2b2b] rounded-lg px-8 py-6">
          {/* Header */}
          <header className="flex items-center justify-between mb-6">
            <h1 className="inline-block bg-[#3f3f3f] px-6 py-3 rounded-md text-3xl md:text-4xl font-bold tracking-wide">
              {book.title}
              <span className="ml-2 text-sm md:text-base font-normal opacity-70">
                (ID: {book.id ?? id})
              </span>
            </h1>

            <div className="w-12 h-12 rounded-full bg-[#3f3f3f] flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
          </header>

          {/* Contenido */}
          <div className="grid grid-cols-1 md:grid-cols-[240px,1fr] gap-8">
            {/* Portada */}
            <div className="flex justify-center md:justify-start">
              <img
                src={imgUrl}
                alt={`Portada de ${book.title}`}
                className="border border-white w-[200px] h-auto object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://via.placeholder.com/200x280?text=Sin+imagen";
                }}
              />
            </div>

            {/* Info derecha */}
            <div className="space-y-8">
              {/* Descripción */}
              <section>
                <h2 className="text-2xl font-semibold mb-2">Descripción</h2>
                <p className="text-sm leading-relaxed">
                  {book.description || "Este libro no tiene descripción disponible."}
                </p>
              </section>

              {/* Categorías y detalles */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Categorías</h3>
                  {book.categories && book.categories.length > 0 ? (
                    <ul className="text-sm space-y-1">
                      {book.categories.map((c) => (
                        <li key={c}>- {c}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm opacity-70">Sin categorías</p>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Detalles del Libro</h3>
                  <ul className="text-sm space-y-1">
                    <li>- UPC: {book.upc}</li>
                    <li>- Disponibilidad: {book.availability}</li>
                    <li>- Precio: ${book.price}</li>
                    <li>- Rating: {book.rating}/10</li>
                    <li>- Reviews: {book.number_of_reviews}</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}