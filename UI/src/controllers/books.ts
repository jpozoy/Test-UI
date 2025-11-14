export interface Book {
  id: string | null;
  title: string;
  description: string;
  price: number;
  reviews: number;
  rating: number;
  categories?: string[];
  image_url?: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://api-service:8000";

export async function fetchBooks(query?: string): Promise<Book[]> {
  const url = query
    ? `${API_URL}/books?q=${encodeURIComponent(query)}`
    : `${API_URL}/books`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al obtener libros");

  const data = await res.json();

  const booksParsed: Book[] = data.books.map((b: any) => {
    const id =
      b.id ??              // por si el backend ya lo mapea
      b._id ??             // típico de Mongo
      b.upc ??             // opcional: usar upc como id
      null;

    return {
      ...b,
      id, // ahora TODOS los libros tendrán un `id` usable
      price: parseFloat(String(b.price).replace(/[^0-9.-]+/g, "")) || 0,
      reviews: Number(b.number_of_reviews) || 0,
      rating:
        typeof b.rating === "string" ? parseRating(b.rating) : b.rating,
    };
  });

  return booksParsed;
}
// Función auxiliar que convierte calificaciones textuales a número (si usas textos como "Three", "Five", etc.)
function parseRating(ratingStr: string): number {
  const ratingMap: { [key: string]: number } = {
    "One": 1,
    "Two": 2,
    "Three": 3,
    "Four": 4,
    "Five": 5,
  };
  return ratingMap[ratingStr] || 0;
}

export async function fetchBooksFiltered(query: string): Promise<Book[]> {
  const url = `http://localhost:30080/books?q=${encodeURIComponent(query ?? "")}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al obtener libros");

  const data = await res.json();
  console.log(data);
  return data.books;
}



