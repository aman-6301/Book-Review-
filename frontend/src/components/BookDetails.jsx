import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import ReviewForm from "../components/ReviewForm";
import ReviewItem from "../components/ReviewItem";
import StarRating from "../components/StarRating";
import RatingChart from "../components/RatingChart";
import Toast from "./Toast";

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chartKey, setChartKey] = useState(0);

  const updateChart = () => {
    setChartKey(prevKey => prevKey + 1);
  };

  const fetchBookAndReviews = async () => {
    setLoading(true);
    try {
      const resBook = await api.get(`/books/${id}`);
      setBook(resBook.data);

      const resReviews = await api.get(`/reviews/book/${id}`);
      setReviews(resReviews.data.reviews);
      setAverageRating(parseFloat(resReviews.data.averageRating) || 0);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookAndReviews();
  }, [id]);

  const handleDeleteBook = async () => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await api.delete(`/books/${id}`);
      setToast({ message: "Book deleted successfully!", type: "success" });
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setToast({ message: error.response?.data?.message || "Failed to delete book!", type: "error" });
    }
  };

  const handleAddReview = (newReview) => {
    setReviews([newReview, ...reviews]);
    const newAvg =
      (parseFloat(averageRating) * reviews.length + newReview.rating) /
      (reviews.length + 1);
    setAverageRating(newAvg);
    updateChart();
  };

  const handleUpdateReview = (updatedReview) => {
    const updatedReviews = reviews.map((r) =>
      r._id === updatedReview._id ? updatedReview : r
    );
    setReviews(updatedReviews);
    const newAvg =
      updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
      updatedReviews.length;
    setAverageRating(newAvg);
    updateChart();
  };

  const handleDeleteReview = (reviewId) => {
    const updatedReviews = reviews.filter((r) => r._id !== reviewId);
    setReviews(updatedReviews);
    const newAvg =
      updatedReviews.length > 0
        ? updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
          updatedReviews.length
        : 0;
    setAverageRating(newAvg);
    updateChart();
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><p className="text-lg">Loading...</p></div>;
  if (!book) return <div className="flex justify-center items-center h-screen"><p className="text-lg text-red-500">Book not found</p></div>;

  return (
    <div className="container mx-auto p-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-black dark:text-white">{book.title}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">by {book.author}</p>
            <div className="flex items-center mt-4">
              <StarRating rating={Math.round(averageRating)} />
              <span className="ml-2 text-gray-700 dark:text-gray-300">{averageRating.toFixed(1)}/5 ({reviews.length} reviews)</span>
            </div>
          </div>
          {user && user._id === book.addedBy?._id && (
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Link
                to={`/edit/${book._id}`}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
              >
                Edit
              </Link>
              <button
                onClick={handleDeleteBook}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <p className="text-gray-700 dark:text-gray-300"><strong className="font-semibold">Genre:</strong> {book.genre}</p>
          <p className="text-gray-700 dark:text-gray-300"><strong className="font-semibold">Year:</strong> {book.year}</p>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{book.description}</p>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Added by: {book.addedBy?.name}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white dark:text-black mb-4">Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-white dark:text-black mb-4">Community Ratings</h3>
            <RatingChart bookId={book._id} key={chartKey} />
          </div>
          <div>
            {user && (
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Write a Review</h3>
                <ReviewForm bookId={book._id} currentUser={user} onAdd={handleAddReview} />
              </div>
            )}
            <div className="space-y-4">
              {reviews.map((r) => (
                <ReviewItem
                  key={r._id}
                  review={r}
                  currentUser={user}
                  onUpdate={handleUpdateReview}
                  onDelete={handleDeleteReview}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
