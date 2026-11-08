import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Eye, EyeOff, UserRoundPlus, ShieldCheck } from "lucide-react";
import { postData } from "../lib/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const nav = useNavigate();
  const update = (key) => (event) => setForm((old) => ({ ...old, [key]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    setBusy(true);
    try {
      // Expected backend endpoint: POST /api/auth/register
      await postData("/api/auth/register", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      setSuccess("Your student account was created. Please sign in to continue.");
      window.setTimeout(() => nav("/login", { replace: true, state: { email: form.email } }), 1100);
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || err.response?.data?.error;
      setError(status === 404
        ? "Registration endpoint is not available on the backend yet. Add POST /api/auth/register to enable sign-up."
        : message || err.message || "Could not create your account. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-aside">
        <div className="auth-aside-content">
          <span className="auth-kicker">IT ACADEMY · STUDENT PORTAL</span>
          <h1>Start building<br /><em>your future.</em></h1>
          <p>Create your student account to explore courses, keep track of notices and stay connected with the academy.</p>
          <div className="auth-benefit"><ShieldCheck size={18} /><span>One account for your learning journey</span></div>
        </div>
      </div>
      <section className="auth-main">
        <form className="auth-card" onSubmit={submit}>
          <div className="auth-icon"><UserRoundPlus size={22} /></div>
          <div className="eyebrow">CREATE YOUR ACCOUNT</div>
          <h2>Join <em>IT Academy.</em></h2>
          <p className="auth-subtitle">Fill in your details to get started.</p>
          {error && <div className="auth-alert error-text" role="alert">{error}</div>}
          {success && <div className="auth-alert success-text" role="status">{success}</div>}
          <label htmlFor="register-name">Full name</label>
          <input id="register-name" autoComplete="name" value={form.name} onChange={update("name")} placeholder="Your full name" minLength={2} required />
          <label htmlFor="register-email">Email address</label>
          <input id="register-email" type="email" autoComplete="email" value={form.email} onChange={update("email")} placeholder="you@example.com" required />
          <label htmlFor="register-password">Password</label>
          <div className="password-wrap">
            <input id="register-password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={form.password} onChange={update("password")} placeholder="At least 8 characters" minLength={8} required />
            <button type="button" className="password-toggle" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
          </div>
          <label htmlFor="register-confirm">Confirm password</label>
          <input id="register-confirm" type={showPassword ? "text" : "password"} autoComplete="new-password" value={form.confirmPassword} onChange={update("confirmPassword")} placeholder="Enter password again" required />
          <button className="btn btn-primary auth-submit" disabled={busy}>{busy ? "Creating account…" : "Create account"} <ArrowUpRight size={16} /></button>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
          <Link to="/" className="back-home">← Back to website</Link>
        </form>
      </section>
    </main>
  );
}
