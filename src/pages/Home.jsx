import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Award,
  BookOpen,
 
  Clock3,
  Code2,
  GraduationCap,
  RefreshCw,
  Users,
} from "lucide-react";

import { getData } from "../lib/api";
import SectionTitle from "../components/SectionTitle";
import CommunityNetwork from "../components/CommunityNetwork";
import About from "./About";
import Hero from "./Hero";
import HomeTeacher from "../components/HomeTeacher";
import HomeNotice from "../components/HomeNotice";

/* ================= CONSTANTS ================= */

const BENEFITS = [
  { icon: BookOpen, title: "Learn with purpose" },
  { icon: Code2, title: "Practice real projects" },
  { icon: Users, title: "Grow with mentors" },
  { icon: Award, title: "Build your future" },
];

// A real sequence, so numbering is meaningful here.
const STEPS = [
  {
    title: "Pick a course",
    text: "Browse the learning paths and choose the one that fits your goal.",
  },
  {
    title: "Learn with mentors",
    text: "Follow structured lessons with instructors who guide every step.",
  },
  {
    title: "Build real projects",
    text: "Put each lesson into practice with hands-on work.",
  },
  {
    title: "Show your skills",
    text: "Finish with projects you can share with employers and clients.",
  },
];

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2";

const EASE = [0.22, 1, 0.36, 1];

/* ================= DATA HOOK ================= */

function useList(key, path) {
  const query = useQuery({
    queryKey: [key],
    queryFn: () => getData(path),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  return { ...query, list: query.data?.data ?? [] };
}

/* ================= MOTION HELPERS ================= */

const fadeUp = (reduceMotion, delay = 0) =>
  reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.55, delay, ease: EASE },
      };

const staggerContainer = (reduceMotion) =>
  reduceMotion
    ? {}
    : {
        initial: "hidden",
        whileInView: "show",
        viewport: { once: true, margin: "-60px" },
        variants: {
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } },
        },
      };

const staggerItem = (reduceMotion) =>
  reduceMotion
    ? {}
    : {
        variants: {
          hidden: { opacity: 0, y: 18 },
          show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.45, ease: EASE },
          },
        },
      };

/* ================= PAGE ================= */

