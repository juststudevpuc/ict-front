import { Button } from "@/components/ui/button";
import { request } from "@/utils/request/request";
import { BookOpen, Briefcase, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { GiTeacher } from "react-icons/gi";

export default function Dashboard() {
  const [student, setStudent] = useState([]);
  const [course, setCourse] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [instructor, setInstructor] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchingData = async () => {
    setLoading(true);
    try {
      // 1. Fetch both endpoints at the same time for faster loading
      const [courseRes, studentRes, employeeRes, instructorRes, usersRes] =
        await Promise.all([
          request("course", "get"),
          request("student", "get"),
          request("employee", "get"),
          request("instructor", "get"),
          request("users", "get"),
        ]);

      // 2. Set the state
      if (courseRes) setCourse(courseRes?.data || []);
      if (studentRes) setStudent(studentRes?.data || []);
      if (employeeRes) setEmployee(employeeRes?.data || []);
      if (instructorRes) setInstructor(instructorRes.data || []);
      if (usersRes) setUsersList(usersRes.data || []);
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
    <div className="p-6 md:p-8">
      {/* Header Section */}
      <div className="mb-8 border-b border-slate-300 pb-4">
        <h1 className="text-2xl font-black text-[#003868] uppercase tracking-wide">
          Dashboard Overview
        </h1>
        <p className="text-xs font-bold text-slate-400 uppercase mt-1">
          ICT Center Management System
        </p>
      </div>

      {/* ✅ Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* --- STUDENTS CARD --- */}
        <div className="bg-[#573fd1] border-l-4 border-l-[#723096] shadow-md p-6 flex items-center justify-between rounded-none transition-transform hover:-translate-y-1 cursor-pointer group">
          <div>
            <p className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-1">
            User login
            </p>
            <h3 className="text-3xl font-black text-white">
              {loading ? "..." : usersList?.length || 0}
            </h3>
          </div>
          {/* ✅ Made the icon box slightly darker for contrast */}
          <div className="p-4 bg-[#723096] text-white shadow-inner rounded-none transition-colors group-hover:bg-[#6e0b61]">
            <Users size={24} strokeWidth={2.5} />
          </div>
        </div>
        <div className="bg-[#003868] border-l-4 border-l-[#001f3f] shadow-md p-6 flex items-center justify-between rounded-none transition-transform hover:-translate-y-1 cursor-pointer group">
          <div>
            <p className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-1">
              Total Students
            </p>
            <h3 className="text-3xl font-black text-white">
              {loading ? "..." : student?.length || 0}
            </h3>
          </div>
          {/* ✅ Made the icon box slightly darker for contrast */}
          <div className="p-4 bg-[#002b50] text-white shadow-inner rounded-none transition-colors group-hover:bg-[#001f3f]">
            <Users size={24} strokeWidth={2.5} />
          </div>
        </div>

        {/* --- COURSES CARD --- */}
        <div className="bg-emerald-600 border-l-4 border-l-emerald-800 shadow-md p-6 flex items-center justify-between rounded-none transition-transform hover:-translate-y-1 cursor-pointer group">
          <div>
            <p className="text-xs font-bold text-emerald-100 uppercase tracking-widest mb-1">
              Active Courses
            </p>
            <h3 className="text-3xl font-black text-white">
              {loading ? "..." : course?.length || 0}
            </h3>
          </div>
          <div className="p-4 bg-emerald-700 text-white shadow-inner rounded-none transition-colors group-hover:bg-emerald-800">
            <BookOpen size={24} strokeWidth={2.5} />
          </div>
        </div>

        {/* --- EMPLOYEES CARD --- */}
        <div className="bg-amber-500 border-l-4 border-l-amber-700 shadow-md p-6 flex items-center justify-between rounded-none transition-transform hover:-translate-y-1 cursor-pointer group">
          <div>
            <p className="text-xs font-bold text-amber-100 uppercase tracking-widest mb-1">
              Employees
            </p>
            <h3 className="text-3xl font-black text-white">
              {loading ? "..." : employee?.length || 0}
            </h3>
          </div>
          <div className="p-4 bg-amber-600 text-white shadow-inner rounded-none transition-colors group-hover:bg-amber-700">
            <Briefcase size={24} strokeWidth={2.5} />
          </div>
        </div>

        {/* --- INSTRUCTOR CARD --- */}
        <div className="bg-sky-600 border-l-4 border-l-sky-800 shadow-md p-6 flex items-center justify-between rounded-none transition-transform hover:-translate-y-1 cursor-pointer group">
          <div>
            <p className="text-xs font-bold text-sky-100 uppercase tracking-widest mb-1">
              Instructors
            </p>
            <h3 className="text-3xl font-black text-white">
              {loading ? "..." : instructor?.length || 0}
            </h3>
          </div>
          <div className="p-4 bg-sky-700 text-white shadow-inner rounded-none transition-colors group-hover:bg-sky-800">
            <GiTeacher size={24} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </div>
  );
}
