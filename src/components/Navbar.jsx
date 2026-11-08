
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  ArrowUpRight,
  GraduationCap,
  LayoutDashboard,
  LogIn,
  LogOut,
  BookOpen,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const role = String(
    user?.role?.name ||
      user?.role ||
      user?.userRole ||
      ""
  ).toLowerCase();

  const isAdmin = ["admin", "superadmin"].includes(role);

  const links = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Instructors", path: "/teachers" },
    { name: "Notices", path: "/notices" },
    { name: "Results", path: "/results" },
    ...(!user ? [{ name: "Register", path: "/register" }] : []),
  ];

  const dashboardPath = "/admin";

  const closeMenu = () => setOpen(false);

  const handleLogout = async () => {
    closeMenu();
    await logout();
  };

  const navLinkClass = ({ isActive }) =>
    `relative flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-cyan-50 text-cyan-700"
        : "text-slate-600 hover:bg-slate-50 hover:text-cyan-700"
    }`;

  return (
    <>
      {/* TOP BAR */}
      <div className="hidden bg-[#071426] text-white sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2 text-xs sm:px-8 lg:px-10">
          <p className="font-medium tracking-wide text-slate-300">
            ✦ Build skills. Shape your future.
          </p>

          <p className="flex items-center gap-2 font-semibold text-lime-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-lime-400" />
            IT Academy Online
          </p>
        </div>
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
          <div className="flex h-[72px] items-center justify-between gap-4">

            {/* LOGO */}
            <Link
              to="/"
              onClick={closeMenu}
              className="group flex shrink-0 items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 text-sm font-black text-white shadow-lg shadow-cyan-500/20 transition group-hover:scale-105">
                IT
              </div>

              <div className="leading-none">
                <h1 className="text-lg font-black tracking-tight text-slate-900 sm:text-xl">
                  IT<span className="text-cyan-600">ACADEMY</span>
                </h1>

                <p className="mt-1.5 text-[9px] font-bold tracking-[0.22em] text-slate-400">
                  LEARN · BUILD · GROW
                </p>
              </div>
            </Link>

            {/* DESKTOP NAVIGATION */}
            <nav className="hidden items-center gap-1 lg:flex">
              {links.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={navLinkClass}
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* DESKTOP ACTIONS */}
            <div className="hidden items-center gap-2 lg:flex">
              {user ? (
                <>
                  <Link
                    to={dashboardPath}
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2.5 text-sm font-bold text-cyan-700 transition hover:border-cyan-400 hover:bg-cyan-100"
                  >
                    <LayoutDashboard size={17} />
                    {isAdmin ? "Dashboard" : "My Dashboard"}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                  >
                    <LogIn size={17} />
                    Sign in
                  </Link>

                  <Link
                    to="/register"
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
                  >
                    Register
                  </Link>
                </>
              )}

              <Link
                to="/courses"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Explore Courses
                <ArrowUpRight
                  size={16}
                  className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 lg:hidden"
            >
              {open ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>

        {/* MOBILE NAVIGATION */}
        <div
          id="mobile-navigation"
          className={`grid overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
            open
              ? "grid-rows-[1fr] border-t border-slate-100 opacity-100"
              : "grid-rows-[0fr] border-t-0 opacity-0"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 pb-5 pt-4 sm:px-8">

              {/* MOBILE NAV LINKS */}
              <nav className="space-y-1">
                {links.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-bold transition ${
                        isActive
                          ? "bg-cyan-50 text-cyan-700"
                          : "text-slate-700 hover:bg-slate-50 hover:text-cyan-700"
                      }`
                    }
                  >
                    {item.name}
                    <ChevronRight size={17} />
                  </NavLink>
                ))}
              </nav>

              {/* MOBILE USER ACTIONS */}
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">

                {user ? (
                  <>
                    {/* Dashboard: Admin and normal user */}
                    <Link
                      to={dashboardPath}
                      onClick={closeMenu}
                      className="flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3.5 font-bold text-white shadow-md shadow-cyan-500/20 transition hover:shadow-lg"
                    >
                      <span className="flex items-center gap-3">
                        <LayoutDashboard size={19} />
                        {isAdmin ? "Admin Dashboard" : "My Dashboard"}
                      </span>

                      <ArrowUpRight size={18} />
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-5 py-3.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
                    >
                      <LogOut size={18} />
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      <LogIn size={18} />
                      Sign in
                    </Link>

                    <Link
                      to="/register"
                      onClick={closeMenu}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-cyan-700"
                    >
                      <GraduationCap size={18} />
                      Create Account
                    </Link>
                  </>
                )}

                <Link
                  to="/courses"
                  onClick={closeMenu}
                  className="flex w-full items-center justify-between rounded-xl bg-blue-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen size={18} />
                    Explore All Courses
                  </span>

                  <ArrowUpRight size={18} />
                </Link>
              </div>

              {/* MOBILE FOOTER */}
              <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span className="text-xs font-semibold text-slate-500">
                  ✦ Build skills. Shape your future.
                </span>

                <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  ONLINE
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
