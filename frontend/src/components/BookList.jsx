import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

function BookList() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Search, filter, sort states
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("");

  const fetchBooks = async () => {
    setLoading(true);
    try {
      let query = `/books?page=${page}`;
      if (search) query += `&search=${search}`;
      if (genre) query += `&genre=${genre}`;
      if (sort) query += `&sort=${sort}`;

      const res = await api.get(query);
      const booksData = res.data.books;

      const booksWithRating = await Promise.all(
        booksData.map(async (book) => {
          try {
            const ratingRes = await api.get(`/reviews/book/${book._id}`);
            return {
              ...book,
              averageRating: parseFloat(ratingRes.data.averageRating),
            };
          } catch {
            return { ...book, averageRating: 0 };
          }
        })
      );

      setBooks(booksWithRating);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, search, genre, sort]);

  const renderStars = (rating) => {
    const rounded = Math.round(rating);
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < rounded ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    );
  };

  const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-white dark:text-black drop-shadow-sm">
          Discover Books
        </h1>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full md:w-auto bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          />
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          >
            <option value="">All Genres</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-fiction">Non-fiction</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          >
            <option value="">Sort By</option>
            <option value="year">Year</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Link
              key={book._id}
              to={`/book/${book._id}`}
              className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {book.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                by {book.author}
              </p>
              <div className="flex items-center justify-between">
                {renderStars(book.averageRating)}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {book.averageRating.toFixed(1)} / 5
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8">
        <div className="flex rounded-md shadow-sm">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookList;
