import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getData } from "../lib/api";
import {
  ArrowLeft,
  Clock3,
  Wallet,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
  Layers3,
} from "lucide-react";

export default function CourseDetails() {
  const { slug } = useParams();

  const q = useQuery({
    queryKey: ["course", slug],
    queryFn: () => getData(`/api/v1/courses/${encodeURIComponent(slug)}`),
    enabled: Boolean(slug),
  });

  const c = q.data?.data;

  const fee =
    c?.fee != null
      ? `৳ ${Number(c.fee).toLocaleString("en-BD")}`
      : "Contact academy";

  if (q.isLoading) {
    return (
      <main className="min-h-screen bg-[#f5f7fc] px-5 py-20">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-8 w-36 rounded-lg bg-slate-200" />
          <div className="h-96 rounded-3xl bg-slate-200" />
          <div className="h-10 w-2/3 rounded-lg bg-slate-200" />
          <div className="h-32 rounded-2xl bg-slate-200" />
        </div>
      </main>
    );
  }

  if (q.isError || !c) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f5f7fc] px-5">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <BookOpen size={48} className="mx-auto mb-5 text-indigo-500" />
          <h2 className="text-2xl font-bold text-slate-900">
            Course Not Found
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            This course is unavailable or may have been removed.
          </p>
          <Link
            to="/courses"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            <ArrowLeft size={17} />
            Browse Courses
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f7fc] pb-20">
      <section className="relative bg-[#101a38]">
        <div className="pointer-events-none absolute -right-32 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 h-[400px] w-[400px] rounded-full bg-blue-500/15 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-8 md:px-8 md:pb-28 md:pt-12">
          <Link
            to="/"
            className="group relative mt-8 inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-950/20 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/60 hover:bg-white hover:text-indigo-700 hover:shadow-2xl hover:shadow-indigo-950/30 active:scale-95"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

            <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/15 transition-all duration-300 group-hover:rotate-[-45deg] group-hover:border-indigo-200 group-hover:bg-indigo-100">
              <ArrowLeft
                size={18}
                className="transition-transform duration-300 group-hover:-translate-x-0.5"
              />
            </span>

            <span className="relative tracking-wide">Back to Home</span>

            <span className="relative ml-1 text-lg transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>

          <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-xs font-bold tracking-widest text-indigo-300">
                <Sparkles size={15} />
                EXPLORE YOUR FUTURE
              </div>

              <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.15] tracking-tight text-white md:text-5xl lg:text-6xl">
                {c.title}
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 md:text-lg">
                {c.descriptions}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <div className="flex min-w-[155px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-4">
                  <div className="rounded-xl bg-indigo-500/20 p-2.5 text-indigo-300">
                    <Clock3 size={21} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Duration</p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {c.duration || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-[155px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-4">
                  <div className="rounded-xl bg-emerald-500/20 p-2.5 text-emerald-300">
                    <Wallet size={21} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Course Fee</p>
                    <p className="mt-1 text-sm font-bold text-white">{fee}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="overflow-hidden rounded-[28px] border border-white/15 bg-white/[0.06] p-2 shadow-2xl shadow-black/20">
                {c.banner ? (
                  <img
                    src={c.banner}
                    alt={c.title}
                    className="block h-auto max-h-[460px] w-full rounded-[22px] object-contain"
                  />
                ) : (
                  <div className="flex min-h-[300px] items-center justify-center rounded-[22px] bg-indigo-500/10">
                    <GraduationCap size={100} className="text-indigo-300/60" />
                  </div>
                )}
              </div>

              <div className="absolute -bottom-6 -left-3 hidden items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:flex md:-left-8">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                  <Award size={27} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Learn & Grow</p>
                  <p className="text-xs text-slate-500">
                    Build your future skills
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-start gap-8 px-5 pt-14 md:px-8 md:pt-20 lg:grid-cols-[1fr_350px]">
        <div className="min-w-0 space-y-8">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm md:p-10">
            <div className="mb-8 flex items-center gap-4">
              <div className="rounded-2xl bg-indigo-50 p-3.5 text-indigo-600">
                <BookOpen size={27} />
              </div>
              <div>
                <p className="text-xs font-bold tracking-[0.18em] text-indigo-600">
                  COURSE CURRICULUM
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#15203e] md:text-3xl">
                  What You Will Learn
                </h2>
              </div>
            </div>

            <div className="mb-7 h-1 w-16 rounded-full bg-indigo-600" />

            <div className="whitespace-pre-line break-words text-[15px] leading-8 text-slate-600 md:text-base">
              {c.curriculum || "Course curriculum will be announced soon."}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-700 p-8 shadow-lg shadow-indigo-600/10 md:p-10">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />

            <div className="relative">
              <div className="mb-5 inline-flex rounded-xl bg-white/15 p-3 text-white">
                <GraduationCap size={30} />
              </div>

              <h2 className="text-2xl font-bold text-white md:text-3xl">
                Ready to Start Learning?
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-indigo-100 md:text-base">
                Take the next step toward your career. Explore our courses and
                find the right learning path for your future.
              </p>

              <Link
                to="/courses"
                className="mt-7 inline-flex items-center gap-3 rounded-xl bg-white px-6 py-3.5 font-bold text-indigo-700 transition hover:-translate-y-1 hover:shadow-lg"
              >
                Explore All Courses
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
            <div className="bg-[#101a38] px-7 py-7">
              <div className="mb-5 inline-flex rounded-xl bg-indigo-500/20 p-3 text-indigo-300">
                <Layers3 size={27} />
              </div>

              <p className="text-xs font-bold tracking-widest text-indigo-300">
                COURSE INFORMATION
              </p>
              <h3 className="mt-2 text-2xl font-bold text-white">
                Course Overview
              </h3>
            </div>

            <div className="p-7">
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-3 text-slate-500">
                    <Clock3 size={19} className="text-indigo-500" />
                    <span className="text-sm">Duration</span>
                  </div>
                  <span className="text-right text-sm font-bold text-slate-800">
                    {c.duration || "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-3 text-slate-500">
                    <Wallet size={19} className="text-indigo-500" />
                    <span className="text-sm">Course Fee</span>
                  </div>
                  <span className="text-right text-sm font-bold text-indigo-600">
                    {fee}
                  </span>
                </div>
              </div>

              <div className="mt-7 space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2
                    size={19}
                    className="shrink-0 text-emerald-500"
                  />
                  Detailed course curriculum
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2
                    size={19}
                    className="shrink-0 text-emerald-500"
                  />
                  Professional learning
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2
                    size={19}
                    className="shrink-0 text-emerald-500"
                  />
                  Career-focused skills
                </div>
              </div>

              <Link
                to="/courses"
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-4 font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-1 hover:bg-indigo-700"
              >
                Explore Courses
                <ArrowRight size={18} />
              </Link>

              <p className="mt-4 text-center text-xs leading-6 text-slate-400">
                Contact the academy for admission information.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
