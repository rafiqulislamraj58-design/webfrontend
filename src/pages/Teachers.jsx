import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search, Plus, Pencil, Trash2, Mail, Phone, GraduationCap,
  Users, RefreshCw, X, Camera, Filter, ChevronLeft,
  ChevronRight, BookOpen,
} from "lucide-react";
import api, { getData } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import SectionTitle from "../components/SectionTitle";

const API = "/api/v1";
const PAGE_SIZE = 9;

const EMPTY_FORM = {
  name: "",
  designation: "",
  department: "",
  email: "",
  phone: "",
  bio: "",
  status: "active",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10";

const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

const getRole = (user) =>
  String(user?.role?.name || user?.role || user?.userRole || "").toLowerCase();

const initials = (name = "") =>
  name.trim().split(/\s+/).filter(Boolean)
    .map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "T";

export default function Teachers() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const canManage = ["admin", "superadmin"].includes(getRole(user));

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [image, setImage] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const q = useQuery({
    queryKey: ["teachers"],
    queryFn: () => getData(`${API}/teachers`),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const teachers = Array.isArray(q.data?.data) ? q.data.data : [];

  const filteredTeachers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return teachers.filter((teacher) => {
      const matchesSearch = [
        teacher.name,
        teacher.designation,
        teacher.department,
        teacher.email,
        teacher.phone,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === "all" ||
        String(teacher.status || "active").toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [teachers, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTeachers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const visibleTeachers = filteredTeachers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const resetModal = () => {
    setModalOpen(false);
    setEditingTeacher(null);
    setForm(EMPTY_FORM);
    setImage(null);
  };

  const openCreateModal = () => {
    setEditingTeacher(null);
    setForm(EMPTY_FORM);
    setImage(null);
    setModalOpen(true);
  };

  const openEditModal = (teacher) => {
    setEditingTeacher(teacher);
    setForm({
      name: teacher.name || "",
      designation: teacher.designation || "",
      department: teacher.department || "",
      email: teacher.email || "",
      phone: teacher.phone || "",
      bio: teacher.bio || "",
      status: teacher.status || "active",
    });
    setImage(null);
    setModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: ({ id, formData }) =>
      id
        ? api.put(`${API}/admin/teachers/${id}`, formData)
        : api.post(`${API}/admin/teachers`, formData),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      resetModal();
      window.alert(
        variables.id
          ? "Teacher updated successfully!"
          : "Teacher created successfully!"
      );
    },

    onError: (error) =>
      window.alert(error.response?.data?.message || "Unable to save teacher."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`${API}/admin/teachers/${id}`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      window.alert("Teacher deleted successfully!");
    },

    onError: (error) =>
      window.alert(error.response?.data?.message || "Unable to delete teacher."),
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      window.alert("Teacher name is required!");
      return;
    }

    const formData = new FormData();

    Object.entries({ ...form, name: form.name.trim() }).forEach(
      ([key, value]) => formData.append(key, value ?? "")
    );

    if (image) formData.append("image", image);

    saveMutation.mutate({
      id: editingTeacher?._id,
      formData,
    });
  };

  const handleDelete = (teacher) => {
    if (
      window.confirm(`Are you sure you want to delete ${teacher.name}?`)
    ) {
      deleteMutation.mutate(teacher._id);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-16 pt-8 sm:pt-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="MEET YOUR MENTORS"
          title="Guidance from"
          accent="the doers."
          description="Learn from experienced instructors who are passionate about helping you grow."
        />

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative bg-[#071426] px-5 py-6 text-white sm:px-7">
            <div className="absolute -right-12 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-cyan-300">
                  <Users size={15} />
                  OUR TEACHING TEAM
                </div>

                <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                  Meet the people behind your progress.
                </h2>

                <p className="mt-2 text-sm text-slate-300">
                  {filteredTeachers.length}{" "}
                  {filteredTeachers.length === 1 ? "instructor" : "instructors"} found
                </p>
              </div>

              {canManage && (
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-300"
                >
                  <Plus size={18} />
                  Add Teacher
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-3 p-4 sm:grid-cols-[1fr_220px] sm:p-6">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                placeholder="Search name, department, email..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className={`${inputClass} pl-11`}
              />
            </div>

            <div className="relative">
              <Filter
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
                className={`${inputClass} appearance-none pl-11`}
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </section>

        {q.isLoading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6"
              >
                <div className="mx-auto h-28 w-28 rounded-full bg-slate-200" />
                <div className="mx-auto mt-5 h-4 w-2/3 rounded bg-slate-200" />
                <div className="mx-auto mt-3 h-3 w-1/2 rounded bg-slate-100" />
                <div className="mt-7 h-10 rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        ) : q.isError ? (
          <StatePanel
            icon={<RefreshCw size={25} />}
            title="Unable to load instructors"
            description="Please check your connection and try again."
            action={
              <button
                onClick={() => q.refetch()}
                className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-cyan-700"
              >
                Try Again
              </button>
            }
          />
        ) : visibleTeachers.length ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleTeachers.map((teacher) => (
              <article
                key={teacher._id}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-cyan-200 hover:shadow-xl hover:shadow-slate-900/5"
              >
                <div className="relative flex justify-center overflow-hidden bg-gradient-to-br from-[#071426] via-[#102b49] to-cyan-800 px-5 pb-8 pt-8">
                  <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full border-[20px] border-white/5" />

                  <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white/90 bg-cyan-500 text-2xl font-black text-white shadow-xl ring-4 ring-cyan-300/20">
                    {teacher.image ? (
                      <img
                        src={teacher.image}
                        alt={teacher.name || "Instructor"}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      initials(teacher.name)
                    )}
                  </div>

                  {canManage && (
                    <span
                      className={`absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${
                        String(teacher.status || "active").toLowerCase() === "active"
                          ? "bg-emerald-400/15 text-emerald-200"
                          : "bg-red-400/15 text-red-200"
                      }`}
                    >
                      {teacher.status || "active"}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5 text-center">
                  <h3 className="text-lg font-black text-slate-900">
                    {teacher.name}
                  </h3>

                  <p className="mt-1 text-sm font-bold text-cyan-700">
                    {teacher.designation || "Instructor"}
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {teacher.department || "IT Academy"}
                  </p>

                  {teacher.bio && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
                      {teacher.bio}
                    </p>
                  )}

                  <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-left">
                    {teacher.email && (
                      <a
                        href={`mailto:${teacher.email}`}
                        className="flex min-w-0 items-center gap-2 text-xs text-slate-500 transition hover:text-cyan-700"
                      >
                        <Mail size={15} className="shrink-0 text-cyan-600" />
                        <span className="truncate">{teacher.email}</span>
                      </a>
                    )}

                    {teacher.phone && (
                      <a
                        href={`tel:${teacher.phone}`}
                        className="flex items-center gap-2 text-xs text-slate-500 transition hover:text-cyan-700"
                      >
                        <Phone size={15} className="shrink-0 text-cyan-600" />
                        {teacher.phone}
                      </a>
                    )}

                    {!teacher.email && !teacher.phone && (
                      <p className="flex items-center gap-2 text-xs text-slate-400">
                        <BookOpen size={15} />
                        IT Academy Instructor
                      </p>
                    )}
                  </div>

                  {canManage && (
                    <div className="mt-auto flex gap-2 pt-5">
                      <button
                        type="button"
                        onClick={() => openEditModal(teacher)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-50 px-3 py-2.5 text-sm font-bold text-cyan-700 transition hover:bg-cyan-100"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={deleteMutation.isPending}
                        onClick={() => handleDelete(teacher)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <StatePanel
            icon={<GraduationCap size={30} />}
            title="No instructors found"
            description={
              search || statusFilter !== "all"
                ? "Try changing your search or filter."
                : "Instructor information will appear here when available."
            }
            action={
              canManage && (
                <button
                  onClick={openCreateModal}
                  className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-cyan-700"
                >
                  <Plus size={16} className="mr-2 inline" />
                  Add Teacher
                </button>
              )
            }
          />
        )}

        {!q.isLoading && !q.isError && filteredTeachers.length > PAGE_SIZE && (
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={17} />
              Previous
            </button>

            <span className="rounded-xl bg-[#071426] px-4 py-2.5 text-sm font-bold text-white">
              Page {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={17} />
            </button>
          </div>
        )}
      </div>

      {modalOpen && canManage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071426]/70 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !saveMutation.isPending
            ) {
              resetModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="teacher-modal-title"
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/20 bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between bg-[#071426] px-5 py-5 text-white sm:px-7">
              <div>
                <p className="text-[10px] font-extrabold tracking-[0.2em] text-cyan-300">
                  TEACHER MANAGEMENT
                </p>
                <h2 id="teacher-modal-title" className="mt-1 text-xl font-black">
                  {editingTeacher ? "Update Instructor" : "Add New Instructor"}
                </h2>
              </div>

              <button
                type="button"
                disabled={saveMutation.isPending}
                onClick={resetModal}
                aria-label="Close modal"
                className="rounded-xl bg-white/10 p-2 text-white transition hover:bg-white/20 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    Teacher name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    placeholder="Enter full name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Designation</label>
                  <input
                    name="designation"
                    value={form.designation}
                    onChange={handleChange}
                    placeholder="Senior Instructor"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Department</label>
                  <input
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="Web Development"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="teacher@example.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>Biography</label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows={4}
                    maxLength={1000}
                    placeholder="Write a short instructor biography..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Profile image</label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 transition hover:border-cyan-400 hover:bg-cyan-50">
                    <Camera size={18} className="text-cyan-600" />
                    <span className="min-w-0 truncate">
                      {image?.name || "Choose image (max 5 MB)"}
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0] || null;

                        if (file && file.size > 5 * 1024 * 1024) {
                          window.alert("Image must be 5 MB or smaller.");
                          event.target.value = "";
                          setImage(null);
                          return;
                        }

                        setImage(file);
                      }}
                    />
                  </label>
                </div>
              </div>

              {editingTeacher?.image && !image && (
                <div className="mt-4 flex items-center gap-3">
                  <img
                    src={editingTeacher.image}
                    alt="Current instructor"
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                  <span className="text-xs text-slate-500">
                    Current profile image. Choose a new file to replace it.
                  </span>
                </div>
              )}

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={saveMutation.isPending}
                  onClick={resetModal}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {saveMutation.isPending
                    ? "Saving..."
                    : editingTeacher
                      ? "Save Changes"
                      : "Create Teacher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function StatePanel({ icon, title, description, action }) {
  return (
    <div className="mt-8 rounded-3xl border border-slate-200 bg-white px-5 py-14 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
        {icon}
      </div>
      <h3 className="mt-5 text-xl font-black text-slate-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}