import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays, ArrowLeft, ExternalLink, Download,
  Image as ImageIcon, Search, X, ZoomIn, ZoomOut,
  Maximize2, FileText, RefreshCw, Bell, ChevronRight,
} from "lucide-react";
import { getData } from "../lib/api";
import SectionTitle from "../components/SectionTitle";

const API = "/api/v1";

const formatDate = (date) => {
  if (!date) return "ACADEMY UPDATE";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "ACADEMY UPDATE";

  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getFileName = (title, extension = "jpg") => {
  const safeTitle = (title || "Notice")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return `${safeTitle || "Notice"}.${extension}`;
};

const isPdf = (url = "") => /\.pdf(?:[?#]|$)/i.test(url);

export default function Notices() {
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  const [search, setSearch] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const q = useQuery({
    queryKey: ["notices"],
    queryFn: () => getData(`${API}/notices`),
    retry: 2,
  });

  const notices = Array.isArray(q.data?.data) ? q.data.data : [];

  const singleQuery = useQuery({
    queryKey: ["notice", selectedNoticeId],
    queryFn: () => getData(`${API}/notices/${selectedNoticeId}`),
    enabled: !!selectedNoticeId,
  });

  const selectedNotice =
    singleQuery.data?.data ||
    notices.find((notice) => notice._id === selectedNoticeId);

  const filteredNotices = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return notices.filter((notice) =>
      [notice.title, notice.description, notice.content]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword))
    );
  }, [notices, search]);

  const openNotice = (id) => {
    setSelectedNoticeId(id);
    setPreviewOpen(false);
    setZoom(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setSelectedNoticeId(null);
    setPreviewOpen(false);
    setZoom(1);
  };

  const handleDownload = async (url, title) => {
    if (!url) return;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = objectUrl;
      link.download = getFileName(title, isPdf(url) ? "pdf" : "jpg");

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // NOTICE DETAILS
  if (selectedNoticeId) {
    const attachment = selectedNotice?.image;
    const pdfFile = attachment && isPdf(attachment);

    return (
      <main className="min-h-screen bg-slate-50 pb-16 pt-6 sm:pt-10">
        <div className="mx-auto w-full max-w-5xl px-3 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={goBack}
            className="mb-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-cyan-700 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50"
          >
            <ArrowLeft size={17} />
            Back to Notices
          </button>

          {singleQuery.isLoading && !selectedNotice ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <RefreshCw className="mx-auto animate-spin text-cyan-600" />
              <p className="mt-3 text-sm text-slate-500">
                Loading notice...
              </p>
            </div>
          ) : selectedNotice ? (
            <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="relative overflow-hidden bg-[#071426] px-5 py-8 text-white sm:px-8 sm:py-10">
                <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

                <div className="relative">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-extrabold tracking-[0.16em] text-cyan-200">
                      <Bell size={13} />
                      ACADEMY NOTICE
                    </span>

                    <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-300">
                      <CalendarDays size={14} />
                      {formatDate(selectedNotice.createdAt)}
                    </span>
                  </div>

                  <h1 className="mt-5 max-w-4xl break-words text-2xl font-black leading-tight sm:text-4xl">
                    {selectedNotice.title}
                  </h1>
                </div>
              </div>

              {attachment && (
                <div className="border-b border-slate-100 bg-slate-50 p-3 sm:p-6">
                  <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {pdfFile ? (
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col items-center py-8 text-center">
                          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                            <FileText size={42} />
                          </div>

                          <h3 className="mt-4 text-lg font-black text-slate-800">
                            Notice PDF Document
                          </h3>

                          <p className="mt-2 text-sm text-slate-500">
                            Open or download the official notice.
                          </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3">
                          <a
                            href={attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-cyan-700"
                          >
                            <ExternalLink size={16} />
                            Open PDF
                          </a>

                          <button
                            type="button"
                            onClick={() =>
                              handleDownload(attachment, selectedNotice.title)
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-[#071426] px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                          >
                            <Download size={16} />
                            Download PDF
                          </button>
                        </div>

                        <iframe
                          src={attachment}
                          title={selectedNotice.title}
                          className="mt-6 h-[65vh] min-h-[400px] w-full rounded-xl border border-slate-200"
                        />
                      </div>
                    ) : (
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewOpen(true);
                            setZoom(1);
                          }}
                          aria-label="View full notice image"
                          className="group relative block w-full cursor-zoom-in bg-slate-100"
                        >
                          <img
                            src={attachment}
                            alt={selectedNotice.title}
                            className="mx-auto max-h-[75vh] w-full object-contain"
                          />

                          <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-xl bg-[#071426]/85 px-3 py-2 text-xs font-bold text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                            <Maximize2 size={15} />
                            Full View
                          </span>
                        </button>

                        <div className="flex flex-col gap-3 border-t border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                          <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                            <ImageIcon size={16} className="text-cyan-600" />
                            Notice Image
                          </span>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewOpen(true);
                                setZoom(1);
                              }}
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                            >
                              <Maximize2 size={15} />
                              View Full
                            </button>

                            <a
                              href={attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                            >
                              <ExternalLink size={15} />
                              Open
                            </a>

                            <button
                              type="button"
                              onClick={() =>
                                handleDownload(attachment, selectedNotice.title)
                              }
                              className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-3 py-2 text-xs font-bold text-white hover:bg-cyan-700"
                            >
                              <Download size={15} />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="p-5 sm:p-8">
                <div className="whitespace-pre-line break-words border-t border-slate-100 pt-6 text-sm leading-8 text-slate-600 sm:text-base">
                  {selectedNotice.description ||
                    selectedNotice.content ||
                    "No additional details available."}
                </div>

                <div className="mt-8 border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#071426] px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-700"
                  >
                    <ArrowLeft size={16} />
                    All Notices
                  </button>
                </div>
              </div>
            </article>
          ) : (
            <NoticeState
              title="Notice not found"
              description="This notice may have been removed or is no longer available."
              action={
                <button
                  onClick={goBack}
                  className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white"
                >
                  Back to Notices
                </button>
              }
            />
          )}
        </div>

        {previewOpen && attachment && !pdfFile && (
          <div className="fixed inset-0 z-[100] flex flex-col bg-[#030914]">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-3 sm:px-6">
              <p className="min-w-0 truncate text-sm font-bold text-white">
                {selectedNotice.title}
              </p>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setZoom((value) => Math.max(0.5, value - 0.25))
                  }
                  aria-label="Zoom out"
                  className="rounded-xl bg-white/10 p-2 text-white hover:bg-white/20"
                >
                  <ZoomOut size={18} />
                </button>

                <span className="min-w-12 text-center text-xs font-bold text-slate-300">
                  {Math.round(zoom * 100)}%
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setZoom((value) => Math.min(3, value + 0.25))
                  }
                  aria-label="Zoom in"
                  className="rounded-xl bg-white/10 p-2 text-white hover:bg-white/20"
                >
                  <ZoomIn size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  aria-label="Close preview"
                  className="ml-1 rounded-xl bg-red-500 p-2 text-white hover:bg-red-600"
                >
                  <X size={19} />
                </button>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-center overflow-auto p-3 sm:p-6">
              <img
                src={attachment}
                alt={selectedNotice.title}
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "center",
                }}
                className="max-h-full max-w-full object-contain transition-transform duration-200"
              />
            </div>

            <div className="flex justify-center border-t border-white/10 p-3">
              <button
                type="button"
                onClick={() =>
                  handleDownload(attachment, selectedNotice.title)
                }
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-sm font-bold text-white hover:bg-cyan-700"
              >
                <Download size={17} />
                Download Image
              </button>
            </div>
          </div>
        )}
      </main>
    );
  }

  // NOTICE LIST
  return (
    <main className="min-h-screen bg-slate-50 pb-16 pt-8 sm:pt-12">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="STAY INFORMED"
          title="Academy"
          accent="notices."
          description="The latest announcements, important updates, and news from IT Academy."
        />

        <div className="relative mt-8 overflow-hidden rounded-3xl bg-[#071426] p-5 text-white shadow-lg sm:p-7">
          <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold tracking-[0.18em] text-cyan-300">
                <Bell size={15} />
                NOTICE BOARD
              </div>

              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                What’s happening at the academy?
              </h2>

              <p className="mt-2 text-sm text-slate-300">
                {filteredNotices.length} published{" "}
                {filteredNotices.length === 1 ? "notice" : "notices"}
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                placeholder="Search notices..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/10 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {q.isLoading ? (
            <div className="space-y-4 p-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex animate-pulse items-center gap-4"
                >
                  <div className="h-12 w-12 rounded-xl bg-slate-200" />
                  <div className="flex-1">
                    <div className="h-4 w-2/3 rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-1/3 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : q.isError ? (
            <NoticeState
              title="Unable to load notices"
              description="Please check your connection and try again."
              action={
                <button
                  type="button"
                  onClick={() => q.refetch()}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white"
                >
                  <RefreshCw size={15} />
                  Try Again
                </button>
              }
            />
          ) : filteredNotices.length ? (
            <div className="divide-y divide-slate-100">
              {filteredNotices.map((notice) => (
                <button
                  type="button"
                  key={notice._id}
                  onClick={() => openNotice(notice._id)}
                  className="group flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-cyan-50/60 sm:p-5"
                >
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 transition group-hover:bg-cyan-100">
                      <CalendarDays size={21} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="line-clamp-2 break-words text-sm font-extrabold text-slate-900 transition group-hover:text-cyan-700 sm:text-base">
                        {notice.title}
                      </h3>

                      <p className="mt-1 text-xs font-medium text-slate-400">
                        {formatDate(notice.createdAt)}
                      </p>
                    </div>

                    {notice.image && (
                      <ImageIcon size={15} className="shrink-0 text-slate-400" />
                    )}
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-extrabold text-cyan-700 transition group-hover:translate-x-1 sm:text-sm">
                    Read
                    <ChevronRight size={16} />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <NoticeState
              title="No notices found"
              description={
                search
                  ? "Try another keyword to find a notice."
                  : "There are no published notices at the moment."
              }
            />
          )}
        </div>

        <p className="mt-4 text-center text-xs font-medium text-slate-400">
          Showing {filteredNotices.length}{" "}
          {filteredNotices.length === 1 ? "notice" : "notices"}
        </p>
      </div>
    </main>
  );
}

function NoticeState({ title, description, action }) {
  return (
    <div className="px-5 py-14 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
        <FileText size={29} />
      </div>

      <h3 className="mt-5 text-xl font-black text-slate-900">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}