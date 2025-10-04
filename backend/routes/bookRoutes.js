const express = require("express");
const Book = require("../models/bookModel");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

// ➕ Add a book
router.post("/", protect, async (req, res) => {
  try {
    const { title, author, description, genre, year } = req.body;

    const book = await Book.create({
      title,
      author,
      description,
      genre,
      year,
      addedBy: req.user.id,
    });

    // Populate addedBy before sending response
    await book.populate("addedBy", "_id name email");

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📖 Get all books (with pagination)
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const { search, genre, sort } = req.query;

    // Build filter object
    let filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }
    if (genre) filter.genre = genre;

    // Sorting
    let sortObj = { createdAt: -1 }; // default newest first
    if (sort === "year") sortObj = { year: -1 }; // newest year first

    const books = await Book.find(filter)
      .populate("addedBy", "_id name email")
      .skip(skip)
      .limit(limit)
      .sort(sortObj);

    const total = await Book.countDocuments(filter);

    res.json({
      books,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 📖 Get single book
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("addedBy", "_id name email"); // ✅ populate addedBy
    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✏️ Update book (only creator)
router.put("/:id", protect, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.addedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update" });
    }

    const { title, author, description, genre, year } = req.body;
    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.genre = genre || book.genre;
    book.year = year || book.year;

    const updatedBook = await book.save();
    await updatedBook.populate("addedBy", "_id name email"); // ✅ populate before sending

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ❌ Delete book (only creator)
router.delete("/:id", protect, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.addedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete" });
    }

    await book.deleteOne();
    res.json({ message: "Book removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
