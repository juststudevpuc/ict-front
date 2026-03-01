import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setRefresh } from "@/store/refreshSlice";
import { request } from "@/utils/request/request";
import {
  ChevronLeftIcon,
  CheckIcon,
  ClockIcon,
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  VideoCameraIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { getImageUrl } from "@/utils/helper/helpers"; 

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const refresh = useSelector((state) => state.refresh.value);

  const fetchingData = async () => {
    setLoading(true);
    try {
      const res = await request(`course/${id}`, "get");
      if (res?.data && res.data.length > 0) {
        const mainData = res.data[0]; 
        setCourse(mainData.course);
        setCurriculum(mainData.curriculum);
        setSchedule(mainData.schedule);
      } else {
        setCourse(null);
      }
    } catch (error) {
      console.error("Error fetching course detail:", error);
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingData();
    if (refresh) {
      dispatch(setRefresh(false));
    }
  }, [id, refresh]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center text-sm font-bold tracking-widest uppercase text-slate-400">
      Loading details...
    </div>
  );
  
  if (!course) return (
    <div className="flex h-screen items-center justify-center text-sm font-bold tracking-widest uppercase text-red-500">
      Course not found
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 pb-20">
      
      {/* ⬛ DARK HERO SECTION (Like Udemy) */}
      <div className="bg-zinc-900 text-white pt-8 pb-12 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row relative">
          
          {/* Hero Content (Left Side) */}
          <div className="lg:w-2/3 lg:pr-12">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-xs font-bold text-violet-400 hover:text-violet-300 mb-6 transition"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Back to Courses
            </button>

            <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              {course?.title}
            </h1>
            
            <p className="text-lg text-zinc-300 mb-6">
              Master the fundamentals and advanced concepts of this course. Perfect for students looking to upgrade their skills at the ICT Center.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
              <span className="flex items-center gap-1 bg-zinc-800 px-3 py-1 rounded-full text-zinc-100 font-medium">
                <span className="text-yellow-400">★</span> Best Seller
              </span>
              <span className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                {course?.duration_hours} of content
              </span>
              <span className="flex items-center gap-1">
                <UserGroupIcon className="w-4 h-4" />
                Level: {course?.description || "Beginner"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ⬜ MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col-reverse lg:flex-row gap-12 relative">
          
          {/* Left Column: Details & Curriculum */}
          <div className="lg:w-2/3 pt-8 lg:pt-12 space-y-12">
            
            {/* "What you'll learn" Box */}
            {curriculum && curriculum.length > 0 && (
              <div className="border border-slate-300 p-6 lg:p-8 bg-slate-50">
                <h2 className="text-xl font-bold mb-6">What you'll learn</h2>
                {/* 2-Column Grid for Checkmarks */}
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {curriculum.map((topic, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckIcon className="w-5 h-5 text-slate-900 shrink-0 mt-0.5 font-bold" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Class Schedule Section */}
            {schedule && (
              <div>
                <h2 className="text-xl font-bold mb-4">Class Schedule</h2>
                <div className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-4 mb-4 gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <UserGroupIcon className="w-5 h-5 text-violet-600" />
                        {schedule.group_name}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Upcoming Cohort
                      </p>
                    </div>
                    <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-bold uppercase tracking-wider bg-violet-100 text-violet-700 rounded-full w-max">
                      {schedule.shift}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-slate-700">
                    <div className="space-y-3">
                      <p className="flex items-center gap-3">
                        <CalendarIcon className="w-5 h-5 text-slate-400" />
                        <span className="font-medium">{schedule.days_of_week}</span>
                      </p>
                      <p className="flex items-center gap-3">
                        <ClockIcon className="w-5 h-5 text-slate-400" />
                        <span>{schedule.start_time} - {schedule.end_time}</span>
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p className="flex items-center gap-3">
                        <MapPinIcon className="w-5 h-5 text-slate-400" />
                        <span>Room: <span className="font-medium">{schedule.room}</span></span>
                      </p>
                      <p className="flex items-center gap-3">
                        <CalendarIcon className="w-5 h-5 text-slate-400" />
                        <span>Starts: <span className="font-medium text-slate-900">{schedule.start_date}</span></span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
          </div>

          {/* Right Column: FLOATING PRICING CARD (Udemy Style) */}
          <div className="lg:w-1/3">
            <div className="bg-white border border-slate-200 shadow-xl rounded-none lg:rounded-lg overflow-hidden lg:-mt-56 lg:sticky lg:top-8 z-10 w-full">
              
              {/* Course Image */}
              <div className="relative h-48 sm:h-64 lg:h-52 w-full bg-slate-100">
                <img
                  className="w-full h-full object-cover"
                  src={course?.image ? getImageUrl(course.image) : "/placeholder-course.jpg"}
                  alt={course?.title}
                  onError={(e) => { e.target.src = "/placeholder-course.jpg"; }}
                />
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition duration-300">
                   {/* Play button overlay effect */}
                   <div className="bg-white/90 rounded-full p-4 shadow-lg cursor-pointer transform scale-90 hover:scale-100 transition">
                      <span className="text-slate-900 font-bold text-sm uppercase tracking-wider">Preview</span>
                   </div>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="p-6">
                <div className="text-3xl font-bold text-slate-900 mb-6">
                  ${course?.price}
                </div>

                <Button
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-6 text-base rounded-none transition-colors mb-4"
                  onClick={() => navigate("/admin/enrollmentPage")}
                  disabled={!course?.status}
                >
                  {course?.status ? "Enroll Now" : "Currently Closed"}
                </Button>

                <p className="text-xs text-center text-slate-500 mb-6">
                  30-Day Money-Back Guarantee
                </p>

                {/* "This course includes" section */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-900 mb-2">This course includes:</h4>
                  <p className="flex items-center gap-3 text-sm text-slate-600">
                    <VideoCameraIcon className="w-4 h-4 shrink-0" />
                    {course?.duration_hours} on-demand video & labs
                  </p>
                  <p className="flex items-center gap-3 text-sm text-slate-600">
                    <MapPinIcon className="w-4 h-4 shrink-0" />
                    In-person practical training
                  </p>
                  <p className="flex items-center gap-3 text-sm text-slate-600">
                    <TrophyIcon className="w-4 h-4 shrink-0" />
                    Certificate of completion
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                  <span className="text-xs font-bold text-slate-900 tracking-widest uppercase">
                    ICT Center Official Course
                  </span>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;