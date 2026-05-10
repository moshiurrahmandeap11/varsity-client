"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axiosInstance from "../sharedComponents/AxiosInstance/AxiosInstance";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [notices, setNotices] = useState([]);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axiosInstance.get("/banners?activeOnly=true");
        // Filter only active banners
        const activeBanners =
          response.data.data?.filter((banner) => banner.isActive === true) ||
          [];
        setSlides(activeBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    const tryFetching = async () => {
      const res = await axiosInstance.get("/notices");
      setNotices(res.data.data);
    };
    tryFetching();
  }, []);

  // Auto slide only if slides exist
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Create small grid items from remaining banners (excluding current slide)
  const getSmallGridItems = () => {
    if (slides.length < 2) return [];

    // Get banners excluding the current slide and take first 2
    const otherBanners = slides.filter((_, idx) => idx !== currentSlide);
    return otherBanners.slice(0, 2).map((banner, idx) => ({
      id: banner._id,
      title: banner.title,
      description: banner.description || "Special Offer",
      image: banner.image?.url,
    }));
  };

  const smallGridItems = getSmallGridItems();

  // Loading state
  if (loading) {
    return (
      <div className="w-full bg-linear-to-b from-base-200 to-base-100">
        <div className="md:max-w-10/12 mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-96 md:h-125 lg:h-137.5 rounded-2xl bg-gray-200 animate-pulse"></div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="h-48 md:h-64 rounded-2xl bg-gray-200 animate-pulse"></div>
              <div className="h-48 md:h-64 rounded-2xl bg-gray-200 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no active banners
  if (slides.length === 0) {
    return (
      <div className="w-full bg-linear-to-b from-base-200 to-base-100">
        <div className="md:max-w-10/12 mx-auto px-4 py-8 md:py-12">
          <div className="bg-gray-100 rounded-2xl p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-600">
              No Active Banners
            </h2>
            <p className="text-gray-400 mt-2">
              Please add banners from admin panel
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentBanner = slides[currentSlide];

  return (
    <div className="w-full bg-linear-to-b from-base-200 to-base-100">
      <div className="md:max-w-10/12 mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Slider */}
          <div className="lg:col-span-2 relative group">
            <div className="relative h-96 md:h-125 lg:h-137.5 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={
                  currentBanner.image?.url ||
                  "https://via.placeholder.com/1200x600?text=No+Image"
                }
                alt={currentBanner.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

              {/* Banner Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                <div className="inline-block bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-3">
                  Special Offer
                </div>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2">
                  {currentBanner.title}
                </h1>
                {currentBanner.description && (
                  <p className="text-base md:text-xl mb-4 opacity-90">
                    {currentBanner.description}
                  </p>
                )}
                {currentBanner.link && (
                  <Link
                    href={currentBanner.link}
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-full font-semibold transition-all transform hover:scale-105"
                    target={
                      currentBanner.link.startsWith("http") ? "_blank" : "_self"
                    }
                  >
                    Learn More →
                  </Link>
                )}
              </div>

              {/* Navigation Buttons */}
              {slides.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {slides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`transition-all duration-300 ${
                        currentSlide === idx
                          ? "w-6 h-2 bg-amber-500 rounded-full"
                          : "w-2 h-2 bg-white/50 rounded-full hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Small Grid Items */}
          <div className="flex flex-col gap-6">
            {smallGridItems.map((item) => (
              <div
                key={item.id}
                className="relative group h-48 md:h-61.25 lg:h-66.25 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              >
                <Image
                  src={
                    item.image ||
                    "https://via.placeholder.com/600x400?text=No+Image"
                  }
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <div className="inline-block bg-amber-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold mb-2">
                    {item.description}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 line-clamp-1">
                    {item.title}
                  </h3>
                  <Link
                    href={
                      slides.find((s) => s._id === item.id)?.link || "/products"
                    }
                    className="inline-flex items-center gap-1 text-sm bg-white/20 backdrop-blur-sm hover:bg-white hover:text-gray-900 px-3 py-1 rounded-full transition-all"
                    target="_self"
                  >
                    Explore →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-linear-to-r from-red-500 via-orange-500 to-amber-500 shadow-2xl">
          <div className="relative flex overflow-x-hidden py-3">
            <div className="animate-marquee whitespace-nowrap">
              <Link href={"/notices"}>
                {notices?.map((notice) => (
                  <span
                    key={notice?._id}
                    className="mx-8 inline-flex items-center text-sm font-semibold text-white md:text-base"
                  >
                    {notice?.title}
                  </span>
                ))}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Animation CSS */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Hero;
