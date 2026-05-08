"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
    FiAlertCircle,
    FiArrowLeft,
    FiCalendar,
    FiClock,
    FiFile,
    FiInfo,
    FiSave,
    FiTrash2,
    FiUpload,
    FiX
} from "react-icons/fi";
import axiosInstance from "../../sharedComponents/AxiosInstance/AxiosInstance";

const EditNoticePage = ({ params }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
    priority: "normal",
    isActive: true,
    publishDate: "",
    expiryDate: "",
    author: ""
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const noticeId = params?.id;

  // Fetch notice data
  const fetchNotice = async () => {
    if (!noticeId) {
      toast.error("Invalid notice ID");
      router.push("/dashboard/notices");
      return;
    }

    try {
      const res = await axiosInstance.get(`/notices/${noticeId}`);
      if (res.data.success) {
        const notice = res.data.data;
        setFormData({
          title: notice.title || "",
          description: notice.description || "",
          category: notice.category || "general",
          priority: notice.priority || "normal",
          isActive: notice.isActive !== undefined ? notice.isActive : true,
          publishDate: notice.publishDate ? new Date(notice.publishDate).toISOString().split('T')[0] : "",
          expiryDate: notice.expiryDate ? new Date(notice.expiryDate).toISOString().split('T')[0] : "",
          author: notice.author || ""
        });
        setCurrentFile(notice.file || null);
      } else {
        toast.error(res.data.message || "Failed to fetch notice");
        router.push("/dashboard/notices");
      }
    } catch (error) {
      console.error("Error fetching notice:", error);
      toast.error("Failed to fetch notice data");
      router.push("/dashboard/notices");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (noticeId) {
      fetchNotice();
    }
  }, [noticeId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
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
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should be less than 10MB");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  // Remove current file
  const removeCurrentFile = () => {
    setCurrentFile(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Please enter notice title");
      return;
    }

    setLoading(true);
    
    const submitData = new FormData();
    if (selectedFile) {
      submitData.append("file", selectedFile);
    }
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("category", formData.category);
    submitData.append("priority", formData.priority);
    submitData.append("isActive", formData.isActive);
    submitData.append("publishDate", formData.publishDate);
    submitData.append("expiryDate", formData.expiryDate);
    submitData.append("author", formData.author);

    try {
      const res = await axiosInstance.put(`/notices/${noticeId}`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      if (res.data.success) {
        toast.success("Notice updated successfully!");
        router.push("/dashboard/notices");
      } else {
        toast.error(res.data.message || "Failed to update notice");
      }
    } catch (error) {
      console.error("Error updating notice:", error);
      toast.error(error.response?.data?.message || "Failed to update notice");
    } finally {
      setLoading(false);
    }
  };

  // Delete notice
  const handleDelete = async () => {
    try {
      const res = await axiosInstance.delete(`/notices/${noticeId}`);
      if (res.data.success) {
        toast.success("Notice deleted successfully!");
        router.push("/dashboard/notices");
      } else {
        toast.error(res.data.message || "Failed to delete notice");
      }
    } catch (error) {
      console.error("Error deleting notice:", error);
      toast.error("Failed to delete notice");
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Loading skeleton
  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg p-6 space-y-6">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Link 
                href="/dashboard/notices" 
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2 transition-colors"
              >
                <FiArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Notices</span>
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Edit Notice
              </h1>
              <p className="text-gray-500 text-sm mt-1">Update your notice information</p>
            </div>
            
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md"
            >
              <FiTrash2 className="w-4 h-4" />
              <span>Delete Notice</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notice Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter notice title"
                className="w-full px-4 py-2.5 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                placeholder="Enter notice description"
                rows="4"
                className="w-full px-4 py-2.5 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
              />
            </div>

            {/* Category and Priority Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General</option>
                  <option value="academic">Academic</option>
                  <option value="exam">Exam</option>
                  <option value="event">Event</option>
                  <option value="holiday">Holiday</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Author Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Enter author name"
                className="w-full px-4 py-2.5 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Publish Date and Expiry Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCalendar className="inline mr-1 w-4 h-4" /> Publish Date
                </label>
                <input
                  type="date"
                  name="publishDate"
                  value={formData.publishDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiClock className="inline mr-1 w-4 h-4" /> Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Status Toggle */}
            <div className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
              <div>
                <label className="text-sm font-medium text-gray-700">Active Status</label>
                <p className="text-xs text-gray-500 mt-1">Inactive notices won't be visible on the website</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.isActive ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    formData.isActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Current File Preview */}
            {currentFile && !selectedFile && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Attachment
                </label>
                <div className="relative bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                      <FiFile className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{currentFile.originalName}</p>
                      <p className="text-xs text-gray-400">
                        {(currentFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <a
                      href={currentFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1 rounded-lg bg-blue-50"
                    >
                      View
                    </a>
                    <button
                      type="button"
                      onClick={removeCurrentFile}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* New File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {selectedFile ? "New File Preview" : "Change Attachment (Optional)"}
              </label>
              
              {!previewUrl ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    dragOver
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-gray-300 hover:border-gray-400 bg-white/30"
                  }`}
                >
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Drag and drop a file here, or</p>
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-2 rounded-xl cursor-pointer transition-all duration-200"
                  >
                    <FiUpload className="w-4 h-4" />
                    Browse Files
                  </label>
                  <p className="text-xs text-gray-400 mt-3">
                    Supports: Images, PDF, DOC, DOCX, XLS, XLSX (Max 10MB)
                  </p>
                </div>
              ) : (
                <div className="relative bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white">
                      <FiFile className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{selectedFile.name}</p>
                      <p className="text-xs text-gray-400">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex gap-3">
                <FiInfo className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Notice Guidelines:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Keep notice title clear and descriptive</li>
                    <li>Attach relevant files if needed</li>
                    <li>Set priority appropriately for important notices</li>
                    <li>Expired notices won't be shown automatically</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="border-t border-gray-200 p-6 bg-white/30 backdrop-blur-sm flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard/notices")}
              className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-2.5 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating Notice...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  Update Notice
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 rounded-full p-2">
                    <FiAlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Notice</h3>
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete <strong className="text-gray-900">"{formData.title}"</strong>?
              </p>
              <p className="text-gray-500 text-sm mb-6">
                This action cannot be undone. The attached file will be permanently deleted.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200"
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

export default EditNoticePage;