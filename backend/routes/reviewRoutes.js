const express = require("express");
const router = express.Router();
const Review = require("../models/reviewModel");
const Book = require("../models/bookModel");
const protect = require("../middleware/authMiddleware");

// ➕ Add a review to a book
router.post("/:bookId", protect, async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const bookId = req.params.bookId;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Create review
    const review = await Review.create({
      bookId,
      userId: req.user.id,
      rating,
      reviewText,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✏️ Update review (only creator)
router.put("/:id", protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Only creator can edit
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to edit this review" });
    }

    const { rating, reviewText } = req.body;
    review.rating = rating || review.rating;
    review.reviewText = reviewText || review.reviewText;

    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ❌ Delete review (only creator)
router.delete("/:id", protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();
    res.json({ message: "Review removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📖 Get all reviews for a book + average rating
router.get("/book/:bookId", async (req, res) => {
  try {
    const bookId = req.params.bookId;

    const reviews = await Review.find({ bookId }).populate("userId", "name _id");
    if (!reviews) return res.status(404).json({ message: "No reviews yet" });

    // Calculate average rating
    const avgRating =
      reviews.reduce((acc, item) => acc + item.rating, 0) / (reviews.length || 1);

    res.json({ reviews, averageRating: avgRating.toFixed(2) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📊 Rating distribution for a book (1–5 stars)
router.get("/book/:bookId/distribution", async (req, res) => {
  try {
    const bookId = req.params.bookId;

    const reviews = await Review.find({ bookId });
    if (!reviews.length) {
      return res.json({ distribution: [0, 0, 0, 0, 0] });
    }

    const distribution = [0, 0, 0, 0, 0]; // index 0=1★, 1=2★, etc.
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        distribution[r.rating - 1] += 1;
      }
    });

    res.json({ distribution });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
