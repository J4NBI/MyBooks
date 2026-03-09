"use client";

import { useState, useEffect } from "react";
import { Search, Book as BookIcon, CirclePlus } from "lucide-react";
import Link from "next/link";

export default function OpenLibrarySearch() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("title"); // 'title' oder 'author'
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length > 2) {
        fetchBooks();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchType]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      // Open Library Search API URL
      // Wir limitieren auf 10 Ergebnisse für schnellere Ladezeiten
      const url = `https://openlibrary.org/search.json?${searchType}=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      const data = await response.json();

      // Wir mappen die Daten, um sie leichter handhabbar zu machen
      const books = data.docs.map((doc: any) => ({
        id: doc.key,
        title: doc.title,
        author: doc.author_name?.[0] || "Unbekannter Autor",
        // Cover-ID für die Covers-API (M = Medium Größe)
        coverId: doc.cover_i
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
          : null,
      }));

      setResults(books);
    } catch (error) {
      console.error("Fehler beim Abrufen der Bücher:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Dropdown zur Wahl des Suchtyps */}
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="p-4 text-black p-3 border rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="title">Suchen nach Titel</option>
          <option value="author">Suchen nach Autor</option>
        </select>

        {/* Suchfeld mit Lupe */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={`${searchType === "title" ? "z.B. Der Herr der Ringe" : "z.B. Tolkien"}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Ergebnisliste */}
      <div className="space-y-4">
        {loading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!loading && results.length === 0 && query.length > 2 && (
          <p className=" text-gray-500">Keine Bücher gefunden.</p>
        )}

        <div className="grid grid-cols-2 items-center justify-center gap-4">
          {results.map((book: any) => (
            <button
              key={book.id}
              className="group  relative grid grid-cols-2 p-8  gap-4 border rounded-xl hover:shadow-md bg-white hover:bg-stone-200 hover:scale-105  transition-all duration-300"
            >
              <Link
                href={{
                  pathname: "/buch-details",
                  query: {
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    img: book.coverId,
                  },
                }}
              >
                <div className="w-16 h-24 bg-gray-100 relative overflow-hidden rounded shadow-sm">
                  {book.coverId ? (
                    <img
                      src={book.coverId}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookIcon className="text-gray-300 w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className=" text-left flex flex-col justify-start items-start ">
                  <h3 className="font-bold text-gray-900 leading-tight">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{book.author}</p>
                </div>
                <div
                  className="absolute flex items-center justify-center text-stone-700 w-full h-full bg-stone-200 inset-0 rounded-xl opacity-0 group-hover:opacity-50
               transition-opacity duration-300"
                >
                  <CirclePlus size={50} />{" "}
                </div>
              </Link>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
