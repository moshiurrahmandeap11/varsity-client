"use client";

import { useRouter } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  Award,
  ChevronRight,
  ArrowLeft,
  Layers,
} from "lucide-react";
import { yearData } from "@/app/data/yeardata";

const iconMap = {
  BookOpen: BookOpen,
  GraduationCap: GraduationCap,
};

const CoursesPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="md:max-w-9/12 mx-auto px-5 py-10 md:py-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
              Academic Courses
            </h1>
            <p className="text-white/40 text-sm mt-1">
              National University Honours Curriculum
            </p>
          </div>
        </div>

        {/* Year Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {yearData.map((year) => {
            const IconComponent = iconMap[year.icon] || BookOpen;

            return (
              <div
                key={year.id}
                onClick={() => router.push(`/courses/${year.id}`)}
                className="group cursor-pointer"
              >
                <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl p-6 md:p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 h-full">
                  {/* Gradient Line Top */}
                  <div
                    className={`absolute top-0 left-6 right-6 h-px bg-linear-to-r ${year.color} opacity-50`}
                  />

                  {/* Icon */}
                  <div
                    className={`p-4 rounded-2xl ${year.bgColor} border ${year.borderColor} inline-block mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent size={28} className={year.textColor} />
                  </div>

                  {/* Year Badge */}
                  <span
                    className={`text-xs font-medium ${year.textColor} ${year.bgColor} px-3 py-1 rounded-full border ${year.borderColor} mb-4 inline-block`}
                  >
                    {year.year}
                  </span>

                  {/* Title */}
                  <h2 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-white transition-colors">
                    {year.title}
                  </h2>

                  {/* Description */}
                  <p className="text-white/50 text-sm leading-relaxed mb-6 line-clamp-2">
                    {year.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="text-center p-3 rounded-xl bg-white/5">
                      <Layers
                        size={16}
                        className="text-white/40 mx-auto mb-1"
                      />
                      <span className="text-white/80 text-sm font-medium block">
                        {year.courses.length}
                      </span>
                      <span className="text-white/30 text-[10px]">Courses</span>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/5">
                      <Award size={16} className="text-white/40 mx-auto mb-1" />
                      <span className="text-white/80 text-sm font-medium block">
                        {year.totalMarks}
                      </span>
                      <span className="text-white/30 text-[10px]">Marks</span>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/5">
                      <GraduationCap
                        size={16}
                        className="text-white/40 mx-auto mb-1"
                      />
                      <span className="text-white/80 text-sm font-medium block">
                        {year.totalCredits}
                      </span>
                      <span className="text-white/30 text-[10px]">Credits</span>
                    </div>
                  </div>

                  {/* Explore Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                      Explore Courses
                    </span>
                    <div
                      className={`p-2 rounded-xl ${year.bgColor} border ${year.borderColor} group-hover:scale-110 transition-transform`}
                    >
                      <ChevronRight size={18} className={year.textColor} />
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div
                    className={`absolute inset-0 rounded-3xl bg-linear-to-r ${year.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
