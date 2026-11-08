import { useState } from "react";
import {
  Search,
  AlertCircle,
  GraduationCap,
  Award,
  UserRound,
  BookOpen,
  CalendarDays,
  Hash,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://itbackend-1.onrender.com";

export default function Results() {
  const [roll, setRoll] = useState("");
  const [message, setMessage] = useState(
    "Enter your roll number to search published results."
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  async function submit(event) {
    event.preventDefault();

    const normalizedRoll = roll.trim();
    if (!normalizedRoll) return;

    setLoading(true);
    setResult(null);
    setSearched(true);
    setMessage("Searching published results...");

    try {
      const response = await fetch(
        `${API_BASE}/api/v1/results?rollNumber=${encodeURIComponent(
          normalizedRoll
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Result lookup is not available."
        );
      }

      const list = Array.isArray(data.data)
        ? data.data
        : [data.data].filter(Boolean);

      const found = list.find(
        (item) =>
          String(item.rollNumber).toLowerCase() ===
          normalizedRoll.toLowerCase()
      );

      if (!found) {
        throw new Error(
          "No published result found for this roll number."
        );
      }

      setResult(found);
      setMessage("Your result has been found successfully.");
    } catch (error) {
      setMessage(
        String(error.message || "").includes("404")
          ? "Result endpoint is not configured in the backend yet. Please contact the academy."
          : error.message || "Unable to check result. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const gradeColor = result?.grade
    ? ["A+", "A", "A-"].includes(String(result.grade).toUpperCase())
      ? "text-emerald-600 bg-emerald-50"
      : String(result.grade).toUpperCase() === "F"
        ? "text-red-600 bg-red-50"
        : "text-cyan-700 bg-cyan-50"
    : "text-cyan-700 bg-cyan-50";

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 pb-16 pt-8 sm:pt-12">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          {/* LEFT CONTENT */}
          <section>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-[10px] font-extrabold tracking-[0.18em] text-cyan-700">
              <Award size={15} />
              YOUR ACHIEVEMENT, VERIFIED
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Check your
              <br />
              <span className="bg-gradient-to-r from-cyan-500 to-blue-700 bg-clip-text text-transparent">
                result.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-8 text-slate-500">
              Your hard work deserves recognition. Enter your student roll
              number to securely look up your published academic result.
            </p>

            <div className="mt-8 grid max-w-md grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                  <GraduationCap size={20} />
                </div>

                <p className="mt-3 text-sm font-extrabold text-slate-800">
                  Official Results
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Published by the academy
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <CheckCircle2 size={20} />
                </div>

                <p className="mt-3 text-sm font-extrabold text-slate-800">
                  Quick Lookup
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Search with your roll number
                </p>
              </div>
            </div>
          </section>

          {/* RESULT SEARCH PANEL */}
          <section className="relative">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
              <div className="bg-[#071426] px-5 py-6 text-white sm:px-8 sm:py-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400 text-slate-950">
                    <Search size={22} />
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold tracking-[0.18em] text-cyan-300">
                      STUDENT PORTAL
                    </p>

                    <h2 className="mt-1 text-xl font-black">
                      Result lookup
                    </h2>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-300">
                  Use the exact roll number provided by IT Academy.
                </p>
              </div>

              <form onSubmit={submit} className="p-5 sm:p-8">
                <label
                  htmlFor="student-roll"
                  className="mb-2 block text-xs font-extrabold tracking-[0.12em] text-slate-700"
                >
                  STUDENT ROLL NUMBER
                </label>

                <div className="relative">
                  <Hash
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="student-roll"
                    value={roll}
                    onChange={(event) => setRoll(event.target.value)}
                    placeholder="e.g. IT-2025-001"
                    required
                    autoComplete="off"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-4 pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !roll.trim()}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <Search size={18} />
                  )}

                  {loading ? "Checking result..." : "Check My Result"}
                </button>

                <div
                  className={`mt-5 flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${
                    result
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : searched
                        ? "border-amber-200 bg-amber-50 text-amber-800"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                  }`}
                >
                  {result ? (
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  )}

                  <p>{message}</p>
                </div>
              </form>
            </div>
          </section>
        </div>

        {/* RESULT DETAILS */}
        {result && (
          <section className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
            <div className="flex flex-col gap-4 bg-gradient-to-r from-[#071426] to-[#12345a] px-5 py-6 text-white sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-extrabold tracking-[0.18em] text-cyan-300">
                  <Award size={15} />
                  RESULT PUBLISHED
                </div>

                <h2 className="mt-2 text-2xl font-black">
                  Congratulations, {result.studentName || "Student"}!
                </h2>

                <p className="mt-1 text-sm text-slate-300">
                  Your academic result details are shown below.
                </p>
              </div>

              <div
                className={`inline-flex w-fit items-center gap-2 rounded-xl px-5 py-3 text-sm font-black ${gradeColor}`}
              >
                <Award size={18} />
                Grade {result.grade || "—"}
              </div>
            </div>

            <div className="grid gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-4">
              <ResultItem
                icon={<UserRound size={18} />}
                label="Student Name"
                value={result.studentName}
              />

              <ResultItem
                icon={<Hash size={18} />}
                label="Roll Number"
                value={result.rollNumber}
              />

              <ResultItem
                icon={<BookOpen size={18} />}
                label="Course"
                value={result.courseCategory}
              />

              <ResultItem
                icon={<CalendarDays size={18} />}
                label="Passing Year"
                value={result.passingYear}
              />
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-8">
              <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5">
                <p className="text-xs font-extrabold tracking-wider text-cyan-700">
                  TOTAL MARKS
                </p>

                <p className="mt-2 text-4xl font-black text-slate-900">
                  {result.marks ?? "—"}
                  <span className="ml-1 text-lg font-bold text-slate-400">
                    / 100
                  </span>
                </p>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <p className="text-xs font-extrabold tracking-wider text-blue-700">
                  FINAL GRADE
                </p>

                <p className="mt-2 text-4xl font-black text-slate-900">
                  {result.grade || "—"}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function ResultItem({ icon, label, value }) {
  return (
    <div className="bg-white p-5 sm:p-6">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
        {icon}
      </div>

      <p className="mt-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-bold text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
}