"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Ray-Ban Wayfarer",
      subtitle: "Classic Summer Style",
      offer: "50% OFF",
      image:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=600&fit=crop",
    },
    {
      id: 2,
      title: "Flamingo Float",
      subtitle: "Pool Party Essential",
      offer: "30% OFF",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
    },
    {
      id: 3,
      title: "Watermelon Cooler",
      subtitle: "Stay Refreshed",
      offer: "20% OFF",
      image:
        "https://i.postimg.cc/kXWRSHNZ/summer-travel-destination-design-summer-vacation-holiday-concept-perfect-tranquil-beach-scene-soft-s.webp",
    },
    {
      id: 4,
      title: "Beach Floral",
      subtitle: "Tropical Vibes",
      offer: "25% OFF",
      image:
        "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=800&h=600&fit=crop",
    },
    {
      id: 5,
      title: "Pool Floats",
      subtitle: "Summer Fun",
      offer: "40% OFF",
      image:
        "https://i.postimg.cc/X76pn8Mk/photo-1621789098261-433128ee8d1e.avif",
    },
    {
      id: 6,
      title: "Red Beach Flowers",
      subtitle: "Hawaiian Charm",
      offer: "15% OFF",
      image:
        "https://images.unsplash.com/photo-1470506028280-a011fb34b6f7?w=800&h=600&fit=crop",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const smallGridItems = [
    {
      id: 2,
      title: "Beach Accessories",
      description: "Up to 40% OFF",
      image: slides[1].image,
    },
    {
      id: 5,
      title: "Pool Party",
      description: "Hot Deals 🔥",
      image: slides[4].image,
    },
  ];

  return (
    <div className="w-full bg-linear-to-b from-base-200 to-base-100">
      <div className="md:max-w-10/12 mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative group">
            <div className="relative h-100 md:h-125 lg:h-137.5 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                <div className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-3">
                  {slides[currentSlide].offer}
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-lg md:text-xl mb-4 opacity-90">
                  {slides[currentSlide].subtitle}
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-full font-semibold transition-all transform hover:scale-105"
                >
                  Shop Now →
                </Link>
              </div>

              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
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
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {smallGridItems.map((item) => (
              <div
                key={item.id}
                className="relative group h-50 md:h-61.25 lg:h-66.25 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <div className="inline-block bg-amber-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold mb-2">
                    {item.description}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">
                    {item.title}
                  </h3>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-1 text-sm bg-white/20 backdrop-blur-sm hover:bg-white hover:text-gray-900 px-3 py-1 rounded-full transition-all"
                  >
                    Explore →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-linear-to-r from-red-500 via-orange-500 to-amber-500 rounded-xl overflow-hidden shadow-lg">
          <div className="py-3 px-4 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <span className="inline-flex items-center gap-8 text-white font-semibold">
                🔥 HOT SUMMER DEALS 🔥 &nbsp;&nbsp;|&nbsp;&nbsp; ☀️ 50% OFF
                Sunglasses &nbsp;&nbsp;|&nbsp;&nbsp; 🏖️ Buy 2 Get 1 Free on
                Beach Accessories &nbsp;&nbsp;|&nbsp;&nbsp; 💄 30% OFF Skincare
                &nbsp;&nbsp;|&nbsp;&nbsp; 👕 Summer Outfits Starting $19.99
                &nbsp;&nbsp;|&nbsp;&nbsp; 🚚 Free Shipping Over $50
                &nbsp;&nbsp;|&nbsp;&nbsp; 🔥 HOT SUMMER DEALS 🔥
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;