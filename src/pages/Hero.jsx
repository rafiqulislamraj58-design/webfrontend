
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Code2,
  GraduationCap,
  Sparkles,
  Users,
  CheckCircle2,
} from "lucide-react";

import { getData } from "../lib/api";

/* ================= CONFIG ================= */

const PHOTO = "/608737054_122119051137029713_2815328995210124818_n.jpg";

const EASE = [0.22, 1, 0.36, 1];

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#071426]";

/* ================= DATA ================= */

function useHomeList(key, path) {
  const query = useQuery({
    queryKey: [key],
    queryFn: () => getData(path),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    list: query.data?.data ?? [],
  };
}

/* ================= ANIMATION ================= */

const reveal = (reduceMotion, delay = 0) =>
  reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        animate: { opacity: 1, y: 0 },
        transition: {
          duration: 0.7,
          delay,
          ease: EASE,
        },
      };

/* ================= HERO ================= */

export default function Hero() {
  const reduceMotion = useReducedMotion();

  const courses = useHomeList("courses", "/api/v1/courses");
  const teachers = useHomeList("teachers", "/api/v1/teachers");
  const notices = useHomeList("notices", "/api/v1/notices");

  const courseTitles = courses.list
    .map((course) => course.title)
    .filter(Boolean);

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-[#071426] text-white"
    >
      {/* Background */}

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[120px]" />

        <div className="absolute -bottom-52 right-0 h-[550px] w-[550px] rounded-full bg-blue-600/20 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "45px 45px",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#071426] to-transparent" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-24 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:px-10 lg:pb-24 lg:pt-28">

        {/* ================= LEFT CONTENT ================= */}

        <motion.div
          {...reveal(reduceMotion)}
          className="relative z-10"
        >
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-300 shadow-lg shadow-cyan-950/20">
            <Sparkles size={15} />
            Welcome to IT Academy
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </div>

          <h1
            id="hero-title"
            className="max-w-2xl text-balance text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl md:text-6xl xl:text-[66px]"
          >
            Learn today.
            <br />

            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Lead tomorrow.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
            Build your future with practical IT education, experienced
            mentors, real-world projects, and a community that supports
            your journey at every step.
          </p>

          {/* Highlights */}

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
            {[
              "Practical learning",
              "Expert instructors",
              "Career-focused skills",
            ].map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-300"
              >
                <CheckCircle2
                  size={16}
                  className="text-cyan-400"
                />
                {item}
              </span>
            ))}
          </div>

          {/* CTA */}

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/courses"
              className={`group inline-flex items-center justify-center gap-3 rounded-xl bg-cyan-400 px-7 py-4 font-bold text-slate-950 shadow-xl shadow-cyan-500/20 transition duration-300 hover:-translate-y-1 hover:bg-cyan-300 ${FOCUS}`}
            >
              Explore Courses

              <ArrowUpRight
                size={19}
                className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>

            <a
              href="#about"
              className={`inline-flex items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur transition hover:border-cyan-300/50 hover:bg-white/10 ${FOCUS}`}
            >
              About Academy

              <ArrowRight size={17} />
            </a>
          </div>

          {/* Statistics */}

          <div className="mt-12 grid max-w-lg grid-cols-3 border-t border-white/10 pt-7">
            <Stat
              icon={<BookOpen size={17} />}
              label="Courses"
              value={courses.list.length}
              loading={courses.isLoading}
            />

            <Stat
              icon={<GraduationCap size={18} />}
              label="Instructors"
              value={teachers.list.length}
              loading={teachers.isLoading}
            />

            <Stat
              icon={<Users size={17} />}
              label="Updates"
              value={notices.list.length}
              loading={notices.isLoading}
            />
          </div>
        </motion.div>

        {/* ================= RIGHT IMAGE ================= */}

        <motion.div
          {...reveal(reduceMotion, 0.15)}
          className="relative mx-auto w-full max-w-2xl"
        >
          {/* Glow */}

          <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-cyan-400/20 via-blue-500/10 to-fuchsia-500/20 blur-2xl" />

          {/* Image frame */}

          <div className="group relative rounded-[2rem] border border-white/15 bg-white/10 p-2.5 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-3">

            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-slate-800">

              <img
                src={PHOTO}
                alt="IT Academy students together with their learning program backpacks"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.04] motion-reduce:transition-none"
              />

              {/* Image overlay */}

              <div className="absolute inset-0 bg-gradient-to-t from-[#071426]/90 via-[#071426]/10 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Our Learning Community
                </div>

                <h2 className="max-w-md text-2xl font-black leading-tight text-white sm:text-3xl">
                  Together we learn.
                  <br />
                  Together we grow.
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-200">
                  Empowering students through education, opportunity
                  and practical skills.
                </p>
              </div>
            </div>
          </div>

          {/* Floating community card */}

          <motion.div
            animate={
              reduceMotion
                ? undefined
                : { y: [0, -9, 0] }
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -left-3 top-8 flex items-center gap-3 rounded-2xl border border-white/15 bg-[#10243c]/95 p-3 shadow-2xl backdrop-blur-xl sm:-left-9 sm:p-4"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-300">
              <Users size={22} />
            </div>

            <div>
              <p className="text-sm font-extrabold text-white">
                Student Community
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                Learn together
              </p>
            </div>
          </motion.div>

          {/* Floating progress card */}

          <motion.div
            animate={
              reduceMotion
                ? undefined
                : { y: [0, 8, 0] }
            }
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-5 right-2 flex items-center gap-3 rounded-2xl border border-white/15 bg-[#10243c]/95 p-3 shadow-2xl backdrop-blur-xl sm:-right-7 sm:p-4"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-400/15 text-blue-300">
              <GraduationCap size={23} />
            </div>

            <div>
              <p className="text-sm font-extrabold text-white">
                Skills for the future
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                Start your journey today
              </p>
            </div>
          </motion.div>

          {/* Decorative badge */}

          <div className="absolute -right-2 -top-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400 text-slate-950 shadow-xl shadow-cyan-500/20 sm:-right-5 sm:-top-6 sm:h-16 sm:w-16">
            <Code2 size={29} />
          </div>
        </motion.div>
      </div>

      {/* ================= COURSE MARQUEE ================= */}

      {courseTitles.length > 0 && (
        <CourseMarquee titles={courseTitles} />
      )}
    </section>
  );
}

/* ================= STAT ================= */

function Stat({ icon, label, value, loading }) {
  return (
    <div className="min-w-0 pr-2">
      <div className="mb-2 flex items-center gap-2 text-cyan-300">
        {icon}
        <dt className="truncate text-xs font-semibold text-slate-400 sm:text-sm">
          {label}
        </dt>
      </div>

      <dd className="text-2xl font-black text-white sm:text-3xl">
        {loading ? (
          <span className="inline-block h-8 w-10 animate-pulse rounded bg-white/10 motion-reduce:animate-none" />
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

/* ================= COURSE MARQUEE ================= */

function CourseMarquee({ titles }) {
  const base =
    titles.length < 6
      ? [...titles, ...titles, ...titles]
      : titles;

  const items = [...base, ...base];

  return (
    <div
      aria-label="Available courses"
      className="overflow-hidden border-t border-white/10 bg-[#050f1d] py-4"
    >
      <style>{`
        @keyframes academy-marquee {
          to { transform: translateX(-50%); }
        }

        .academy-marquee {
          animation: academy-marquee 45s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .academy-marquee { animation: none; }
        }
      `}</style>

      <div className="academy-marquee flex w-max items-center gap-10 whitespace-nowrap text-sm font-semibold text-slate-400">
        {items.map((title, index) => (
          <span
            key={`${title}-${index}`}
            className="inline-flex items-center gap-10"
          >
            {title}
            <Sparkles
              size={14}
              className="text-cyan-400/70"
            />
          </span>
        ))}
      </div>
    </div>
  );
}
