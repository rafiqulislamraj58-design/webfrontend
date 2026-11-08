
import { useQuery } from "@tanstack/react-query";
import { getData } from "../lib/api";
import { Link } from "react-router-dom";
import {
  Clock3,
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  Sparkles,
  Wallet,
  ArrowRight,
  Search,
  Layers3,
} from "lucide-react";

export default function Courses() {
  const q = useQuery({
    queryKey: ["courses"],
    queryFn: () => getData("/api/v1/courses"),
  });

  const rows = q.data?.data || [];

  const formatFee = (fee) =>
    fee != null
      ? `৳ ${Number(fee).toLocaleString("en-BD")}`
      : "Contact us";

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f7fc] pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#101a38]">
        <div className="pointer-events-none absolute -right-32 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 h-[400px] w-[400px] rounded-full bg-blue-500/15 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-20 text-center md:px-8 md:pb-32 md:pt-28">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-5 py-2.5 text-xs font-bold tracking-[0.18em] text-indigo-300">
            <Sparkles size={15} />
            LEARNING PATHS
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            Choose Your
            <span className="block bg-gradient-to-r from-indigo-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
              Next Skill.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            Explore professional courses, develop practical skills, and
            take the next step toward your dream career.
          </p>

          <div className="mx-auto mt-10 flex max-w-md flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm text-slate-200">
              <BookOpen size={17} className="text-indigo-300" />
              Professional Courses
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm text-slate-200">
              <GraduationCap size={19} className="text-indigo-300" />
              Build Your Future
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="relative mx-auto max-w-7xl px-5 pt-16 md:px-8 md:pt-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.2em] text-indigo-600">
              EXPLORE OUR PROGRAMS
            </p>

            <h2 className="text-3xl font-extrabold tracking-tight text-[#15203e] md:text-4xl">
              Available Courses
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500 md:text-base">
              Find the right course to develop your knowledge and practical
              expertise.
            </p>
          </div>

          {!q.isLoading && !q.isError && rows.length > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-white px-4 py-3 text-sm font-semibold text-indigo-700 shadow-sm">
              <Layers3 size={17} />
              {rows.length} {rows.length === 1 ? "Course" : "Courses"}
            </div>
          )}
        </div>

        {q.isLoading ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
              >
                <div className="h-56 animate-pulse bg-slate-200" />
                <div className="space-y-4 p-6">
                  <div className="h-6 w-3/4 animate-pulse rounded-lg bg-slate-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                  <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : q.isError ? (
          <div className="rounded-3xl border border-red-100 bg-white px-6 py-16 text-center shadow-sm">
            <BookOpen size={45} className="mx-auto mb-5 text-red-400" />
            <h3 className="text-xl font-bold text-slate-900">
              Unable to Load Courses
            </h3>
            <p className="mt-3 text-sm text-slate-500">
              Something went wrong while loading courses. Please try again.
            </p>
            <button
              onClick={() => q.refetch()}
              className="mt-7 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        ) : rows.length ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((c, i) => (
              <article
                key={c._id}
                className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/10"
              >
                {/* Course Image */}
                <div className="relative flex h-56 items-center justify-center overflow-hidden bg-[#edf0ff] p-3">
                  {c.banner ? (
                    <img
                      src={c.banner}
                      alt={c.title}
                      loading="lazy"
                      className="h-full w-full rounded-2xl object-contain transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-50">
                      <GraduationCap
                        size={75}
                        strokeWidth={1.2}
                        className="text-indigo-400"
                      />
                    </div>
                  )}

                  <div className="absolute left-6 top-6 rounded-full border border-white/70 bg-white/90 px-4 py-2 text-[10px] font-extrabold tracking-widest text-indigo-700 shadow-sm backdrop-blur">
                    COURSE / {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="absolute bottom-5 right-5 rounded-xl bg-[#101a38]/90 px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur">
                    {formatFee(c.fee)}
                  </div>
                </div>

                {/* Course Content */}
                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <h3 className="line-clamp-2 text-xl font-bold leading-snug text-[#15203e] transition group-hover:text-indigo-600">
                    {c.title}
                  </h3>

                  <p className="mt-4 line-clamp-3 min-h-[78px] text-sm leading-7 text-slate-500">
                    {c.descriptions || "Contact us for course details."}
                  </p>

                  {/* Course Metadata */}
                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 py-5">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                        <Clock3 size={16} />
                      </div>
                      <span>{c.duration || "Flexible duration"}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                      <Wallet size={16} className="text-indigo-500" />
                      {formatFee(c.fee)}
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    to={`/courses/${c.slug}`}
                    className="mt-auto flex items-center justify-between rounded-xl bg-[#f0f1ff] px-5 py-4 font-bold text-indigo-700 transition duration-300 hover:bg-indigo-600 hover:text-white"
                  >
                    <span className="text-sm">Explore Course Details</span>
                    <ArrowUpRight
                      size={19}
                      className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
              <Search size={36} />
            </div>

            <h3 className="text-2xl font-bold text-[#15203e]">
              No Courses Available
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
              We are preparing new learning opportunities. Please check
              back soon.
            </p>
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto mt-20 max-w-7xl px-5 md:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-700 px-7 py-12 text-center shadow-xl shadow-indigo-600/10 md:px-14 md:py-16">
          <div className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full border-[35px] border-white/10" />

          <div className="relative">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
              <GraduationCap size={30} />
            </div>

            <h2 className="text-2xl font-extrabold text-white md:text-4xl">
              Your Future Starts With Learning
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-indigo-100 md:text-base">
              Choose a learning path, develop valuable skills, and start
              building a better future today.
            </p>

            <Link
              to="/"
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-white px-7 py-4 font-bold text-indigo-700 transition hover:-translate-y-1 hover:shadow-xl"
            >
              Back to Home
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
