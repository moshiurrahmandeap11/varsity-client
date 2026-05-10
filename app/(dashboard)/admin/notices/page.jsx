"use client";

import axiosInstance from "@/app/components/sharedComponents/AxiosInstance/AxiosInstance";
import DeleteConfirmModal from "@/app/components/sharedComponents/DeleteConfirmModal/DeleteConfirmModal";
import FilePreview from "@/app/components/sharedComponents/FilePreview/FilePreview";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FiAlertCircle,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiEye,
  FiFileText,
  FiFilter,
  FiSearch,
  FiTrash2,
  FiUser,
  FiX,
} from "react-icons/fi";

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const itemsPerPage = 6;

  // FETCH NOTICES
  const fetchNotices = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (filterCategory !== "all") {
        params.append("category", filterCategory);
      }

      if (filterPriority !== "all") {
        params.append("priority", filterPriority);
      }

      params.append("isActive", "true");

      const res = await axiosInstance.get(`/notices?${params.toString()}`);

      setNotices(res?.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchNotices();
    }, 300);

    return () => clearTimeout(timeout);
  }, [filterCategory, filterPriority]);

  // SEARCH FILTER
  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => {
      const title = notice?.title?.toLowerCase() || "";
      const desc = notice?.description?.toLowerCase() || "";

      return (
        title.includes(searchTerm.toLowerCase()) ||
        desc.includes(searchTerm.toLowerCase())
      );
    });
  }, [notices, searchTerm]);

  // PAGINATION
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);

  const paginatedNotices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return filteredNotices.slice(start, start + itemsPerPage);
  }, [filteredNotices, currentPage]);

  // RESET PAGE
  useEffect(() => {
    const trySolve = async () => {
      setCurrentPage(1);
    };
    trySolve();
  }, [searchTerm, filterCategory, filterPriority]);

  // DELETE
  const handleDelete = async () => {
    if (!selectedNotice) return;

    try {
      const res = await axiosInstance.delete(`/notices/${selectedNotice._id}`);

      if (res.data.success) {
        toast.success("Notice deleted");

        setNotices((prev) => prev.filter((n) => n._id !== selectedNotice._id));

        setShowDeleteModal(false);
        setSelectedNotice(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  // PRIORITY
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-200 border border-red-500/20";

      case "high":
        return "bg-orange-500/20 text-orange-200 border border-orange-500/20";

      default:
        return "bg-blue-500/20 text-blue-200 border border-blue-500/20";
    }
  };

  // CATEGORY ICON
  const getCategoryIcon = (category) => {
    switch (category) {
      case "academic":
        return "📚";

      case "exam":
        return "✍️";

      case "event":
        return "🎉";

      case "holiday":
        return "🎊";

      case "result":
        return "📊";

      case "workshop":
        return "💻";

      default:
        return "📢";
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="
                h-105
                rounded-4xl
                border border-white/10
                bg-white/5
                backdrop-blur-2xl
                animate-pulse
              "
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#070b14] text-white relative">
      {/* BG BLOBS */}
      <div className="absolute top-0 left-0 w-125 h-125 bg-blue-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-125 h-125 bg-cyan-500/10 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8">
        {/* HEADER */}
        <div
          className="
          relative overflow-hidden
          rounded-4xl
          border border-white/10
          bg-white/5
          backdrop-blur-2xl
          p-8
          mb-8
        "
        >
          <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Department Notices
              </h1>

              <p className="text-gray-400 mt-2">
                Latest announcements and department updates
              </p>
            </div>

            <div
              className="
              flex items-center gap-3
              px-5 py-3
              rounded-2xl
              border border-white/10
              bg-white/5
            "
            >
              <FiFileText />

              <span className="text-sm text-gray-300">
                {filteredNotices.length} Notices
              </span>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div
          className="
          rounded-4xl
          border border-white/10
          bg-white/5
          backdrop-blur-2xl
          p-5
          mb-8
        "
        >
          <div className="flex flex-col xl:flex-row gap-4">
            {/* SEARCH */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                w-full h-12
                rounded-2xl
                border border-white/10
                bg-white/5
                backdrop-blur-xl
                pl-12 pr-12
                outline-none
                text-sm
                transition-all
                focus:border-blue-500/40
                focus:bg-white/10
              "
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="
                  absolute right-4 top-1/2
                  -translate-y-1/2
                  text-gray-400
                  hover:text-white
                "
                >
                  <FiX />
                </button>
              )}
            </div>

            {/* CATEGORY */}
            <div className="relative">
              <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="
                h-12 min-w-55
                rounded-2xl
                border border-white/10
                bg-white/5
                backdrop-blur-xl
                pl-12 pr-5
                outline-none
                appearance-none
              "
              >
                <option value="all">All Categories</option>
                <option value="general">📢 General</option>
                <option value="academic">📚 Academic</option>
                <option value="exam">✍️ Exam</option>
                <option value="event">🎉 Event</option>
                <option value="holiday">🎊 Holiday</option>
                <option value="result">📊 Result</option>
                <option value="workshop">💻 Workshop</option>
              </select>
            </div>

            {/* PRIORITY */}
            <div className="relative">
              <FiAlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="
                h-12 min-w-55
                rounded-2xl
                border border-white/10
                bg-white/5
                backdrop-blur-xl
                pl-12 pr-5
                outline-none
                appearance-none
              "
              >
                <option value="all">All Priorities</option>
                <option value="normal">🟢 Normal</option>
                <option value="high">🟠 High</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </div>
          </div>
        </div>

        {/* EMPTY */}
        {paginatedNotices.length === 0 ? (
          <div
            className="
            rounded-4xl
            border border-white/10
            bg-white/5
            backdrop-blur-2xl
            p-20
            text-center
          "
          >
            <FiFileText className="w-20 h-20 mx-auto text-gray-500 mb-5" />

            <h2 className="text-2xl font-semibold">No Notices Found</h2>

            <p className="text-gray-400 mt-2">
              Try changing filters or search query
            </p>
          </div>
        ) : (
          <>
            {/* GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
              {paginatedNotices.map((notice) => (
                <div
                  key={notice._id}
                  className="
                  group relative overflow-hidden
                  rounded-4xl
                  border border-white/10
                  bg-white/5
                  backdrop-blur-2xl
                  transition-all duration-500
                  hover:bg-white/8
                  hover:border-white/20
                  hover:-translate-y-1
                  hover:shadow-[0_20px_80px_rgba(0,0,0,0.4)]
                "
                >
                  {/* LIQUID BLOBS */}
                  <div className="absolute -top-20 -right-20 w-52 h-52 bg-white/5 blur-3xl rounded-full" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full" />

                  {/* FILE */}
                  {notice?.file?.url && (
                    <div className="p-4 pb-0">
                      <FilePreview
                        fileUrl={notice.file.url}
                        title={notice.title}
                      />
                    </div>
                  )}

                  {/* CONTENT */}
                  <div className="relative p-6">
                    {/* TOP */}
                    <div className="flex justify-between items-start gap-3 mb-5">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`
                          px-3 py-1 rounded-xl text-xs font-medium
                          ${getPriorityBadge(notice.priority)}
                        `}
                        >
                          {notice.priority || "normal"}
                        </span>

                        <span
                          className="
                          px-3 py-1 rounded-xl
                          bg-white/10 border border-white/10
                          text-xs text-gray-300
                        "
                        >
                          {getCategoryIcon(notice.category)} {notice.category}
                        </span>
                      </div>

                      {/* ACTIONS */}
                      <div
                        className="
                        flex gap-2
                        opacity-0 group-hover:opacity-100
                        transition-all duration-300
                      "
                      >
                        <Link
                          href={`/admin/notices/edit/${notice._id}`}
                          className="
                          h-10 w-10
                          rounded-2xl
                          bg-blue-500/20
                          border border-blue-500/20
                          flex items-center justify-center
                          hover:bg-blue-500/30
                        "
                        >
                          <FiEdit2 />
                        </Link>

                        <button
                          onClick={() => {
                            setSelectedNotice(notice);
                            setShowDeleteModal(true);
                          }}
                          className="
                          h-10 w-10
                          rounded-2xl
                          bg-red-500/20
                          border border-red-500/20
                          flex items-center justify-center
                          hover:bg-red-500/30
                        "
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>

                    {/* TITLE */}
                    <h2 className="text-2xl font-bold leading-tight mb-3 line-clamp-2">
                      {notice.title}
                    </h2>

                    {/* DESC */}
                    {notice.description && (
                      <p className="text-gray-300 leading-relaxed line-clamp-3 mb-6">
                        {notice.description}
                      </p>
                    )}

                    {/* META */}
                    <div className="flex flex-wrap gap-5 text-sm text-gray-400 mb-6">
                      <div className="flex items-center gap-2">
                        <FiCalendar />

                        <span>
                          {new Date(
                            notice.publishDate || notice.createdAt,
                          ).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FiEye />

                        <span>{notice.views || 0}</span>
                      </div>

                      {notice.author && (
                        <div className="flex items-center gap-2">
                          <FiUser />

                          <span>{notice.author}</span>
                        </div>
                      )}
                    </div>

                    {/* BTN */}
                    <Link
                      href={`/notices/${notice._id}`}
                      className="
                      inline-flex items-center gap-2
                      px-5 py-3
                      rounded-2xl
                      bg-blue-500/20
                      border border-blue-500/20
                      text-blue-200
                      hover:bg-blue-500/30
                      transition-all
                    "
                    >
                      Read More
                      <FiChevronRight />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10 flex-wrap">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="
                  h-11 w-11
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                  backdrop-blur-xl
                  disabled:opacity-40
                "
                >
                  <FiChevronLeft className="mx-auto" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`
                    h-11 min-w-11 px-4
                    rounded-2xl
                    border
                    transition-all
                    ${
                      currentPage === page
                        ? "bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/30"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }
                  `}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="
                  h-11 w-11
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                  backdrop-blur-xl
                  disabled:opacity-40
                "
                >
                  <FiChevronRight className="mx-auto" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <DeleteConfirmModal
          title="Delete Notice"
          message={`Delete "${selectedNotice?.title}" ?`}
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedNotice(null);
          }}
        />
      )}
    </div>
  );
};

export default Notices;
