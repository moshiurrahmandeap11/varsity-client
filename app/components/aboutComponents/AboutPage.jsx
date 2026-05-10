"use client";

import { useQuery } from "@tanstack/react-query";
import { getAbout } from "@/app/data/apidata";
import Image from "next/image";
import {
  BookOpen,
  MapPin,
  Mail,
  Phone,
  Clock,
  Calendar,
  Users,
  GraduationCap,
  Loader2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const AboutPage = () => {
  const {
    data: aboutData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["about"],
    queryFn: getAbout,
  });

  const about = aboutData?.data;

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Loader2 size={28} className="animate-spin text-white/60" />
            </div>
          </div>
          <span className="text-white/40 text-sm">Loading about section...</span>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-5">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white/80 mb-2">
            Something went wrong
          </h2>
          <p className="text-red-400 text-sm mb-6">{error?.message || "Failed to load about section"}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (!about) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-5">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <BookOpen size={32} className="text-white/30" />
          </div>
          <h2 className="text-xl font-semibold text-white/60 mb-2">
            About section coming soon
          </h2>
          <p className="text-white/40 text-sm">
            We are working on updating our about section. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-purple-500/5 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-125 bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-10/12 md:max-w-9/12 mx-auto py-8 md:py-24">
          {/* Breadcrumb */}
          <div className="flex  gap-2 text-sm text-white/40 mb-8">
            <Link href="/" className="hover:text-white/60 transition">
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-white/60">About</span>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left - Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
                <GraduationCap size={14} />
                <span>Department of Islamic History</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent leading-tight">
                {about.title}
              </h1>

              <p className="text-white/50 text-sm mt-4">
                Ananda Mohan University College, Mymensingh
              </p>
            </div>

            {/* Right - Image */}
            {about.image && (
              <div className="relative">
                <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-purple-500 rounded-3xl blur opacity-20" />
                <div className="relative rounded-3xl overflow-hidden border border-white/10">
                  <Image
                    src={about.image.url}
                    alt={about.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                {/* Decorative Elements */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center">
                  <BookOpen size={32} className="text-white/30" />
                </div>
                <div className="absolute -top-4 -left-4 w-16 h-16 rounded-xl bg-linear-to-br from-blue-500/20 to-purple-500/20 border border-white/10 backdrop-blur-xl" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Description Section */}
      {about.description && (
        <section className="py-8">
          <div className="max-w-11/12 md:max-w-9/12 mx-auto">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl p-3 md:p-10">
              <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <BookOpen size={20} className="text-blue-400" />
                </div>
                About Our Department
              </h2>

              {/* Rich Text Content */}
              <div
                className="prose prose-invert max-w-none 
                  prose-headings:text-white/90 
                  prose-p:text-white/70 
                  prose-p:leading-relaxed
                  prose-strong:text-white/90 
                  prose-a:text-blue-400 
                  prose-a:no-underline 
                  prose-a:hover:underline
                  prose-ul:text-white/70 
                  prose-ol:text-white/70
                  prose-li:text-white/70
                  text-sm md:text-base"
                dangerouslySetInnerHTML={{ __html: about.description }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Contact Info Section */}
      <section className="py-8 px-5">
        <div className="max-w-11/12 md:max-w-9/12 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Address */}
            <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-3xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 inline-block mb-4 group-hover:scale-110 transition-transform">
                <MapPin size={22} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Address</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Department of Islamic History<br />
                Ananda Mohan University College<br />
                Mymensingh-2200, Bangladesh
              </p>
            </div>

            {/* Email */}
            <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-3xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 inline-block mb-4 group-hover:scale-110 transition-transform">
                <Mail size={22} className="text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <a
                href="mailto:islamichistory@amuc.edu.bd"
                className="text-blue-400 hover:text-blue-300 text-sm transition"
              >
                islamichistory@amuc.edu.bd
              </a>
            </div>

            {/* Phone */}
            <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-3xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 inline-block mb-4 group-hover:scale-110 transition-transform">
                <Phone size={22} className="text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <a
                href="tel:+8801234567890"
                className="text-blue-400 hover:text-blue-300 text-sm transition"
              >
                +880 1234-567890
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Office Hours */}
      <section className="py-8 mb-20 md:mb-0 px-5">
        <div className="max-w-11/12 md:max-w-9/12 mx-auto">
          <div className="rounded-3xl border border-white/10 bg-linear-to-r from-white/5 to-transparent backdrop-blur-3xl p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Clock size={22} className="text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Office Hours</h3>
                <p className="text-white/40 text-sm">When you can visit us</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/40 text-xs mb-1">Sunday - Wednesday</p>
                <p className="text-white/80 font-medium">9:00 AM - 4:00 PM</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/40 text-xs mb-1">Thursday</p>
                <p className="text-white/80 font-medium">9:00 AM - 2:00 PM</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 sm:col-span-2">
                <p className="text-white/40 text-xs mb-1">Friday</p>
                <p className="text-white/80 font-medium">Closed</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;