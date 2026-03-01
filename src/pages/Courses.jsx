import { useEffect, useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { request } from "@/utils/request/request";
import CourseCard from "@/components/Cards/CourseCard";

export default function Courses() {
  const [course, setCourse] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Initial fetch all courses
  const fetchingData = async () => {
    setLoading(true);
    try {
      const res = await request("course", "get");
      if (res) setCourse(res?.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-[#002147]">Courses</h1>
          <p className="text-slate-500 text-sm italic">Showing {course?.length} results</p>
        </div>

        {/* --- YOUR REQUESTED SEARCH UI --- */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm focus-within:border-[#003868] transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title..."
            className="w-full md:w-48 border-none bg-transparent focus-visible:ring-0 text-sm h-7"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setLoading(true);
                // Logic: Hits the search endpoint with the title query
                request(`course/search/?q=${query}`, "get").then((res) => {
                  if (res) {
                    setCourse(res?.data);
                    setLoading(false);
                  }
                });
              }
            }}
          />
          {query && (
            <X
              className="w-4 h-4 text-slate-300 cursor-pointer hover:text-rose-500"
              onClick={() => {
                setQuery("");
                fetchingData(); // Reset to original list
              }}
            />
          )}
        </div>
      </div>

      {/* GRID AREA */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-300" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {course.map((item) => (
            <CourseCard key={item?.id} data={item} />
          ))}
        </div>
      )}
    </div>
  );
}