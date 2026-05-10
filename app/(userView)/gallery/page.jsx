import Link from "next/link";
import {
  Camera,
  Video,
  ChevronRight,
  Image as ImageIcon,
  Film,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Gallery | ইসলামের ইতিহাস",
  description:
    "ইসলামের ইতিহাস বিভাগের ফটো ও ভিডিও গ্যালারি দেখুন। আনন্দ মোহন ইউনিভার্সিটি কলেজ।",
};

const galleryItems = [
  {
    id: 1,
    name: "Photo Gallery",
    href: "/gallery/photo",
    description:
      "Browse our collection of memorable photos from various events and activities",
    icon: "Camera",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    textColor: "text-blue-400",
  },
  {
    id: 2,
    name: "Video Gallery",
    href: "/gallery/video",
    description:
      "Watch videos of seminars, cultural programs and academic events",
    icon: "Video",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    textColor: "text-purple-400",
  },
];

const iconMap = {
  Camera: Camera,
  Video: Video,
};

const Gallery = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-5 py-10 md:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent mb-4">
            Depertment Gallery
          </h1>
        </div>

        {/* Gallery Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {galleryItems.map((item) => {
            const IconComponent = iconMap[item.icon] || ImageIcon;

            return (
              <Link
                key={item.id}
                href={item.href}
                className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl p-6 md:p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
              >
                {/* Gradient Top Line */}
                <div
                  className={`absolute top-0 left-6 right-6 h-px bg-linear-to-r ${item.color} opacity-50`}
                />

                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`text-[10px] font-medium ${item.textColor} ${item.bgColor} px-2 py-0.5 rounded-full border ${item.borderColor}`}
                  >
                    {item.badge}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className={`p-4 rounded-2xl ${item.bgColor} border ${item.borderColor} inline-block mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent size={28} className={item.textColor} />
                </div>

                {/* Name */}
                <h2 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-white transition-colors">
                  {item.name}
                </h2>

                {/* Description */}
                <p className="text-white/50 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>

                {/* Stats & Arrow */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs text-white/40">{item.stats}</span>
                  <div
                    className={`p-2 rounded-xl ${item.bgColor} border ${item.borderColor} group-hover:scale-110 transition-transform`}
                  >
                    <ChevronRight size={18} className={item.textColor} />
                  </div>
                </div>

                {/* Hover Glow */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-linear-to-r ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}
                />
              </Link>
            );
          })}
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs">
            <ImageIcon size={14} />
            <span>
              Department of Islamic History, Ananda Mohan University College
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
