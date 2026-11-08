import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarDays, ChevronRight, RefreshCw } from "lucide-react";

import { getData } from "../lib/api";

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

export default function HomeNotice() {
  const reduceMotion = useReducedMotion();

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["notices"],
    queryFn: () => getData("/api/v1/notices"),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const list = data?.data ?? [];

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-10">
        <motion.div {...fadeUp(reduceMotion)}>
          <h2 className="text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
            Latest news &amp;
            <br />
            <span className="text-cyan-600">notices.</span>
          </h2>

          <p className="mt-5 max-w-md leading-8 text-slate-600">
            Announcements and important updates from the academy.
          </p>

          <Link
            to="/notices"
            className={`mt-7 inline-flex items-center gap-2 font-bold text-cyan-700 transition hover:gap-4 ${FOCUS}`}
          >
            See all updates
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </motion.div>

        <ul className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }, (_, i) => <NoticeSkeleton key={i} />)
          ) : isError ? (
            <li>
              <ErrorState
                text="We couldn't load the notices."
                onRetry={refetch}
                busy={isFetching}
              />
            </li>
          ) : list.length ? (
            list.slice(0, 5).map((n, i) => (
              <motion.li key={n._id || i} {...fadeUp(reduceMotion, i * 0.05)}>
                <NoticeItem notice={n} featured={i === 0} />
              </motion.li>
            ))
          ) : (
            <li>
              <Empty text="No notices right now." />
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}

/* ================= ITEM ================= */

function NoticeItem({ notice, featured }) {
  const date = formatDate(notice.createdAt);
  const to = notice._id ? `/notices/${notice._id}` : "/notices";

  return (
    <Link
      to={to}
      className={`group flex items-center gap-4 rounded-2xl border bg-slate-50 p-5 transition hover:border-cyan-200 hover:bg-cyan-50/50 ${FOCUS} ${
        featured
          ? "border-cyan-200 border-l-4 border-l-cyan-500"
          : "border-slate-100"
      }`}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-700 shadow-sm">
        <CalendarDays size={18} aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="mb-1 flex items-center gap-2 text-xs font-semibold text-cyan-700">
          {date ? (
            <time dateTime={notice.createdAt}>{date}</time>
          ) : (
            "Academy update"
          )}
          {featured && (
            <span className="rounded-full bg-cyan-600 px-2 py-0.5 text-[11px] font-bold text-white">
              Latest
            </span>
          )}
        </span>
        <span className="line-clamp-2 font-bold text-slate-800 transition group-hover:text-cyan-700">
          {notice.title}
        </span>
      </span>

      <ChevronRight
        size={20}
        aria-hidden="true"
        className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-cyan-600"
      />
    </Link>
  );
}

/* ================= STATES ================= */

function NoticeSkeleton() {
  return (
    <li
      aria-hidden="true"
      className="h-[86px] animate-pulse rounded-2xl bg-slate-100 motion-reduce:animate-none"
    />
  );
}

function Empty({ text }) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <p className="text-sm font-medium text-slate-600">{text}</p>
    </div>
  );
}

function ErrorState({ text, onRetry, busy }) {
  return (
    <div
      role="alert"
      className="flex min-h-40 flex-col items-center justify-center gap-4 rounded-2xl border border-red-100 bg-red-50 p-8 text-center"
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

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}