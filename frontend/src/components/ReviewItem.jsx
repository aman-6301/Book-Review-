import { useState } from "react";
import StarRating from "./StarRating";
import api from "../utils/api";

function ReviewItem({ review, currentUser, onUpdate, onDelete }) {
  const isOwner = currentUser?._id === review.userId?._id;
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(review.reviewText);
  const [rating, setRating] = useState(review.rating);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.put(`/reviews/${review._id}`, { rating, reviewText: text });
      onUpdate(res.data);
      setEditing(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to update review");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this review?")) return;
    setLoading(true);
    try {
      await api.delete(`/reviews/${review._id}`);
      onDelete(review._id);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to delete review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-gray-800 dark:text-white">{review.userId?.name || "User"}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
        <StarRating rating={rating} editable={editing} onChange={setRating} />
      </div>
      <div className="mt-4">
        {editing ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        ) : (
          <p className="text-gray-700 dark:text-gray-300">{text}</p>
        )}
      </div>
      {isOwner && (
        <div className="mt-4 flex space-x-2">
          {editing ? (
            <>
              <button onClick={handleSave} disabled={loading} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50">
                {loading ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setEditing(false)} className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Edit
              </button>
              <button onClick={handleDelete} disabled={loading} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
                {loading ? "Deleting..." : "Delete"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ReviewItem;
