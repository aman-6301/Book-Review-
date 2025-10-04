import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import FormCard from "./FormCard";
import Toast from "./Toast";

function BookForm({ isEdit }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    year: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      api.get(`/books/${id}`).then((res) => {
        setForm({
          title: res.data.title || "",
          author: res.data.author || "",
          description: res.data.description || "",
          genre: res.data.genre || "",
          year: res.data.year || "",
        });
      }).finally(() => setLoading(false));
    }
  }, [isEdit, id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);
    try {
      if (isEdit) {
        await api.put(`/books/${id}`, form);
      } else {
        await api.post("/books", form);
      }
      setToast({ message: `Book ${isEdit ? 'updated' : 'added'} successfully!`, type: 'success' });
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setToast({ message: error.response?.data?.message || "Something went wrong!", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard title={isEdit ? "Edit Book" : "Add a New Book"}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input id="title" name="title" type="text" value={form.title} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
          <input id="author" name="author" type="text" value={form.author} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} rows="4" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>
        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Genre</label>
          <input id="genre" name="genre" type="text" value={form.genre} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
          <input id="year" name="year" type="number" value={form.year} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : (isEdit ? "Update Book" : "Add Book")}
        </button>
      </form>
    </FormCard>
  );
}

export default BookForm;
