import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Routes, Route, NavLink, Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  Megaphone,
  LayoutDashboard,
  LogOut,
  Plus,
  GraduationCap,
  ChartNoAxesColumnIncreasing,
  PieChart as PieChartIcon,
  UserRound,
  Search,
  CheckCircle2,
  AlertTriangle,
  ImagePlus,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getData, postData, patchData, deleteData } from "../lib/api";
import { useAuth } from "../context/AuthContext";

/* ================= TAILWIND TOKENS (no custom CSS needed) ================= */

const BLUES = ["#1e40af", "#2563eb", "#38bdf8", "#93c5fd"];

const ring =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2";

const btnBase = `inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${ring}`;
const btnPrimary = `${btnBase} bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-md shadow-blue-600/25 hover:brightness-110`;
const btnOutline = `${btnBase} border border-blue-200 bg-white text-blue-800 hover:border-blue-500 hover:bg-blue-50`;

const card = "rounded-2xl border border-blue-100 bg-white p-5 shadow-sm shadow-blue-900/5";
const inputCls =
  "w-full rounded-lg border border-blue-200 bg-blue-50/40 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200";

/* ================= DATA HELPERS ================= */

function extractList(response) {
  const payload = response?.data?.data ?? response?.data ?? response;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function useResource(key, path) {
  return useQuery({
    queryKey: [key],
    queryFn: () => getData(path),
    select: extractList,
  });
}

/* ================= SHELL ================= */

const NAV = [
  { to: "/admin", end: true, icon: LayoutDashboard, label: "Overview" },
  { to: "/admin/courses", icon: BookOpen, label: "Courses" },
  { to: "/admin/teachers", icon: Users, label: "Teachers" },
  { to: "/admin/notices", icon: Megaphone, label: "Notices" },
  { to: "/admin/results", icon: GraduationCap, label: "Results" },
  { to: "/admin/account", icon: UserRound, label: "Account" },
];

export default function Admin() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_1fr]">
        {/* ---------- Sidebar ---------- */}
        <aside className="self-start rounded-2xl bg-gradient-to-b from-[#0b1f4d] to-[#12338a] p-4 text-blue-100 shadow-xl shadow-blue-900/30 lg:sticky lg:top-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-300 to-blue-600 text-lg font-black text-white">
              {(user?.name || "A")[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <b className="block truncate text-sm text-white">{user?.name || "Administrator"}</b>
              <small className="block truncate text-xs text-blue-200/80">
                {user?.role || "Admin account"}
              </small>
            </div>
          </div>

          <p className="mb-2 mt-4 px-3 text-[11px] font-bold tracking-[0.14em] text-blue-300/70">
            WORKSPACE
          </p>

          <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {NAV.map(({ to, end, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
                    isActive
                      ? "bg-white/20 text-blue-800 shadow-lg shadow-black/20"
                      : "text-black hover:bg-blue-800 "
                  }`
                }
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </NavLink>
            ))}

            <button
              type="button"
              onClick={logout}
              className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-500/15 hover:text-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 lg:mt-3"
            >
              <LogOut size={18} aria-hidden="true" /> Sign out
            </button>
          </nav>
        </aside>

        {/* ---------- Content ---------- */}
        <section className="min-w-0">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<Manage type="courses" />} />
            <Route path="teachers" element={<Manage type="teachers" />} />
            <Route path="notices" element={<Manage type="notices" />} />
            <Route path="results" element={<Manage type="results" />} />
            <Route path="account" element={<Account />} />
          </Routes>
        </section>
      </div>
    </main>
  );
}

function Heading({ eyebrow, title, text, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold tracking-[0.14em] text-blue-600">{eyebrow}</p>
        <h1 className="mt-1 text-3xl font-black text-[#0b1f4d]">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{text}</p>
      </div>
      {action}
    </div>
  );
}

/* ================= DASHBOARD ================= */

function Dashboard() {
  const c = useResource("courses", "/api/v1/courses"),
    t = useResource("teachers", "/api/v1/teachers"),
    n = useResource("notices", "/api/v1/notices"),
    r = useResource("results", "/api/v1/results");

  const apiIssue = c.isError || t.isError || n.isError || r.isError;
  const apiLoading = c.isLoading || t.isLoading || n.isLoading || r.isLoading;

  const data = [
    { name: "Courses", count: c.data?.length || 0 },
    { name: "Teachers", count: t.data?.length || 0 },
    { name: "Notices", count: n.data?.length || 0 },
    { name: "Results", count: r.data?.length || 0 },
  ];
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <>
      <Heading
        eyebrow="YOUR WORKSPACE"
        title="Dashboard"
        text="Here’s what’s happening at your academy."
        action={
          <Link to="/" className={btnOutline}>
            View website ↗
          </Link>
        }
      />

      {/* API status */}
      <div
        role="status"
        className={`mb-5 flex flex-wrap items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${
          apiIssue
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-blue-200 bg-blue-50 text-blue-800"
        }`}
      >
        {apiIssue ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
        {apiLoading
          ? "Connecting to academy API…"
          : apiIssue
            ? "Some API endpoints need attention"
            : "Academy API data loaded"}
        <span className="ml-auto text-xs font-bold">
          {apiIssue ? "Check connection" : "Live API data"}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={<BookOpen size={20} />} label="Published courses" value={c.data?.length ?? "—"} />
        <Stat icon={<Users size={20} />} label="Instructors" value={t.data?.length ?? "—"} />
        <Stat icon={<Megaphone size={20} />} label="Notices" value={n.data?.length ?? "—"} />
        <Stat icon={<GraduationCap size={20} />} label="Results" value={r.data?.length ?? "—"} />
      </div>

      {/* Charts */}
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        {/* Bar */}
        <div className={card}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-[#0b1f4d]">Academy overview</h3>
              <p className="text-sm text-slate-500">Live records loaded from your backend</p>
            </div>
            <ChartNoAxesColumnIncreasing className="text-blue-600" aria-hidden="true" />
          </div>

          <div className="mt-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbe5f6" />
                <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: "#475569", fontSize: 12 }} />
                <Tooltip cursor={{ fill: "rgba(37,99,235,0.08)" }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {data.map((d, i) => (
                    <Cell key={d.name} fill={BLUES[i % BLUES.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie / donut */}
        <div className={card}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-[#0b1f4d]">Content breakdown</h3>
              <p className="text-sm text-slate-500">Share of each record type</p>
            </div>
            <PieChartIcon className="text-blue-600" aria-hidden="true" />
          </div>

          <div className="relative mt-4 h-[300px]">
            {total === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                {apiLoading ? "Loading data…" : "No records yet"}
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="count"
                      nameKey="name"
                      innerRadius="58%"
                      outerRadius="86%"
                      paddingAngle={3}
                      stroke="#fff"
                      strokeWidth={2}
                    >
                      {data.map((d, i) => (
                        <Cell key={d.name} fill={BLUES[i % BLUES.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [
                        `${value} (${Math.round((value / total) * 100)}%)`,
                        name,
                      ]}
                    />
                    <Legend verticalAlign="bottom" iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>

                {/* total in the donut hole (nudged up to clear the legend) */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-[calc(50%-18px)] flex -translate-y-1/2 flex-col items-center"
                >
                  <b className="text-3xl font-black leading-none text-[#0b1f4d]">{total}</b>
                  <small className="mt-1 text-xs text-slate-500">Total</small>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm shadow-blue-900/5">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </span>
      <div>
        <b className="block text-2xl font-black leading-none text-[#0b1f4d]">{value}</b>
        <small className="mt-1 block text-xs font-medium text-slate-500">{label}</small>
      </div>
    </div>
  );
}

/* ================= CONFIG ================= */

const configs = {
  courses: {
    title: "Courses",
    path: "/api/v1/admin/courses",
    publicPath: "/api/v1/courses",
    imageField: "banner",
    fields: ["title", "slug", "descriptions", "duration", "curriculum", "fee", "status"],
    schema: z.object({
      title: z.string().min(2),
      slug: z.string().min(2),
      descriptions: z.string().min(5),
      duration: z.string().min(1),
      curriculum: z.string().min(2),
      fee: z.coerce.number().min(0),
      status: z.enum(["draft", "published"]),
    }),
    empty: { title: "", slug: "", descriptions: "", duration: "", curriculum: "", fee: 0, status: "published" },
  },
  notices: {
    title: "Notices",
    path: "/api/v1/admin/notices",
    publicPath: "/api/v1/notices",
    imageField: "image",
    fields: ["title", "slug", "description", "status"],
    schema: z.object({
      title: z.string().min(2),
      slug: z.string().min(2),
      description: z.string().optional(),
      status: z.enum(["draft", "published"]),
    }),
    empty: { title: "", slug: "", description: "", status: "published" },
  },
  teachers: {
    title: "Teachers",
    imageField: "image",
    path: "/api/v1/admin/teachers",
    publicPath: "/api/v1/teachers",
    fields: ["name", "designation", "department", "email", "phone"],
    schema: z.object({
      name: z.string().min(2),
      designation: z.string().min(2),
      department: z.string().min(2),
      email: z.string().email(),
      phone: z.string().min(5),
    }),
    empty: { name: "", designation: "", department: "", email: "", phone: "" },
  },
  results: {
    title: "Results",
    imageField: null,
    path: "/api/v1/admin/results",
    publicPath: "/api/v1/results",
    fields: ["studentName", "rollNumber", "courseCategory", "passingYear", "marks", "status"],
    schema: z.object({
      studentName: z.string().min(2, "Student name is required"),
      rollNumber: z.string().min(2, "Roll number is required"),
      courseCategory: z.enum(["Web Development", "Graphic Design", "Digital Marketing"]),
      passingYear: z.coerce.number().min(2000).max(new Date().getFullYear()),
      marks: z.coerce.number().min(0).max(100),
      status: z.enum(["draft", "published"]),
    }),
    empty: { studentName: "", rollNumber: "", courseCategory: "Web Development", passingYear: new Date().getFullYear(), marks: 0, status: "published" },
  },
};

function labelize(str) {
  // courseCategory -> Course Category
  const spaced = str.replace(/([A-Z])/g, " $1");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/* ================= MANAGE (list + form) ================= */

function Manage({ type }) {
  const cfg = configs[type],
    qc = useQueryClient(),
    q = useQuery({
      queryKey: [type],
      queryFn: () => getData(cfg.publicPath),
      select: extractList,
    });
  const [editing, setEditing] = useState(null),
    [show, setShow] = useState(false),
    [error, setError] = useState(""),
    [search, setSearch] = useState(""),
    [imageFile, setImageFile] = useState(null),
    [imagePreview, setImagePreview] = useState("");

  const form = useForm({
    resolver: zodResolver(cfg.schema),
    defaultValues: cfg.empty,
  });

  const singular = type === "results" ? "Result" : type.slice(0, -1);

  const save = useMutation({
    mutationFn: async (values) => {
      if (cfg.imageField) {
        const payload = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (value !== undefined && value !== null) payload.append(key, String(value));
        });
        if (imageFile) payload.append(cfg.imageField, imageFile);
        if (editing) return patchData(`${cfg.path}/${editing._id}`, payload);
        return postData(cfg.path, payload);
      }
      // Results / JSON data without images
      if (editing) return patchData(`${cfg.path}/${editing._id}`, values);
      return postData(cfg.path, values);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [type] });
      setShow(false);
      setEditing(null);
      form.reset(cfg.empty);
      setError("");
      setImageFile(null);
      setImagePreview("");
    },
    onError: (e) => setError(e.response?.data?.message || e.message),
  });

  const remove = useMutation({
    mutationFn: (id) => deleteData(`${cfg.path}/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: [type] }),
    onError: (e) => setError(e.response?.data?.message || e.message),
  });

  function open(item = null) {
    setEditing(item);
    form.reset(
      item
        ? Object.fromEntries(cfg.fields.map((k) => [k, item[k] ?? cfg.empty[k] ?? ""]))
        : cfg.empty,
    );
    setError("");
    setImageFile(null);
    setImagePreview(item?.[cfg.imageField] || "");
    setShow(true);
  }

  const rows = (q.data || []).filter((row) =>
    cfg.fields.some((field) =>
      String(row[field] ?? "").toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const wide = ["descriptions", "description", "curriculum"];

  return (
    <>
      <Heading
        eyebrow="CONTENT MANAGEMENT"
        title={cfg.title}
        text={
          type === "teachers"
            ? "Add instructor profiles with a photo, designation and contact details."
            : type === "results"
              ? "Publish student results. Grades will be calculated automatically."
              : `Create, update and remove your academy ${type}.`
        }
        action={
          <button type="button" className={btnPrimary} onClick={() => open()}>
            <Plus size={16} aria-hidden="true" /> Add {singular}
          </button>
        }
      />

      {error && (
        <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* ---------- Form ---------- */}
      {show && (
        <form className={`${card} mb-6`} onSubmit={form.handleSubmit((v) => save.mutate(v))}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#0b1f4d]">
              {editing ? "Edit" : "Add"} {singular}
            </h3>
            <button
              type="button"
              aria-label="Close form"
              onClick={() => setShow(false)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-800 transition hover:bg-blue-100 ${ring}`}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {cfg.fields.map((f) => (
              <label
                key={f}
                className={`flex flex-col gap-1.5 text-sm font-semibold text-slate-700 ${
                  wide.includes(f) ? "sm:col-span-2" : ""
                }`}
              >
                {labelize(f)}

                {f === "status" ? (
                  <select className={inputCls} {...form.register(f)}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                ) : f === "courseCategory" ? (
                  <select className={inputCls} {...form.register(f)}>
                    <option value="Web Development">Web Development</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                  </select>
                ) : f === "description" || f === "descriptions" ? (
                  <textarea rows={4} className={inputCls} placeholder={labelize(f)} {...form.register(f)} />
                ) : (
                  <input
                    className={inputCls}
                    type={["fee", "marks", "passingYear"].includes(f) ? "number" : f === "email" ? "email" : "text"}
                    step={f === "fee" ? "any" : undefined}
                    placeholder={labelize(f)}
                    {...form.register(f)}
                  />
                )}

                {form.formState.errors[f] && (
                  <small className="text-xs font-medium text-red-600">
                    {form.formState.errors[f].message}
                  </small>
                )}
              </label>
            ))}
          </div>

          {/* ---------- Image upload ---------- */}
          {cfg.imageField && (
            <div className="mt-5">
              <input
                id={`${type}-image`}
                type="file"
                className="peer sr-only"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
                    setError("Choose an image file smaller than 5 MB.");
                    event.target.value = "";
                    return;
                  }
                  setError("");
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }}
              />
              <label
                htmlFor={`${type}-image`}
                className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/60 p-4 text-blue-800 transition hover:bg-blue-50 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-400"
              >
                <ImagePlus size={20} aria-hidden="true" />
                <span className="flex flex-col">
                  <b className="text-sm">
                    {type === "teachers"
                      ? "Teacher profile photo"
                      : type === "notices"
                        ? "Notice banner image"
                        : "Course banner image"}
                  </b>
                  <small className="text-xs text-blue-700/80">JPG, PNG or WEBP · maximum 5 MB</small>
                </span>
              </label>

              {imagePreview && (
                <div className="relative mt-3 inline-block">
                  <img
                    src={imagePreview}
                    alt="Selected upload preview"
                    className="h-24 w-24 rounded-xl border border-blue-100 object-cover"
                  />
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                      const input = document.getElementById(`${type}-image`);
                      if (input) input.value = "";
                    }}
                    className={`absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-700 text-white shadow transition hover:bg-blue-800 ${ring}`}
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" className={btnOutline} onClick={() => setShow(false)}>
              Cancel
            </button>
            <button type="submit" className={btnPrimary} disabled={save.isPending}>
              {save.isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      )}

      {/* ---------- Table ---------- */}
      <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm shadow-blue-900/5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 p-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 text-blue-400" size={16} aria-hidden="true" />
            <input
              type="text"
              aria-label={`Search ${type}`}
              placeholder={`Search ${type}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputCls} pl-9`}
            />
          </div>
          <span className="text-sm text-slate-500">{rows.length} entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-blue-100 bg-blue-50 text-xs uppercase text-blue-900/70">
              <tr>
                <th className="p-4">Title / Name</th>
                <th className="p-4">Status / Details</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-blue-50">
              {q.isLoading ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-400">
                    Loading records...
                  </td>
                </tr>
              ) : rows.length > 0 ? (
                rows.map((row) => (
                  <tr key={row._id} className="transition hover:bg-blue-50/50">
                    <td className="p-4 font-medium text-slate-900">
                      {/* flex lives on an inner div so the <td> stays a real table cell */}
                      <div className="flex items-center gap-3">
                        {row.image || row.banner ? (
                          <img
                            src={row.image || row.banner}
                            alt=""
                            className="h-9 w-9 rounded-lg bg-blue-50 object-cover"
                          />
                        ) : null}
                        <span>{row.title || row.name || row.studentName}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      {row.status ? (
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            row.status === "published"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {row.status}
                        </span>
                      ) : (
                        <span>
                          {row.designation ||
                            row.duration ||
                            (row.rollNumber ? `Roll: ${row.rollNumber} | Grade: ${row.grade || "Auto"}` : "—")}
                        </span>
                      )}
                    </td>

                    <td className="space-x-3 p-4 text-right">
                      <button
                        type="button"
                        onClick={() => open(row)}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete this ${singular}?`)) {
                            remove.mutate(row._id);
                          }
                        }}
                        className="font-semibold text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-400">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ================= ACCOUNT ================= */

function Account() {
  const { user } = useAuth();

  const fields = [
    { label: "Full name", type: "text", value: user?.name || "Administrator" },
    { label: "Email address", type: "email", value: user?.email || "admin@academy.com" },
    { label: "Role", type: "text", value: user?.role || "Super Admin" },
  ];

  return (
    <>
      <Heading
        eyebrow="USER PROFILE"
        title="Account settings"
        text="Manage your administrator credentials and settings."
      />

      <div className={`${card} max-w-xl space-y-4`}>
        {fields.map((f) => (
          <div key={f.label}>
            <label className="mb-1 block text-sm font-semibold text-slate-700">{f.label}</label>
            <input
              type={f.type}
              disabled
              value={f.value}
              className="w-full rounded-lg border border-blue-100 bg-blue-50/50 px-3 py-2 text-sm text-slate-500"
            />
          </div>
        ))}
      </div>
    </>
  );
}