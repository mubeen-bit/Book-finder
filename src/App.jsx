import { useState } from "react";
import "./App.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchBooks = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError("");
    setBooks([]);

    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBooks(data.docs.slice(0, 20)); // show only 20 results
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1 className="title">📚 Book Finder</h1>

      {/* Search */}
      <form onSubmit={searchBooks} className="search-form">
        <input
          type="text"
          placeholder="Search books by title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>

      {/* Loading */}
      {loading && <p className="info">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* Results */}
      <div className="grid">
        {books.map((book) => (
          <div key={book.key} className="card">
            <img
              src={
                book.cover_i
                  ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                  : "https://via.placeholder.com/150x200?text=No+Cover"
              }
              alt={book.title}
              className="cover"
            />
            <h2 className="book-title">{book.title}</h2>
            <p className="author">
              {book.author_name
                ? book.author_name.join(", ")
                : "Unknown Author"}
            </p>
            <p className="year">
              First published: {book.first_publish_year || "N/A"}
            </p>
          </div>
        ))}
      </div>

      {/* No results */}
      {!loading && books.length === 0 && query && !error && (
        <p className="info">No results found.</p>
      )}
    </div>
  );
}
