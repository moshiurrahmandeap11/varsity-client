"use client";

import { notices } from "@/app/data/apidata";
import { useQuery } from "@tanstack/react-query";
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
} from "react-icons/fi";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

const NoticesPage = () => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notices"],
    queryFn: notices,
  });

  const noticeData = data?.data || [];

  const totalPages = Math.ceil(noticeData.length / itemsPerPage);

  const paginatedNotices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return noticeData.slice(start, start + itemsPerPage);
  }, [noticeData, currentPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060816]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-white" />
          <p className="text-white/70 text-sm tracking-wide">
            Loading Notices...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060816] px-4">
        <div className="backdrop-blur-2xl bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center max-w-md w-full">
          <h2 className="text-red-400 text-2xl font-bold mb-2">
            Something went wrong
          </h2>

          <p className="text-red-200/70 text-sm">{error?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#060816] text-white px-4 py-10">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/20 blur-[120px] rounded-full" />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-4">
            <FiFileText className="text-cyan-300" />
            <span className="text-sm text-white/80">Department Notices</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black bg-linear-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
            Latest Notices
          </h1>

          <p className="text-white/50 mt-3 text-sm md:text-base">
            Stay updated with department announcements and updates.
          </p>
        </div>

        {/* Notice List */}
        <div className="space-y-4">
          {paginatedNotices.map((notice, index) => (
            <div
              key={notice._id}
              onClick={() => router.push(`/notices/${notice._id}`)}
              className="group cursor-pointer relative overflow-hidden rounded-3xl border border-white/10 bg-white/6 backdrop-blur-2xl transition-all duration-300 hover:bg-white/10 hover:border-cyan-400/30 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]"
            >
              {/* Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r from-cyan-500/10 via-transparent to-blue-500/10" />

              <div className="relative flex items-center justify-between gap-4 px-6 py-5">
                <div className="flex items-center gap-4 min-w-0">
                  {/* Number */}
                  <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-cyan-400/20 to-blue-500/20 border border-white/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-cyan-200">
                      {String(
                        (currentPage - 1) * itemsPerPage + index + 1,
                      ).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="min-w-0">
                    <h2 className="text-base md:text-lg font-semibold text-white truncate group-hover:text-cyan-200 transition-colors">
                      {notice.title}
                    </h2>
                  </div>
                </div>

                {/* Arrow */}
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-cyan-400/10 group-hover:border-cyan-400/30 transition-all">
                    <FiArrowRight className="w-4 h-4 text-white/70 group-hover:text-cyan-200 transition-all group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {paginatedNotices.length === 0 && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/6 backdrop-blur-2xl p-12 text-center">
            <FiFileText className="w-14 h-14 mx-auto text-white/30 mb-4" />

            <h2 className="text-2xl font-bold text-white/80">
              No Notices Found
            </h2>

            <p className="text-white/40 mt-2 text-sm">
              There are currently no notices available.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-11 h-11 rounded-2xl border border-white/10 bg-white/6 backdrop-blur-xl flex items-center justify-center text-white/70 hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>

            {/* Pages */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-11 h-11 rounded-2xl font-semibold transition-all ${
                  currentPage === page
                    ? "bg-linear-to-r from-cyan-400 to-blue-500 text-black shadow-[0_0_30px_rgba(34,211,238,0.4)]"
                    : "border border-white/10 bg-white/6 backdrop-blur-xl text-white/70 hover:bg-white/10"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="w-11 h-11 rounded-2xl border border-white/10 bg-white/6 backdrop-blur-xl flex items-center justify-center text-white/70 hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticesPage;
