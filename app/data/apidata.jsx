import axiosInstance from "../components/sharedComponents/AxiosInstance/AxiosInstance";

export const notices = async () => {
  const res = await axiosInstance.get("/notices");
  return res.data;
};

export const getNoticeById = async (id) => {
  const res = await axiosInstance.get(`/notices/${id}`);
  return res.data;
};

export const getReactionsSummary = async (
  contentId,
  contentType = "notice",
) => {
  const res = await axiosInstance.get(
    `/social/reactions/${contentType}/${contentId}`,
  );
  return res.data;
};

export const getUserReaction = async (
  contentId,
  userId,
  contentType = "notice",
) => {
  const res = await axiosInstance.get(
    `/social/reactions/${contentType}/${contentId}/user?userId=${userId}`,
  );
  return res.data;
};

export const toggleReaction = async (reactionData) => {
  const res = await axiosInstance.post(
    "/social/reactions/toggle",
    reactionData,
  );
  return res.data;
};

export const getComments = async (
  contentId,
  contentType = "notice",
  params = {},
) => {
  const queryString = new URLSearchParams(params).toString();
  const res = await axiosInstance.get(
    `/social/comments/${contentType}/${contentId}?${queryString}`,
  );
  return res.data;
};

export const getReplies = async (commentId, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const res = await axiosInstance.get(
    `/social/comments/replies/${commentId}?${queryString}`,
  );
  return res.data;
};

export const createComment = async (commentData) => {
  const res = await axiosInstance.post("/social/comments", commentData);
  return res.data;
};

export const updateComment = async (commentId, data) => {
  const res = await axiosInstance.put(`/social/comments/${commentId}`, data);
  return res.data;
};

export const deleteComment = async (commentId, data) => {
  const res = await axiosInstance.delete(`/social/comments/${commentId}`, {
    data,
  });
  return res.data;
};

export const toggleCommentLike = async (commentId, data) => {
  const res = await axiosInstance.post(
    `/social/comments/${commentId}/like`,
    data,
  );
  return res.data;
};

export const getCommentCount = async (contentId, contentType = "notice") => {
  const res = await axiosInstance.get(
    `/social/comments/${contentType}/${contentId}/count`,
  );
  return res.data;
};

// about api
export const getAbout = async () => {
  const res = await axiosInstance.get("/about");
  return res.data;
};

export const createAbout = async (formData) => {  
  const res = await axiosInstance.post("/about", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const updateAbout = async (formData) => {
  const res = await axiosInstance.put("/about", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteAboutImage = async () => {
  const res = await axiosInstance.delete("/about/image");
  return res.data;
};

// Gallery API
export const getGallery = async (type = "") => {
  const query = type ? `?type=${type}` : "";
  const res = await axiosInstance.get(`/gallery${query}`);
  return res.data;
};

export const getSingleGallery = async (id) => {
  const res = await axiosInstance.get(`/gallery/${id}`);
  return res.data;
};

export const createGallery = async (formData) => {
  const res = await axiosInstance.post("/gallery", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateGallery = async (id, formData) => {
  const res = await axiosInstance.put(`/gallery/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteGallery = async (id) => {
  const res = await axiosInstance.delete(`/gallery/${id}`);
  return res.data;
};


// user api
export const getCurrentUser = async() =>{
  const res = await axiosInstance.get("/users/me");
  return res.data;
}