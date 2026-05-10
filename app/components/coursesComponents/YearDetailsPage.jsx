"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  CheckCircle,
  AlertCircle,
  Award,
  GraduationCap,
} from "lucide-react";
import { getYearById } from "@/app/data/yeardata";

const YearDetailsPage = () => {
  const { yearId } = useParams();
  const router = useRouter();

  const data = getYearById(yearId);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-5">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <BookOpen size={32} className="text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white/80 mb-2">
            Year Not Found
          </h2>
          <p className="text-white/40 text-sm mb-6">
            The academic year you are looking for does not exist.
          </p>
          <button
            onClick={() => router.push("/courses")}
            className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition text-sm"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-5 md:p-10">
      <div className="md:max-w-9/12 mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push("/courses")}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
              {data.title}
            </h1>
            <p className="text-white/40 text-sm mt-1">
              {data.courses.length} Courses • {data.totalMarks} Marks •{" "}
              {data.totalCredits} Credits
            </p>
          </div>
        </div>

        {/* Courses List */}
        <div className="space-y-3">
          {data.courses.map((course, index) => (
            <div
              key={index}
              className={`group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-3xl p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 ${
                course.note ? "border-dashed border-white/5 bg-white/2" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Course Number */}
                  <div
                    className={`p-2.5 rounded-xl ${data.bgColor} border ${data.borderColor} shrink-0 ${
                      course.note ? "opacity-50" : ""
                    }`}
                  >
                    <span className={`text-sm font-bold ${data.textColor}`}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Course Info */}
                  <div className="min-w-0">
                    <h3 className="text-sm md:text-base font-medium group-hover:text-white transition-colors leading-relaxed">
                      {course.courseTitle}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className="text-xs text-white/40 flex items-center gap-1">
                        <FileText size={12} />
                        Code: {course.courseCode}
                      </span>

                      {course.marks && (
                        <span className="text-xs text-white/40 flex items-center gap-1">
                          <Award size={12} />
                          {course.marks} Marks
                        </span>
                      )}

                      {course.credits && (
                        <span className="text-xs text-white/40 flex items-center gap-1">
                          <GraduationCap size={12} />
                          {course.credits} Credits
                        </span>
                      )}

                      {course.note && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            course.note === "Or"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          }`}
                        >
                          {course.note}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compulsory Course */}
        {data.compulsoryCourse && (
          <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
                <AlertCircle size={18} className="text-amber-400" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm md:text-base font-medium text-white/90">
                  {data.compulsoryCourse.courseTitle}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="text-xs text-white/40 flex items-center gap-1">
                    <FileText size={12} />
                    Code: {data.compulsoryCourse.courseCode}
                  </span>
                  <span className="text-xs text-white/40 flex items-center gap-1">
                    <Award size={12} />
                    {data.compulsoryCourse.marks} Marks
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {data.compulsoryCourse.credits}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Card */}
        <div className="mt-8 mb-24 md:mb-0 rounded-3xl border border-white/10 bg-linear-to-r from-white/5 to-transparent p-6 md:p-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-white/30 text-xs mb-1">Total Courses</p>
              <p className="text-white/80 text-xl font-bold">
                {data.courses.length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-white/30 text-xs mb-1">Total Marks</p>
              <p className="text-white/80 text-xl font-bold">
                {data.totalMarks}
              </p>
            </div>
            <div className="text-center">
              <p className="text-white/30 text-xs mb-1">Total Credits</p>
              <p className="text-white/80 text-xl font-bold">
                {data.totalCredits}
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <div
              className={`p-2 rounded-full ${data.bgColor} border ${data.borderColor}`}
            >
              <CheckCircle size={16} className={data.textColor} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearDetailsPage;
