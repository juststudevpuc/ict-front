import { Clock, Send, BarChart } from "lucide-react";
import { Card } from "../ui/card";
import { getImageUrl } from "@/utils/helper/helpers";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ data }) => {
  const navigate = useNavigate();

  // Handle case where data might be missing to prevent crashes
  if (!data) return null;

  return (
    <Card className="group flex flex-col h-full border border-slate-100 bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-[#003868]/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Image Area - Navigation on Click */}
      <div
        onClick={() => navigate(`/course/${data?.id || data?._id}`)}
        className="relative block h-52 w-full overflow-hidden bg-slate-50 cursor-pointer"
      >
        <img
          // Check for Cloudinary URL first, fallback to standard image field
          src={getImageUrl(data?.image_url || data?.image)}
          alt={data?.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.src = "https://placehold.co/400x300?text=No+Preview";
          }}
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-[#003868]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        {/* Title: Styled to match the search focus */}
        <h3 className="text-lg font-black text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-[#003868] transition-colors">
          {data?.title}
        </h3>

        {/* Info Tags */}
        <div className="flex items-center gap-4 mb-6 text-[11px] font-black uppercase tracking-wider text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5" />
            <span>{data?.duration_hours || "0h"}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md truncate max-w-[120px]">
            <BarChart className="w-3.5 h-3.5" />
            <span className="truncate">{data?.description || "Course"}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
              Fee
            </span>
            <span className="text-2xl font-black text-[#003868]">
              ${data?.price || "0"}
            </span>
          </div>

          <a
            href="https://t.me/ictinfo2"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#003868] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#003868]/10 hover:bg-[#002b50] transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Contact</span>
          </a>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
