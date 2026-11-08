import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "./components/Toaster";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Teachers from "./pages/Teachers";
import Notices from "./pages/Notices";
import Results from "./pages/Results";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import { AuthContext } from "./context/AuthContext";
function isAdminUser(user) {
  return ["admin", "superadmin"].includes(String(user?.role || user?.userRole || "").toLowerCase());
}
export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("it_user") || "null");
    } catch {
      return null;
    }
  });
  const [toast, setToast] = useState("");
  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };
  const logout = () => {
    localStorage.removeItem("it_access_token");
    localStorage.removeItem("it_user");
    setUser(null);
    notify("You have been logged out");
  };
  return (
    <AuthContext.Provider value={{ user, setUser, logout, notify }}>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetails />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/results" element={<Results />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin/login"
            element={isAdminUser(user) ? <Navigate to="/admin" /> : <Login adminOnly />}
          />
          <Route
            path="/admin/*"
            element={isAdminUser(user) ? <Admin /> : <Navigate to="/admin/login" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
        <Toaster message={toast} />
      </div>
    </AuthContext.Provider>
  );
}
