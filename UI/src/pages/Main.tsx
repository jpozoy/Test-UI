import React, { useEffect, useState, useMemo } from "react";
import TopMenu from "../components/MainPage/TopMenu";
import FilterMenu from "../components/MainPage/FilterMenu";
import GridLibro from "../components/MainPage/GridLibro";
import { fetchBooks, Book, fetchBooksFiltered } from "../controllers/books";

export default function MainPage() {
  const FILTER_WIDTH = 360;

  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [price, setPrice] = useState<[number, number]>([0, 150]);
  const [rating, setRating] = useState<number | null>(null);


  useEffect(() => {
    fetchBooks(query)
      .then(setBooks)
      .catch((err) => console.error("Error cargando libros:", err));
  }, [query]);

  const allCategories = Array.from(
    new Set(books.flatMap((b) => b.categories || []))
  ).sort();

  const filtered = useMemo(() => {
    let out = [...books];

    // Filtrar por precio
    out = out.filter((b) => b.price >= price[0] && b.price <= price[1]);

    // Filtrar por categorías
    if (selectedCats.length > 0) {
      const set = new Set(selectedCats.map((x) => x.toLowerCase()));
      out = out.filter((b) =>
        (b.categories || []).some((c) => set.has(c.toLowerCase()))
      );
    }

    // Filtrar por calificación
    if (rating !== null) {
      out = out.filter((b) => b.rating >= rating);
    }


    return out;
  }, [books, selectedCats, price, rating]);

  // Cuando el usuario busca, llama sólo cuando hace click en buscar o ENTER
  const handleSearch = (texto: string) => {
    if (texto.trim() === "") {
      // Si limpian el campo, vuelve a mostrar todos los libros
      fetchBooks().then(setBooks);
    } else {
      fetchBooksFiltered(texto).then(setBooks);
    }
    setQuery(texto);
  };

  return (
    <>
      <TopMenu onSearch={handleSearch} />


      <FilterMenu
        width={FILTER_WIDTH}
        topOffset={80}
        allCategories={allCategories}
        selectedCategories={selectedCats}
        onChangeCategories={setSelectedCats}
        priceRange={price}
        onChangePrice={setPrice}
        priceMin={0}
        priceMax={60}
        priceStep={1}
        rating={rating}
        onChangeRating={setRating}  
      />

      <main
        className="pt-20 px-4 md:px-6 bg-[#101010] min-h-screen"
        style={{ marginLeft: FILTER_WIDTH }}
      >
        <div className="max-w-[1200px] mx-auto space-y-6">
          <div className="text-[#D9D9D9]/70 text-sm">
            {query
              ? <>Resultados para “<span className="font-medium">{query}</span>” — {filtered.length}</>
              : <>Libros — {filtered.length}</>}
          </div>

        {filtered.map((b, i) => {
          return (
            <GridLibro
              key={i}
              id={b.id}  // opcional, por si quieres pasar el id también
              title={b.title}
              description={b.description}
              price={b.price}
              reviews={b.reviews}
              rating={b.rating}
              link={`/book/${b.id}`}  
            />
          );
        })}

          {filtered.length === 0 && (
            <div className="text-[#D9D9D9]/70 py-12">
              No se encontraron libros que coincidan.
            </div>
          )}
        </div>
      </main>
    </>
  );
}