export default function Home() {
  const courses = useList("courses", "/api/v1/courses");
  const notices = useList("notices", "/api/v1/notices");
  const teachers = useList("teachers", "/api/v1/teachers");
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.2,
  });

  return (
    <main className="overflow-hidden bg-white text-slate-900">
      {/* Reading progress */}
      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-400"
        />
      )}

      {/* ================= HERO ================= */}
      <Hero />

      {/* ================= BENEFITS ================= */}
      <section
        aria-label="Why learn here"
        className="border-b border-slate-100 bg-slate-50"
      >
        <motion.ul
          {...staggerContainer(reduceMotion)}
          className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-5 py-8 sm:px-8 md:grid-cols-4 lg:px-10"
        >
          {BENEFITS.map(({ icon: Icon, title }) => (
            <motion.li
              key={title}
              {...staggerItem(reduceMotion)}
              className="flex items-center gap-3"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                <Icon size={21} aria-hidden="true" />
              </span>
              <span className="text-sm font-bold text-slate-800">{title}</span>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      {/* ================= COURSES ================= */}
      <section id="courses" className="scroll-mt-20 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionTitle
            eyebrow="What you can learn"
            title="Skills that open"
            accent="new doors."
            description="Explore focused learning paths designed to help you create, solve problems, and make your next move."
          />

          <div className="mt-12 grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
            {courses.isLoading ? (
              Array.from({ length: 3 }, (_, i) => <CourseSkeleton key={i} />)
            ) : courses.isError ? (
              <ErrorState
                text="We couldn't load the courses."
                onRetry={courses.refetch}
                busy={courses.isFetching}
              />
            ) : courses.list.length ? (
              courses.list.slice(0, 6).map((course, i) => (
                <motion.div
                  key={course._id || course.slug || i}
                  {...fadeUp(reduceMotion, (i % 3) * 0.06)}
                  className="h-full"
                >
                  <CourseCard course={course} />
                </motion.div>
              ))
            ) : (
              <Empty text="No courses are published yet. Check back soon." />
            )}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/courses"
              className={`group inline-flex items-center gap-3 rounded-xl border border-slate-200 px-7 py-3.5 font-bold text-slate-800 transition hover:border-cyan-500 hover:bg-cyan-50 hover:text-cyan-700 ${FOCUS}`}
            >
              View all courses
              <ArrowRight
                size={17}
                aria-hidden="true"
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <About />

      {/* ================= HOW IT WORKS ================= */}
      <section
        aria-labelledby="steps-title"
        className="bg-slate-50 py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <motion.div
            {...fadeUp(reduceMotion)}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="mb-3 text-sm font-semibold text-cyan-700">
              How it works
            </p>
            <h2
              id="steps-title"
              className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl"
            >
              From first lesson to finished project
            </h2>
          </motion.div>

          <ol className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
            {/* connecting line, drawn once when scrolled into view */}
            <motion.div
              aria-hidden="true"
              {...(reduceMotion
                ? {}
                : {
                    initial: { scaleX: 0 },
                    whileInView: { scaleX: 1 },
                    viewport: { once: true, margin: "-80px" },
                    transition: { duration: 1.1, ease: EASE },
                  })}
              className="absolute left-[12.5%] right-[12.5%] top-6 hidden h-0.5 origin-left bg-gradient-to-r from-cyan-400 to-blue-500 md:block"
            />

            {STEPS.map((s, i) => (
              <motion.li
                key={s.title}
                {...fadeUp(reduceMotion, i * 0.1)}
                className="relative flex flex-col items-center text-center"
              >
                <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-slate-50 bg-slate-900 text-base font-black text-cyan-300 shadow-lg">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-slate-900">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-[16rem] text-sm leading-6 text-slate-600">
                  {s.text}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= COMMUNITY NETWORK ================= */}
      <CommunityNetwork />

      {/* ================= TEACHERS ================= */}

      <HomeTeacher />
      {/* ================= NOTICES ================= */}
      <HomeNotice />
      {/* ================= CTA ================= */}
      <section
        aria-labelledby="cta-title"
        className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 py-16 text-white sm:py-20"
      >
        <div
          className="absolute -right-20 -top-32 h-96 w-96 rounded-full border-[60px] border-white/5"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full border-[60px] border-white/5"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 px-5 sm:px-8 md:flex-row md:items-center lg:px-10">
          <motion.div {...fadeUp(reduceMotion)}>
            <h2
              id="cta-title"
              className="text-4xl font-black leading-tight sm:text-5xl"
            >
              Your future is a
              <br />
              <span className="text-cyan-200">skill away.</span>
            </h2>

            <p className="mt-4 max-w-lg leading-7 text-blue-100">
              Pick a course that fits your goals and start building today.
            </p>
          </motion.div>

          <motion.div {...fadeUp(reduceMotion, 0.1)}>
            <Link
              to="/courses"
              className={`group inline-flex shrink-0 items-center gap-3 rounded-xl bg-blue-300 px-7 py-4 font-bold text-blue-800 shadow-xl transition hover:bg-blue-500 focus-visible:ring-offset-blue-700 ${FOCUS}`}
            >
              Find your course
              <ArrowUpRight
                size={19}
                aria-hidden="true"
                className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </motion.div>
        </div>
      </section>

      <BackToTop reduceMotion={reduceMotion} />
    </main>
  );
}

/* ================= CARDS ================= */

function CourseCard({ course }) {
  const { title, banner, descriptions, duration, fee, slug } = course;

  const feeText =
    fee == null || fee === ""
      ? "Contact us"
      : Number(fee) === 0
        ? "Free"
        : `৳ ${Number(fee).toLocaleString("en-BD")}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-900/10 motion-reduce:hover:translate-y-0">
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700 sm:h-56">
        <div
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <GraduationCap size={65} className="text-white/30" />
        </div>

        {banner && (
          <img
            src={banner}
            alt=""
            loading="lazy"
            decoding="async"
            width={640}
            height={360}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-900 shadow">
          {feeText}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="line-clamp-2 text-xl font-extrabold leading-snug text-slate-900">
          {title}
        </h3>

        <p className="mt-3 line-clamp-3 min-h-[72px] text-sm leading-6 text-slate-600">
          {descriptions ||
            "A practical learning path to help you build useful, in-demand skills."}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-100 py-4">
          <Meta
            icon={<Clock3 size={16} />}
            tone="bg-cyan-50 text-cyan-700"
            label="Duration"
            value={duration || "Flexible"}
          />
          <Meta
            icon={<GraduationCap size={16} />}
            tone="bg-blue-50 text-blue-700"
            label="Fee"
            value={feeText}
          />
        </dl>

        <div className="mt-auto pt-5">
          <Link
            to={`/courses/${slug}`}
            aria-label={`View course: ${title}`}
            className={`flex w-full items-center justify-between rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-cyan-700 ${FOCUS}`}
          >
            View course
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ================= SMALL PIECES ================= */

function BackToTop({ reduceMotion }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
      }
      className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl transition hover:bg-cyan-600 ${FOCUS}`}
    >
      <ArrowUp size={20} aria-hidden="true" />
    </button>
  );
}

function Meta({ icon, tone, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`rounded-lg p-2 ${tone}`} aria-hidden="true">
        {icon}
      </div>
      <div className="min-w-0">
        <dt className="text-xs font-semibold text-slate-500">{label}</dt>
        <dd className="truncate text-xs font-bold text-slate-800">{value}</dd>
      </div>
    </div>
  );
}

/* ================= STATES ================= */

function CourseSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
      aria-hidden="true"
    >
      <div className="h-52 animate-pulse bg-slate-100 motion-reduce:animate-none sm:h-56" />
      <div className="space-y-3 p-6">
        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />
        <div className="mt-6 h-12 animate-pulse rounded-xl bg-slate-100 motion-reduce:animate-none" />
      </div>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="col-span-full flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
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
