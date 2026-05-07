"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FiImage, FiInfo, FiLink, FiUpload, FiX } from "react-icons/fi";

import Image from "next/image";
import { useRouter } from "next/navigation";
import axiosInstance from "../../sharedComponents/AxiosInstance/AxiosInstance";

const AddBannerPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    isActive: true
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
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
    
    // Validation
    if (!formData.title.trim()) {
      toast.error("Please enter banner title");
      return;
    }
    
    if (!selectedFile) {
      toast.error("Please select a banner image");
      return;
    }

    setLoading(true);
    
    const submitData = new FormData();
    submitData.append("image", selectedFile);
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("link", formData.link);
    submitData.append("isActive", formData.isActive);

    try {
      const res = await axiosInstance.post("/banners/single", submitData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      if (res.data.success) {
        toast.success("Banner created successfully!");
        router.push("/admin/banners");
      } else {
        toast.error(res.data.message || "Failed to create banner");
      }
    } catch (error) {
      console.error("Error creating banner:", error);
      toast.error(error.response?.data?.message || "Failed to create banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 text-black md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Add New Banner</h1>
          <p className="text-gray-500 text-sm mt-1">Create a new banner for your website</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter banner description"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Link Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link URL <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <div className="relative">
                <FiLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-700">Active Status</label>
                <p className="text-xs text-gray-500 mt-1">Inactive banners won&apos;t be visible on the website</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
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

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Image <span className="text-red-500">*</span>
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
                  <p className="text-gray-600 mb-2">Drag and drop an image here, or</p>
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-all duration-200"
                  >
                    <FiUpload className="w-4 h-4" />
                    Browse Files
                  </label>
                  <p className="text-xs text-gray-400 mt-3">
                    Supports: JPG, PNG, GIF, WebP (Max 5MB)
                  </p>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={100}
                    height={100}
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-all duration-200 shadow-lg"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
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
                    <li>Make sure the text is readable on the image background</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="border-t border-gray-200 p-6 bg-gray-50 flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard/all-banners")}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Banner...
                </div>
              ) : (
                "Create Banner"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBannerPage;