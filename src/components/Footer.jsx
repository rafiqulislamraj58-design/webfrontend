
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  GraduationCap,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  MapPin,
  Phone,
  Heart,
  ChevronRight,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Instructors", path: "/teachers" },
    { name: "Notices", path: "/notices" },
    { name: "Results", path: "/results" },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      url: "https://facebook.com",
      label: "Facebook",
    },
    {
      icon: Instagram,
      url: "https://instagram.com",
      label: "Instagram",
    },
    {
      icon: Linkedin,
      url: "https://linkedin.com",
      label: "LinkedIn",
    },
    {
      icon: Youtube,
      url: "https://youtube.com",
      label: "YouTube",
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#071426] text-white">

      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Main Footer */}
      <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-16 sm:px-8 sm:pt-20 lg:px-10">

        <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">

          {/* Brand Section */}
          <div className="lg:col-span-2">

            <Link
              to="/"
              className="group inline-flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-black text-white shadow-lg shadow-cyan-500/20 transition group-hover:scale-105">
                IT
              </div>

              <div className="leading-none">
                <h2 className="text-xl font-black tracking-tight text-white">
                  IT<span className="text-cyan-400">ACADEMY</span>
                </h2>

                <p className="mt-1.5 text-[9px] font-bold tracking-[0.22em] text-slate-400">
                  LEARN · BUILD · GROW
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
              Learn with purpose. Create with confidence. Build practical
              skills, unlock new opportunities, and make your next move count
              with IT Academy.
            </p>

            {/* Social Links */}
            <div className="mt-7">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                Follow Our Journey
              </p>

              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition duration-200 hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-cyan-400 hover:text-slate-950"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-white">
              <span className="h-5 w-1 rounded-full bg-cyan-400" />
              Quick Links
            </h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition hover:translate-x-1 hover:text-cyan-300"
                  >
                    <ChevronRight
                      size={15}
                      className="text-cyan-500 transition group-hover:translate-x-1"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="mb-6 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-white">
              <span className="h-5 w-1 rounded-full bg-cyan-400" />
              Get In Touch
            </h3>

            <div className="space-y-5">

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300">
                  <MapPin size={17} />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-300">
                    Our Location
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    IT Academy
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300">
                  <Mail size={17} />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-300">
                    Email Address
                  </p>
                  <p className="mt-1 break-all text-sm text-slate-400">
                    Contact us for information
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300">
                  <Phone size={17} />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-300">
                    Phone Support
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Contact our academy
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="relative mt-10 overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">

          <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full border-[25px] border-cyan-400/5" />

          <div className="relative">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-widest text-cyan-300">
              <GraduationCap size={17} />
              START LEARNING TODAY
            </div>

            <h3 className="text-xl font-black text-white sm:text-2xl">
              Ready to build your future?
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Explore our courses and discover your potential.
            </p>
          </div>

          <Link
            to="/courses"
            className="group relative mt-5 inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:-translate-y-1 hover:shadow-cyan-500/20 sm:mt-0"
          >
            Explore Courses
            <ArrowUpRight
              size={17}
              className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-center sm:flex-row sm:text-left">

          <p className="text-xs leading-6 text-slate-500">
            © {year}{" "}
            <span className="font-bold text-slate-300">IT Academy.</span>{" "}
            All rights reserved.
          </p>

          <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em] text-slate-500 sm:text-xs">
            MADE FOR THE NEXT GENERATION
            <span className="text-cyan-400">✳</span>
          </p>

        </div>
      </div>
    </footer>
  );
}
