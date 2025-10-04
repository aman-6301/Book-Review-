import { useState } from "react";
import StarRating from "./StarRating";
import api from "../utils/api";

function ReviewForm({ bookId, currentUser, onAdd }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("You must be logged in to add a review");
    setLoading(true);
    try {
      const res = await api.post(`/reviews/${bookId}`, {
        rating: Number(rating),
        reviewText: text,
      });
      const newReview = { ...res.data, userId: currentUser };
      onAdd(newReview);
      setRating(5);
      setText("");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Rating</label>
        <StarRating rating={rating} editable={true} onChange={setRating} />
      </div>
      <div>
        <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Review</label>
        <textarea
          id="reviewText"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts..."
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

export default ReviewForm;
