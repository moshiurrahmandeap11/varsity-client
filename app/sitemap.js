export default async function sitemap() {
  const baseUrl = "https://varsity-client.vercel.app";

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notices`);
    const { data: notices } = await res.json();

    const noticeUrls = notices?.map((notice) => ({
      url: `${baseUrl}/notices/${notice._id}`,
      lastModified: new Date(notice.updatedAt),
      changeFrequency: "daily",
      priority: 0.8,
    })) || [];

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 1,
      },
      ...noticeUrls,
    ];
  } catch (error) {
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
    ];
  }
}