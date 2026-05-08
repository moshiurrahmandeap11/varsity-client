"use client";

import useAuth from "@/app/hooks/useAuth";
import axiosInstance from "../../sharedComponents/AxiosInstance/AxiosInstance";

import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiEye,
  FiTrash2,
} from "react-icons/fi";

const ITEMS_PER_PAGE = 6;

const AllBannersPage = () => {
  const { loading } = useAuth();

  const [banners, setBanners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axiosInstance.get("/banners");
        setBanners(response.data.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch banners");
      }
    };

    fetchBanners();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/banners/${id}`);

      if (response.status === 200) {
        toast.success("Banner deleted successfully");

        const updated = banners.filter((banner) => banner._id !== id);
        setBanners(updated);
      }
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  const totalPages = Math.ceil(banners.length / ITEMS_PER_PAGE);

  const paginatedBanners = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    return banners.slice(start, end);
  }, [banners, currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin w-10 h-10 text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10 bg-linear-to-br from-[#0f172a] via-[#111827] to-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight">All Banners</h1>

          <p className="text-gray-400 mt-2">
            Manage all homepage banners from here.
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/10 border border-white/10 px-5 py-3 rounded-2xl shadow-2xl">
          <p className="text-sm text-gray-300">Total Banners</p>

          <h2 className="text-2xl font-bold">{banners.length}</h2>
        </div>
      </div>

      {/* Empty State */}
      {banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 rounded-4xl border border-white/10 bg-white/5 backdrop-blur-2xl">
          <h2 className="text-2xl font-bold mb-2">No Banners Found</h2>

          <p className="text-gray-400">Add a new banner to get started.</p>
        </div>
      ) : (
        <>
          {/* Banner Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {paginatedBanners.map((banner) => (
              <div
                key={banner._id}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-4xl
                  border
                  border-white/10
                  bg-white/10
                  backdrop-blur-2xl
                  shadow-[0_8px_32px_rgba(0,0,0,0.37)]
                  transition-all
                  duration-500
                  hover:scale-[1.02]
                  hover:border-white/20
                "
              >
                {/* Image */}
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={banner.image?.url}
                    alt={banner.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-3 line-clamp-1">
                    {banner.title}
                  </h2>

                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {banner.description}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-6">
                    <Link
                      href="/"
                      className="
                        flex-1
                        flex
                        items-center
                        justify-center
                        gap-2
                        py-3
                        rounded-2xl
                        bg-white/10
                        hover:bg-white/20
                        transition
                      "
                    >
                      <FiEye />
                      View
                    </Link>

                    <Link
                      href={`/admin/banners/edit/${banner._id}`}
                      className="
                        flex-1
                        flex
                        items-center
                        justify-center
                        gap-2
                        py-3
                        rounded-2xl
                        bg-blue-500/20
                        hover:bg-blue-500/30
                        transition
                      "
                    >
                      <FiEdit2 />
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="
                        px-4
                        py-3
                        rounded-2xl
                        bg-red-500/20
                        hover:bg-red-500/30
                        transition
                      "
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-14">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="
                w-12
                h-12
                rounded-2xl
                bg-white/10
                backdrop-blur-xl
                border
                border-white/10
                flex
                items-center
                justify-center
                disabled:opacity-40
              "
            >
              <FiChevronLeft />
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`
                  w-12
                  h-12
                  rounded-2xl
                  font-bold
                  transition-all
                  ${
                    currentPage === index + 1
                      ? "bg-white text-black"
                      : "bg-white/10 text-white"
                  }
                `}
              >
                {index + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="
                w-12
                h-12
                rounded-2xl
                bg-white/10
                backdrop-blur-xl
                border
                border-white/10
                flex
                items-center
                justify-center
                disabled:opacity-40
              "
            >
              <FiChevronRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllBannersPage;
