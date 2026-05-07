"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FiEdit2, FiEye, FiEyeOff, FiPlus, FiTrash2 } from "react-icons/fi";
import axiosInstance from "../../sharedComponents/AxiosInstance/AxiosInstance";
import DeleteConfirmModal from "../../sharedComponents/DeleteConfirmModal/DeleteConfirmModal";

const AllBannersPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all");

  // Fetch banners
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const query = filterActive !== "all" ? `?activeOnly=${filterActive === "active"}` : "";
      const res = await axiosInstance.get(`/banners${query}`);
      if (res.data.success) {
        setBanners(res.data.data);
      } else {
        toast.error(res.data.message || "Failed to fetch banners");
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [filterActive]);

  // Toggle banner status
  const toggleStatus = async (id, currentStatus) => {
    try {
      const res = await axiosInstance.patch(`/banners/${id}/toggle-status`);
      if (res.data.success) {
        toast.success(`Banner ${!currentStatus ? "activated" : "deactivated"} successfully`);
        fetchBanners();
      } else {
        toast.error(res.data.message || "Failed to toggle status");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to toggle banner status");
    }
  };

  // Delete single banner
  const handleDelete = async () => {
    if (!selectedBanner) return;
    
    try {
      const res = await axiosInstance.delete(`/banners/${selectedBanner._id}`);
      if (res.data.success) {
        toast.success("Banner deleted successfully");
        fetchBanners();
        setShowDeleteModal(false);
        setSelectedBanner(null);
      } else {
        toast.error(res.data.message || "Failed to delete banner");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Failed to delete banner");
    }
  };

  // Bulk delete banners
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one banner");
      return;
    }

    try {
      const res = await axiosInstance.post("/banners/delete-multiple", {
        ids: selectedIds
      });
      
      if (res.data.success) {
        toast.success(res.data.message);
        fetchBanners();
        setSelectedIds([]);
        setShowBulkDelete(false);
      } else {
        toast.error(res.data.message || "Failed to delete banners");
      }
    } catch (error) {
      console.error("Error bulk deleting banners:", error);
      toast.error("Failed to delete banners");
    }
  };

  // Select/Unselect banner for bulk delete
  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Select all banners
  const selectAll = () => {
    if (selectedIds.length === filteredBanners.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredBanners.map(banner => banner._id));
    }
  };

  // Filter banners by search
  const filteredBanners = banners.filter(banner => 
    banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (banner.description && banner.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">All Banners</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your website banners</p>
          </div>
          
          <Link
            href="/dashboard/add-banner"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add New Banner</span>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterActive("all")}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  filterActive === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterActive("active")}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  filterActive === "active"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterActive("inactive")}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  filterActive === "inactive"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 flex justify-between items-center">
            <span className="text-blue-700">
              {selectedIds.length} banner{selectedIds.length !== 1 ? "s" : ""} selected
            </span>
            <button
              onClick={() => setShowBulkDelete(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              <FiTrash2 className="w-4 h-4" />
              Delete Selected
            </button>
          </div>
        )}

        {/* Banners Grid */}
        {filteredBanners.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No banners found</h3>
            <p className="text-gray-400">Click &quot;Add New Banner&quot; to create your first banner</p>
          </div>
        ) : (
          <>
            {/* Select All Checkbox for Desktop */}
            {filteredBanners.length > 0 && (
              <div className="mb-3 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredBanners.length && filteredBanners.length > 0}
                  onChange={selectAll}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="text-sm text-gray-600">Select All</label>
              </div>
            )}

            {/* Banners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBanners.map((banner) => (
                <div
                  key={banner._id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
                >
                  {/* Checkbox for bulk delete */}
                  <div className="absolute relative z-10 p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(banner._id)}
                      onChange={() => toggleSelect(banner._id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 bg-white"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Banner Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={banner.image?.url || "https://via.placeholder.com/400x200?text=No+Image"}
                      alt={banner.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          banner.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {banner.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  {/* Banner Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-1">
                      {banner.title}
                    </h3>
                    
                    {banner.description && (
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                        {banner.description}
                      </p>
                    )}
                    
                    {banner.link && (
                      <a
                        href={banner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline block mb-3 truncate"
                      >
                        {banner.link}
                      </a>
                    )}
                    
                    <div className="text-xs text-gray-400 mb-4">
                      Added: {new Date(banner.createdAt).toLocaleDateString()}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => toggleStatus(banner._id, banner.isActive)}
                        className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg transition-all duration-200 ${
                          banner.isActive
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                      >
                        {banner.isActive ? (
                          <>
                            <FiEyeOff className="w-4 h-4" />
                            <span className="text-sm">Deactivate</span>
                          </>
                        ) : (
                          <>
                            <FiEye className="w-4 h-4" />
                            <span className="text-sm">Activate</span>
                          </>
                        )}
                      </button>
                      
                      <Link
                        href={`/admin/banners/edit/${banner._id}`}
                        className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-all duration-200"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        <span className="text-sm">Edit</span>
                      </Link>
                      
                      <button
                        onClick={() => {
                          setSelectedBanner(banner);
                          setShowDeleteModal(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-all duration-200"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        <span className="text-sm">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          title="Delete Banner"
          message={`Are you sure you want to delete "${selectedBanner?.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedBanner(null);
          }}
        />
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDelete && (
        <DeleteConfirmModal
          title="Delete Multiple Banners"
          message={`Are you sure you want to delete ${selectedIds.length} banner${selectedIds.length !== 1 ? "s" : ""}? This action cannot be undone.`}
          onConfirm={handleBulkDelete}
          onCancel={() => setShowBulkDelete(false)}
        />
      )}
    </div>
  );
};

export default AllBannersPage;