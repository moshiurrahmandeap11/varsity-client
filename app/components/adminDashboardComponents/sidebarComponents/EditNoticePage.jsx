"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  FiX,
} from "react-icons/fi";

import axiosInstance from "../../sharedComponents/AxiosInstance/AxiosInstance";

const EditNoticePage = () => {
  const router = useRouter();
  const params = useParams();

  const noticeId = params?.id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [dragOver, setDragOver] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [currentFile, setCurrentFile] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
    priority: "normal",
    isActive: true,
    publishDate: "",
    expiryDate: "",
    author: "",
  });

  // FETCH NOTICE
  const fetchNotice = async () => {
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
          publishDate: notice.publishDate
            ? new Date(notice.publishDate).toISOString().split("T")[0]
            : "",
          expiryDate: notice.expiryDate
            ? new Date(notice.expiryDate).toISOString().split("T")[0]
            : "",
          author: notice.author || "",
        });

        setCurrentFile(notice.file || null);
      }
    } catch (err) {
      console.error(err);

      toast.error("Failed to fetch notice");

      router.push("/dashboard/notices");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    const tryFetchNotice = async () => {
      if (noticeId) {
        fetchNotice();
      }
    };
    tryFetchNotice();
  }, [noticeId]);

  // INPUT
  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // FILE
  const processFile = (file) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size max 10MB");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e) => {
    processFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setDragOver(false);

    processFile(e.dataTransfer.files[0]);
  };

  // REMOVE FILE
  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title required");
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();

      if (selectedFile) {
        submitData.append("file", selectedFile);
      }

      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });

      const res = await axiosInstance.put(`/notices/${noticeId}`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Notice updated");

        router.push("/admin/notices");
      }
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Failed to update notice");
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async () => {
    try {
      const res = await axiosInstance.delete(`/notices/${noticeId}`);

      if (res.data.success) {
        toast.success("Notice deleted");

        router.push("/admin/notices");
      }
    } catch (err) {
      console.error(err);

      toast.error("Failed to delete notice");
    }
  };

  // LOADING
  if (fetching) {
    return (
      <div className="min-h-screen bg-[#070b14] p-6">
        <div className="max-w-5xl mx-auto">
          <div
            className="
            h-175
            rounded-4xl
            border border-white/10
            bg-white/5
            animate-pulse
          "
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#070b14] text-white relative">
      {/* BG */}
      <div className="absolute top-0 left-0 w-125 h-125 bg-blue-500/10 blur-[120px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-125 h-125 bg-cyan-500/10 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-5xl mx-auto p-4 md:p-8">
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

          <div className="relative flex flex-col md:flex-row justify-between gap-5">
            <div>
              <Link
                href="/admin/notices"
                className="
                inline-flex items-center gap-2
                text-gray-400 hover:text-white
                mb-3 transition-all
              "
              >
                <FiArrowLeft />
                Back to Notices
              </Link>

              <h1 className="text-4xl font-bold">Edit Notice</h1>

              <p className="text-gray-400 mt-2">
                Update and manage notice details
              </p>
            </div>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="
              h-12 px-5
              rounded-2xl
              bg-red-500/20
              border border-red-500/20
              text-red-200
              hover:bg-red-500/30
              transition-all
              flex items-center gap-2
            "
            >
              <FiTrash2 />
              Delete Notice
            </button>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="
          rounded-4xl
          border border-white/10
          bg-white/5
          backdrop-blur-2xl
          overflow-hidden
        "
        >
          <div className="p-8 space-y-8">
            {/* TITLE */}
            <div>
              <label className="block text-sm text-gray-300 mb-3">
                Notice Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter notice title"
                className="
                w-full h-14
                rounded-2xl
                border border-white/10
                bg-white/5
                backdrop-blur-xl
                px-5
                outline-none
                transition-all
                focus:border-blue-500/40
                focus:bg-white/10
              "
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm text-gray-300 mb-3">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                placeholder="Enter description..."
                className="
                w-full
                rounded-2xl
                border border-white/10
                bg-white/5
                backdrop-blur-xl
                px-5 py-4
                outline-none
                resize-none
                transition-all
                focus:border-blue-500/40
                focus:bg-white/10
              "
              />
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* CATEGORY */}
              <div>
                <label className="block text-sm text-gray-300 mb-3">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="
                  w-full h-14
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                  backdrop-blur-xl
                  px-5
                  outline-none
                "
                >
                  <option value="general">General</option>

                  <option value="academic">Academic</option>

                  <option value="exam">Exam</option>

                  <option value="event">Event</option>

                  <option value="holiday">Holiday</option>

                  <option value="result">Result</option>
                </select>
              </div>

              {/* PRIORITY */}
              <div>
                <label className="block text-sm text-gray-300 mb-3">
                  Priority
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="
                  w-full h-14
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                  backdrop-blur-xl
                  px-5
                  outline-none
                "
                >
                  <option value="normal">Normal</option>

                  <option value="high">High</option>

                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* AUTHOR */}
            <div>
              <label className="block text-sm text-gray-300 mb-3">Author</label>

              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Enter author"
                className="
                w-full h-14
                rounded-2xl
                border border-white/10
                bg-white/5
                backdrop-blur-xl
                px-5
                outline-none
              "
              />
            </div>

            {/* DATES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                  <FiCalendar />
                  Publish Date
                </label>

                <input
                  type="date"
                  name="publishDate"
                  value={formData.publishDate}
                  onChange={handleInputChange}
                  className="
                  w-full h-14
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                  backdrop-blur-xl
                  px-5
                  outline-none
                "
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                  <FiClock />
                  Expiry Date
                </label>

                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="
                  w-full h-14
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                  backdrop-blur-xl
                  px-5
                  outline-none
                "
                />
              </div>
            </div>

            {/* STATUS */}
            <div
              className="
              flex items-center justify-between
              rounded-3xl
              border border-white/10
              bg-white/5
              p-5
            "
            >
              <div>
                <h3 className="font-medium">Active Notice</h3>

                <p className="text-sm text-gray-400 mt-1">
                  Inactive notices will not appear publicly
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: !prev.isActive,
                  }))
                }
                className={`
                relative h-8 w-16 rounded-full transition-all
                ${formData.isActive ? "bg-blue-500" : "bg-white/10"}
              `}
              >
                <span
                  className={`
                  absolute top-1
                  h-6 w-6 rounded-full bg-white
                  transition-all
                  ${formData.isActive ? "left-9" : "left-1"}
                `}
                />
              </button>
            </div>

            {/* FILE */}
            <div>
              <label className="block text-sm text-gray-300 mb-3">
                Attachment
              </label>

              {!selectedFile ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`
                  relative overflow-hidden
                  rounded-[28px]
                  border-2 border-dashed
                  p-10 text-center
                  transition-all
                  ${
                    dragOver
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/10 bg-white/5"
                  }
                `}
                >
                  <input
                    type="file"
                    id="upload"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <div className="relative z-10">
                    <div
                      className="
                      w-20 h-20 mx-auto mb-5
                      rounded-3xl
                      bg-white/10
                      flex items-center justify-center
                    "
                    >
                      <FiUpload className="text-3xl text-gray-300" />
                    </div>

                    <h3 className="text-xl font-semibold mb-2">
                      Upload New File
                    </h3>

                    <p className="text-gray-400 mb-6">
                      Drag & drop or browse files
                    </p>

                    <label
                      htmlFor="upload"
                      className="
                      inline-flex items-center gap-2
                      h-12 px-5
                      rounded-2xl
                      bg-blue-500
                      hover:bg-blue-600
                      cursor-pointer
                      transition-all
                    "
                    >
                      <FiUpload />
                      Browse File
                    </label>
                  </div>
                </div>
              ) : (
                <div
                  className="
                  rounded-3xl
                  border border-white/10
                  bg-white/5
                  p-5
                "
                >
                  <div className="flex items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <div
                        className="
                        w-14 h-14
                        rounded-2xl
                        bg-green-500/20
                        flex items-center justify-center
                      "
                      >
                        <FiFile className="text-green-300 text-xl" />
                      </div>

                      <div>
                        <h3 className="font-medium">{selectedFile.name}</h3>

                        <p className="text-sm text-gray-400 mt-1">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={removeFile}
                      className="
                      w-11 h-11
                      rounded-2xl
                      bg-red-500/20
                      border border-red-500/20
                      text-red-300
                      hover:bg-red-500/30
                    "
                    >
                      <FiX className="mx-auto" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* INFO */}
            <div
              className="
              rounded-3xl
              border border-blue-500/20
              bg-blue-500/10
              p-5
            "
            >
              <div className="flex gap-4">
                <div
                  className="
                  w-12 h-12 rounded-2xl
                  bg-blue-500/20
                  flex items-center justify-center
                  shrink-0
                "
                >
                  <FiInfo className="text-blue-300 text-xl" />
                </div>

                <div>
                  <h3 className="font-medium mb-2">Guidelines</h3>

                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Use descriptive titles</li>

                    <li>• Upload relevant documents</li>

                    <li>• Set proper priority level</li>

                    <li>• Expired notices auto-hide</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div
            className="
            border-t border-white/10
            bg-white/3
            p-6
            flex flex-col sm:flex-row gap-4
          "
          >
            <button
              type="button"
              onClick={() => router.push("/admin/notices")}
              className="
              h-14 px-6
              rounded-2xl
              border border-white/10
              bg-white/5
              hover:bg-white/10
              transition-all
            "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
              flex-1 h-14
              rounded-2xl
              bg-blue-500
              hover:bg-blue-600
              disabled:opacity-50
              transition-all
              flex items-center justify-center gap-3
              font-medium
            "
            >
              {loading ? (
                <>
                  <div
                    className="
                    w-5 h-5
                    border-2 border-white
                    border-t-transparent
                    rounded-full
                    animate-spin
                  "
                  />
                  Updating...
                </>
              ) : (
                <>
                  <FiSave />
                  Update Notice
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div
          className="
          fixed inset-0 z-999
          bg-black/70
          backdrop-blur-xl
          flex items-center justify-center
          p-4
        "
        >
          <div
            className="
            w-full max-w-md
            rounded-4xl
            border border-white/10
            bg-[#0f172a]/90
            backdrop-blur-2xl
            overflow-hidden
          "
          >
            <div className="p-8">
              <div
                className="
                w-16 h-16
                rounded-3xl
                bg-red-500/20
                flex items-center justify-center
                mb-5
              "
              >
                <FiAlertCircle className="text-red-300 text-3xl" />
              </div>

              <h2 className="text-2xl font-bold mb-3">Delete Notice?</h2>

              <p className="text-gray-400 leading-relaxed">
                This action cannot be undone. Attached files will also be
                permanently deleted.
              </p>
            </div>

            <div
              className="
              border-t border-white/10
              p-6
              flex gap-4
            "
            >
              <button
                onClick={() => setShowDeleteModal(false)}
                className="
                flex-1 h-12
                rounded-2xl
                border border-white/10
                bg-white/5
              "
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="
                flex-1 h-12
                rounded-2xl
                bg-red-500
                hover:bg-red-600
                transition-all
              "
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditNoticePage;
