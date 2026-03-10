import { request } from "@/utils/request/request";
import { GraduationCap, Users, Trophy, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Aboutict() {
  const [student, setStudent] = useState([]);
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(false); // Make sure you have this!
  const navigate = useNavigate();
  

  const fetchingData = async () => {
    setLoading(true);
    try {
      // 1. Fetch both endpoints at the same time for faster loading
      const [courseRes, studentRes] = await Promise.all([
        request("course", "get"),
        request("student", "get"),
      ]);

      // 2. Set the state
      if (courseRes) setCourse(courseRes?.data || []);
      if (studentRes) setStudent(studentRes?.data || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

  return (
    <div className="bg-white">
      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center overflow-hidden group">
        {/* Background with Zoom Effect */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="image/ict6.jpg"
            alt="ICT Center Campus"
            className="w-full h-full object-cover object-center transition-transform duration-[2000ms] group-hover:scale-110"
          />
        </div>

        {/* Dynamic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent z-10" />

        {/* Content Container */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="max-w-2xl">
            <div className="h-1.5 w-16 bg-amber-500 mb-8 rounded-full"></div>

            <h1 className="text-white font-serif font-bold tracking-tight leading-[1.1] drop-shadow-xl text-5xl sm:text-6xl md:text-7xl">
              ICT Center <br />
              <span className="block mt-3 font-sans font-extralight text-3xl sm:text-4xl md:text-5xl text-amber-600">
                Of Technology
              </span>
            </h1>

            <p className="mt-8 text-xl leading-relaxed text-slate-100 max-w-lg font-light drop-shadow-md">
              Empowering the next generation of innovators in Cambodia. We
              provide world-class training in Web Development, IT, Network and
              Design.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button onClick={() => navigate("/coursePage") } className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-all transform hover:-translate-y-1 shadow-lg">
                Explore Courses
              </button>
              <button className="px-8 py-4 border-2 border-white/30 hover:border-white text-white font-bold rounded-lg backdrop-blur-sm transition-all">
                Our Mission
              </button>
            </div>
          </div>
        </div>

        {/* --- STATS OVERLAY (Bottom of Hero) --- */}
        <div className="absolute bottom-0 left-0 w-full bg-white/5 backdrop-blur-md border-t border-white/10 z-20 py-8 hidden md:block">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-4 gap-8">
            <StatItem
              icon={<Users size={20} />}
              label="Active Students"
              value={loading ? "...." : `${student?.length || 0}`}
            />
            {/* <StatItem icon={<GraduationCap size={20}/>} label="Graduate Success" value="95%" /> */}
            <StatItem
              icon={<BookOpen size={20} />}
              label="Expert Courses"
              value={loading ? "...." : `${course?.length || 0}`}
            />
            {/* <StatItem icon={<Trophy size={20}/>} label="Industry Awards" value="12" /> */}
          </div>
        </div>
      </section>

      {/* --- CORE VALUES SECTION --- */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-sm font-black text-amber-600 uppercase tracking-[0.3em] mb-4">
              Why Choose Us
            </h2>
            <h3 className="text-4xl font-bold text-slate-900 leading-tight mb-6">
              A Tradition of Innovation <br /> Since 2015
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Located in the heart of Cambodia, the ICT Center provides a unique
              environment where technology meets practical application. Our
              curriculum is designed with industry leaders to ensure every
              student is job-ready.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                <div className="h-2 w-2 bg-amber-500 rounded-full"></div> 24/7
                Modern Lab Access
              </li>
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                <div className="h-2 w-2 bg-amber-500 rounded-full"></div>{" "}
                Certified Expert Mentors
              </li>
              <li className="flex items-center gap-3 text-slate-700 font-medium">
                <div className="h-2 w-2 bg-amber-500 rounded-full"></div> Direct
                Job Placement Support
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="image/ict7.jpg"
                className="rounded-2xl shadow-lg h-64 w-full object-cover"
                alt="Lab"
              />
              <div className="bg-slate-900 p-8 rounded-2xl text-white">
                <h4 className="text-3xl font-bold mb-2">#none</h4>
                <p className="text-slate-400 text-sm">Tech Center in Region</p>
              </div>
            </div>
            <div className="pt-12 space-y-4">
              <div className="bg-amber-500 p-8 rounded-2xl text-slate-900">
                <h4 className="text-3xl font-bold mb-2">0</h4>
                <p className="text-amber-900 text-sm italic font-medium">
                  Global Partners
                </p>
              </div>
              <img
                src="image/ict04.jpg"
                className="rounded-2xl shadow-lg h-64 w-full object-cover"
                alt="Student"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper Component for Stats
function StatItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 text-white">
      <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="text-xs text-slate-400 uppercase tracking-widest font-medium">
          {label}
        </div>
      </div>
    </div>
  );
}
