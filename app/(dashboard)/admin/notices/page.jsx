"use client";
import axiosInstance from "@/app/components/sharedComponents/AxiosInstance/AxiosInstance";
import DeleteConfirmModal from "@/app/components/sharedComponents/DeleteConfirmModal/DeleteConfirmModal";
import FilePreview from "@/app/components/sharedComponents/FilePreview/FilePreview";
import Link from "next/link";
import { useEffect, useState } from "react";
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

  // Fetch notices
  const fetchNotices = async () => {
    setLoading(true);
    try {
      let query = "";
      if (filterCategory !== "all") query += `?category=${filterCategory}`;
      if (filterPriority !== "all") {
        query += query
          ? `&priority=${filterPriority}`
          : `?priority=${filterPriority}`;
      }
      query += query ? `&isActive=true` : `?isActive=true`;

      const response = await axiosInstance.get(`/notices${query}`);
      setNotices(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching notices:", error);
      toast.error("Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchNotices();
    }, 300);
    delayDebounce();

    return () => clearTimeout(delayDebounce);
  }, [filterCategory, filterPriority]);

  // Delete notice
  const handleDelete = async () => {
    if (!selectedNotice) return;

    try {
      const res = await axiosInstance.delete(`/notices/${selectedNotice._id}`);
      if (res.data.success) {
        toast.success("Notice deleted successfully");
        fetchNotices();
        setShowDeleteModal(false);
        setSelectedNotice(null);
      } else {
        toast.error(res.data.message || "Failed to delete notice");
      }
    } catch (error) {
      console.error("Error deleting notice:", error);
      toast.error("Failed to delete notice");
    }
  };

  // Filter notices by search
  const filteredNotices = notices.filter(
    (notice) =>
      notice.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotices = filteredNotices.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Reset to first page when filters change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, filterCategory, filterPriority]);

  // Get priority badge style
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "urgent":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          label: "Urgent",
          icon: "🔴",
        };
      case "high":
        return {
          bg: "bg-orange-100",
          text: "text-orange-700",
          label: "High",
          icon: "🟠",
        };
      default:
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          label: "Normal",
          icon: "🟢",
        };
    }
  };

  // Get category icon
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

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded-lg w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-lg p-6"
                >
                  <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black bg-linear-to-br from-gray-50 via-white to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Department Notices
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Stay updated with latest announcements and notices
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl">
              <FiFileText className="w-4 h-4" />
              <span>Total: {filteredNotices.length} notices</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 p-5 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative min-w-40">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 pr-8 py-2.5 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
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

            {/* Priority Filter */}
            <div className="relative min-w-37.5">
              <FiAlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="pl-10 pr-8 py-2.5 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="all">All Priorities</option>
                <option value="normal">🟢 Normal</option>
                <option value="high">🟠 High</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notices Grid */}
        {paginatedNotices.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <FiFileText className="w-20 h-20 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No notices found
            </h3>
            <p className="text-gray-400">Check back later for updates</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {paginatedNotices.map((notice) => {
                const priorityBadge = getPriorityBadge(notice.priority);
                return (
                  <div
                    key={notice._id}
                    className="group bg-white/30 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/40 hover:border-white/60 transform hover:-translate-y-1"
                  >
                    {/* File Preview Section */}
                    {notice.file && (
                      <div className="p-4 pb-0">
                        <FilePreview
                          fileUrl={notice.file.url}
                          title={notice.title}
                        />
                      </div>
                    )}

                    {/* Notice Content */}
                    <div className="p-5">
                      {/* Header with Priority and Category */}
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`px-2 py-1 rounded-lg text-xs font-medium ${priorityBadge.bg} ${priorityBadge.text}`}
                          >
                            {priorityBadge.icon} {priorityBadge.label}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                            {getCategoryIcon(notice.category)} {notice.category}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <Link
                            href={`/admin/notices/edit/${notice._id}`}
                            className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                            title="Edit"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedNotice(notice);
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                            title="Delete"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                        {notice.title}
                      </h2>

                      {/* Description */}
                      {notice.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {notice.description}
                        </p>
                      )}

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3" />
                          <span>
                            Published:{" "}
                            {new Date(
                              notice.publishDate || notice.createdAt,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiEye className="w-3 h-3" />
                          <span>{notice.views || 0} views</span>
                        </div>
                        {notice.author && (
                          <div className="flex items-center gap-1">
                            <FiUser className="w-3 h-3" />
                            <span>By: {notice.author}</span>
                          </div>
                        )}
                      </div>

                      {/* View Details Link */}
                      <Link
                        href={`/notices/${notice._id}`}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                      >
                        Read More
                        <FiChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 bg-white/40 backdrop-blur-sm rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/60 transition-all"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          currentPage === page
                            ? "bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-md"
                            : "bg-white/40 backdrop-blur-sm text-gray-600 hover:bg-white/60"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white/40 backdrop-blur-sm rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/60 transition-all"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          title="Delete Notice"
          message={`Are you sure you want to delete "${selectedNotice?.title}"? This action cannot be undone.`}
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
