import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { postData } from "../lib/api";
import { LockKeyhole, ArrowUpRight } from "lucide-react";
export default function Login({ adminOnly = false }) {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || ""),
    [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const { setUser } = useAuth();
  const nav = useNavigate();
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await postData("/api/auth/login", { email, password });
      const payload = r?.data?.data ?? r?.data ?? r;
      const token = payload?.accessToken || payload?.token;
      const user = payload?.user || payload?.account;
      if (!token) throw new Error("No access token received from API.");
      const role = String(user?.role || user?.userRole || "").toLowerCase();
      if (!user || !role) throw new Error("The API response did not include the user's role. Please contact the academy administrator.");
      if (adminOnly && !["admin", "superadmin"].includes(role)) throw new Error("This account does not have administrator access.");
      localStorage.setItem("it_access_token", token);
      localStorage.setItem("it_user", JSON.stringify(user));
      setUser(user);
      nav(["admin", "superadmin"].includes(role) ? "/admin" : "/courses");
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <div className="login-symbol">
          <LockKeyhole />
        </div>
        <div className="eyebrow">{adminOnly ? "ADMIN ACCESS" : "STUDENT & ADMIN SIGN IN"}</div>
        <h1>
          Welcome <em>back.</em>
        </h1>
        <p>{adminOnly ? "Sign in with an administrator account to manage academy content." : "Sign in to continue your learning journey."}</p>
        <label>Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          required
        />
        <button className="btn btn-primary w-full" disabled={busy}>
          {busy ? "Signing in…" : "Sign in securely"} <ArrowUpRight size={16} />
        </button>
        {error && <div className="error-text">{error}</div>}
        <p className="auth-switch">New student? <Link to="/register">Create an account</Link></p>
        <Link to="/" className="back-home">
          ← Back to website
        </Link>
      </form>
    </main>
  );
}
