import { useEffect, useState } from "react";
import { Search, X, Loader2, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { request } from "@/utils/request/request";
import CourseCard from "@/components/Cards/CourseCard";

export default function Courses() {
  const [course, setCourse] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // --- 1. CORE FETCHING LOGIC ---
  const fetchingData = async () => {
    setLoading(true);
    try {
      const res = await request("course", "get");
      if (res) setCourse(res?.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. DEDICATED SEARCH LOGIC ---
  const handleSearch = async () => {
    if (!query.trim()) {
      fetchingData(); // If search is empty, just reset
      return;
    }
    setLoading(true);
    try {
      const res = await request(`course/search/?q=${query}`, "get");
      if (res) setCourse(res?.data || []);
    } catch (error) {
      console.error("Search Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. RESET LOGIC ---
  const clearSearch = () => {
    setQuery("");
    fetchingData();
  };

  useEffect(() => {
    fetchingData();
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen">
      
      {/* --- HEADER & SEARCH BAR --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-[#002147] tracking-tight">Courses</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage curriculum and view all <span className="font-bold text-slate-700">{course?.length}</span> available courses.
          </p>
        </div>

        <div className="relative group w-full md:w-72">
          {/* Subtle glow effect on focus */}
          <div className="absolute -inset-0.5 bg-[#003868] rounded-xl opacity-0 group-focus-within:opacity-10 transition duration-300 blur-sm"></div>
          
          <div className="relative flex items-center bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm transition-all duration-200">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title... (Press Enter)"
              className="w-full border-none bg-transparent focus-visible:ring-0 text-sm h-8 px-3 shadow-none placeholder:text-slate-400"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            {query && (
              <button 
                onClick={clearSearch}
                className="p-1 rounded-full hover:bg-rose-50 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4 text-slate-400 hover:text-rose-500 transition-colors" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      {loading ? (
        // Loading State
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#003868]" />
          <p className="text-sm font-medium text-slate-500 animate-pulse">Loading courses...</p>
        </div>
      ) : course.length > 0 ? (
        // Data Grid State
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {course.map((item) => (
            <CourseCard key={item?.id || item?._id} data={item} />
          ))}
        </div>
      ) : (
        // Empty State (UX Upgrade)
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mb-4">
            <BookOpen className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No courses found</h3>
          <p className="text-slate-500 max-w-sm">
            {query 
              ? `We couldn't find any courses matching "${query}". Try adjusting your search.` 
              : "There are currently no courses available in the system."}
          </p>
          {query && (
            <button 
              onClick={clearSearch}
              className="mt-6 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
}