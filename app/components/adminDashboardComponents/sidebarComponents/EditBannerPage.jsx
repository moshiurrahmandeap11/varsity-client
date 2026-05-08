"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiImage,
  FiInfo,
  FiLink,
  FiSave,
  FiTrash2,
  FiUpload,
  FiX,
} from "react-icons/fi";
import axiosInstance from "../../sharedComponents/AxiosInstance/AxiosInstance";

const EditBannerPage = () => {
  const params = useParams();
  console.log("Params :", params);
  const bannerId = params?.id;

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    isActive: true,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Fetch banner data
  const fetchBanner = async () => {
    if (!bannerId) {
      console.error("No banner ID provided");
      toast.error("Invalid banner ID");
      router.push("/admin/banners");
      return;
    }

    try {
      console.log(`Fetching banner with ID: ${bannerId}`);
      const res = await axiosInstance.get(`/banners/${bannerId}`);
      console.log("API Response:", res.data);

      if (res.data.success) {
        const banner = res.data.data;
        setFormData({
          title: banner.title || "",
          description: banner.description || "",
          link: banner.link || "",
          isActive: banner.isActive !== undefined ? banner.isActive : true,
        });
        setCurrentImageUrl(banner.image?.url || null);
      } else {
        toast.error(res.data.message || "Failed to fetch banner");
        router.push("/admin/banners");
      }
    } catch (error) {
      console.error("Error fetching banner:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch banner data",
      );
      router.push("/admin/banners");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (bannerId) {
      fetchBanner();
    } else {
      // If no bannerId, redirect after short delay
      const timer = setTimeout(() => {
        toast.error("No banner ID provided");
        router.push("/admin/banners");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [bannerId]);

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select a valid image file");
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please drop a valid image file");
    }
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter banner title");
      return;
    }

    setLoading(true);

    const submitData = new FormData();
    if (selectedFile) {
      submitData.append("image", selectedFile);
    }
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("link", formData.link);
    submitData.append("isActive", formData.isActive);

    try {
      const res = await axiosInstance.put(`/banners/${bannerId}`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Banner updated successfully!");
        router.push("/admin/banners");
      } else {
        toast.error(res.data.message || "Failed to update banner");
      }
    } catch (error) {
      console.error("Error updating banner:", error);
      toast.error(error.response?.data?.message || "Failed to update banner");
    } finally {
      setLoading(false);
    }
  };

  // Delete banner
  const handleDelete = async () => {
    try {
      const res = await axiosInstance.delete(`/banners/${bannerId}`);
      if (res.data.success) {
        toast.success("Banner deleted successfully!");
        router.push("/admin/banners");
      } else {
        toast.error(res.data.message || "Failed to delete banner");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error(error.response?.data?.message || "Failed to delete banner");
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Loading skeleton
  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="mb-6">
              <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-10 bg-gray-200 rounded flex-1"></div>
                <div className="h-10 bg-gray-200 rounded flex-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black p-4 md:p-6">
      <div className="max-w-9xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Link
              href="/admin/banners"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Banners</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Edit Banner
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Update your banner information
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm"
          >
            <FiTrash2 className="w-4 h-4" />
            <span>Delete Banner</span>
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="p-6 space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter banner title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description{" "}
                <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter banner description"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
              />
            </div>

            {/* Link Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link URL{" "}
                <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <div className="relative">
                <FiLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Status Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Active Status
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Inactive banners won&apos;t be visible on the website
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.isActive ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    formData.isActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Current Image Preview */}
            {currentImageUrl && !selectedFile && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Image
                </label>
                <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                  <div className="relative h-48 md:h-64">
                    {!imageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    <Image
                      src={currentImageUrl}
                      alt={formData.title || "Banner image"}
                      fill
                      className={`object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                      onLoadingComplete={() => setImageLoaded(true)}
                      onError={() => {
                        console.error("Failed to load image");
                        setImageLoaded(true);
                      }}
                    />
                  </div>
                  <div className="absolute top-2 right-2 flex gap-2">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                      Current
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* New Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {selectedFile ? "New Image Preview" : "Change Image (Optional)"}
              </label>

              {!previewUrl ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                    dragOver
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drag and drop a new image here, or
                  </p>
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-all duration-200"
                  >
                    <FiUpload className="w-4 h-4" />
                    Browse Files
                  </label>
                  <p className="text-xs text-gray-400 mt-3">
                    Leave empty to keep current image. Supports: JPG, PNG, GIF,
                    WebP (Max 5MB)
                  </p>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border border-gray-200">
                  <div className="relative h-48 md:h-64 bg-gray-100">
                    <Image
                      src={previewUrl}
                      alt="New Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-all duration-200 shadow-lg"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 right-2">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
                      New Image
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <FiInfo className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Banner Guidelines:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Recommended image size: 1200 x 400 pixels</li>
                    <li>Keep file size under 2MB for better performance</li>
                    <li>Use high-quality images for better visual appeal</li>
                    <li>
                      Make sure the text is readable on the image background
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  formData.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {formData.isActive ? (
                  <>
                    <FiEye className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </>
                ) : (
                  <>
                    <FiEyeOff className="w-3.5 h-3.5" />
                    <span>Inactive</span>
                  </>
                )}
              </div>

              {selectedFile && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                  <FiUpload className="w-3.5 h-3.5" />
                  <span>New image ready to upload</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="border-t border-gray-200 p-6 bg-gray-50 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/banners")}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating Banner...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  Update Banner
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 rounded-full p-2">
                    <FiTrash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Banner
                  </h3>
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-600 mb-2">
                Are you sure you want to delete{" "}
                <strong className="text-gray-900">
                  &quot;{formData.title}&quot;
                </strong>
                ?
              </p>
              <p className="text-gray-500 text-sm mb-6">
                This action cannot be undone. The banner image will be
                permanently deleted from Cloudinary.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditBannerPage;
