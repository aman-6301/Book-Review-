import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BookDetails from "./components/BookDetails";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext"; // ✅ import theme hook

function App() {
  const { token } = useAuth();
  const { theme } = useTheme(); // ✅ get current theme

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
      <Navbar />
      <div className="max-w-5xl mx-auto p-4">
        <Routes>
          {/* Redirect to login if no token */}
          <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
          <Route path="/book/:id" element={token ? <BookDetails /> : <Navigate to="/login" />} />
          {token && <Route path="/add" element={<AddBook />} />}
          {token && <Route path="/edit/:id" element={<EditBook />} />}
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
