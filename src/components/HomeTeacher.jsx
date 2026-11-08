import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, RefreshCw } from "lucide-react";

import { getData } from "../lib/api";
import SectionTitle from "../components/SectionTitle";

/* ================= CONSTANTS ================= */

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2";

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = (reduceMotion, delay = 0) =>
  reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.55, delay, ease: EASE },
      };

/* ================= SECTION ================= */

export default function HomeTeacher() {
  const reduceMotion = useReducedMotion();

  // Same query key as before, so the cache is shared with any other "teachers" query.
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["teachers"],
    queryFn: () => getData("/api/v1/teachers"),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const list = data?.data ?? [];

  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionTitle
          eyebrow="Meet your mentors"
          title="Guidance from"
          accent="the doers."
          description="Learn alongside people who care about your progress and bring practical experience into every lesson."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }, (_, i) => <TeacherSkeleton key={i} />)
          ) : isError ? (
            <ErrorState
              text="We couldn't load the instructors."
              onRetry={refetch}
              busy={isFetching}
            />
          ) : list.length ? (
            list.slice(0, 4).map((t, i) => (
              <motion.div
                key={t._id || i}
                {...fadeUp(reduceMotion, i * 0.06)}
                className="h-full"
              >
                <TeacherCard teacher={t} />
              </motion.div>
            ))
          ) : (
            <Empty text="Instructor profiles will be added soon." />
          )}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/teachers"
            className={`group inline-flex items-center gap-2 font-bold text-cyan-700 transition hover:text-cyan-900 ${FOCUS}`}
          >
            Meet all instructors
            <ArrowRight
              size={17}
              aria-hidden="true"
              className="transition group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================= CARD ================= */

function TeacherCard({ teacher }) {
  const name = teacher.name || "Instructor";

  return (
    <article className="group h-full overflow-hidden rounded-2xl border border-slate-100 bg-white text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl motion-reduce:hover:translate-y-0">
      <div
        className="h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500"
        aria-hidden="true"
      />

      <div className="p-5">
        <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-cyan-50 bg-gradient-to-br from-cyan-100 to-blue-100 text-2xl font-black text-cyan-700 ring-2 ring-cyan-200/60 transition group-hover:ring-cyan-400">
          {teacher.image ? (
            <img
              src={teacher.image}
              alt={name}
              loading="lazy"
              decoding="async"
              width={112}
              height={112}
              className="h-full w-full object-cover"
            />
          ) : (
            <span aria-hidden="true">{initials(name)}</span>
          )}
        </div>

        <h3 className="text-lg font-extrabold text-slate-900">{name}</h3>
        <p className="mt-2 text-sm font-semibold text-cyan-700">
          {teacher.designation || "Instructor"}
        </p>
        <p className="mt-1 text-xs text-slate-600">
          {teacher.department || "IT Academy"}
        </p>
      </div>
    </article>
  );
}

/* ================= STATES ================= */

function TeacherSkeleton() {
  return (
    <div
      className="rounded-2xl border border-slate-100 bg-white p-5"
      aria-hidden="true"
    >
      <div className="mx-auto mb-5 h-28 w-28 animate-pulse rounded-full bg-slate-100 motion-reduce:animate-none" />
      <div className="mx-auto h-5 w-2/3 animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />
      <div className="mx-auto mt-3 h-4 w-1/2 animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="col-span-full flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <p className="text-sm font-medium text-slate-600">{text}</p>
    </div>
  );
}

function ErrorState({ text, onRetry, busy }) {
  return (
    <div
      role="alert"
      className="col-span-full flex min-h-40 flex-col items-center justify-center gap-4 rounded-2xl border border-red-100 bg-red-50 p-8 text-center"
    >
      <p className="text-sm font-medium text-red-800">{text}</p>
      <button
        type="button"
        onClick={() => onRetry()}
        disabled={busy}
        className={`inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60 ${FOCUS}`}
      >
        <RefreshCw
          size={15}
          aria-hidden="true"
          className={busy ? "animate-spin" : ""}
        />
        {busy ? "Retrying…" : "Try again"}
      </button>
    </div>
  );
}

/* ================= HELPERS ================= */

function initials(name = "IT Academy") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}