import CourseCard from "@/components/Cards/CourseCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { request } from "@/utils/request/request";
import {
  CheckCircle,
  ArrowRight,
  BookOpen,
  Clock,
  Users,
  ChevronRight,
  ChevronLeft,
  Send,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const features = [
    {
      title: "Accredited Learning",
      description:
        "Earn recognized certificates and validate your skills with our university-grade curriculum.",
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "World-Class Faculty",
      description:
        "Learn directly from industry veterans and tenured professors dedicated to your success.",
      icon: <Users className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Flexible Access",
      description:
        "Access our digital campus 24/7. Study at your own pace with lifetime resource access.",
      icon: <Clock className="w-6 h-6 text-blue-600" />,
    },
  ];

  const [course, setCourse] = useState([]);

  const fetchingData = async () => {
    const res = await request("course", "get");
    if (res) {
      setCourse(res?.data);
      console.log("Course :", res);
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

  // 1. Array of images for the carousel
  const heroImages = [
    {
      src: "/image/ict03.jpg",
      alt: "ICT Center Campus Main Building",
    },
    {
      src: "/image/ict04.jpg", // Replace with your actual other images
      alt: "Students collaboration in library",
    },
    {
      src: "/image/ict05.jpg", // Replace with your actual other images
      alt: "Computer Lab Session",
    },
  ];

  // 2. State to track the current slide
  const [currentSlide, setCurrentSlide] = useState(0);

  // 3. Auto-advance the slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === heroImages.length - 1 ? 0 : prev + 1,
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  // Manual navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };

  return (
    <div className="flex flex-col w-full  bg-slate-50">
      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-120 flex items-center justify-center text-center overflow-hidden">
        {/* --- CAROUSEL BACKGROUND --- */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* --- PERMANENT OVERLAY (Darkens the image so text pops) --- */}
        <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply z-10" />

        {/* --- CONTENT (Sits on top of everything) --- */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 py-20 text-center">
          {/* 1. Pre-Title (The "Classic" Label) */}
          <p className="text-amber-500 font-bold uppercase tracking-[0.3em] text-xs mb-4">
            Est. 2024 • Excellence in Education
          </p>

          {/* 2. Main Title - Centered and Structured */}
          <h1 className="text-white text-4xl md:text-6xl font-black tracking-tight mb-6 leading-none uppercase">
            ICT Center <br />
            <span className="text-slate-300 font-serif italic normal-case text-2xl md:text-4xl block mt-4 font-light border-t border-b border-white/20 py-2 inline-block px-8">
              of Technology
            </span>
          </h1>

          {/* 3. Description - Balanced and Readable */}
          <p className="text-slate-200 text-base md:text-lg leading-relaxed mb-12 max-w-2xl mx-auto font-medium tracking-wide">
            Empowering the next generation of innovators. Join a community{" "}
            <br className="hidden md:block" />
            dedicated to shaping the future of digital excellence.
          </p>

          {/* 4. Action Buttons - Plaque Style */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link
              to="/courses"
              className="w-full sm:w-auto px-10 py-4 bg-white text-[#003868] text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all shadow-[6px_6px_0px_0px_rgba(217,119,6,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Explore Courses
            </Link>

            <Link
              to="/about"
              className="w-full sm:w-auto px-10 py-4 bg-transparent border-2 border-white text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
            >
              Visit Campus
            </Link>
          </div>
        </div>

        {/* --- SLIDER CONTROLS (Optional) --- */}
        {/* Left Arrow */}
        {/* <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
        >
          <ChevronLeft size={48} />
        </button> */}

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
        >
          <ChevronRight size={48} />
        </button>

        {/* Dots Indicator at bottom */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-blue-900 scale-125"
                  : "bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </section>

      {/* --- FEATURES STRIP --- */}
      {/* Moved up to overlap hero slightly for that "Modern University" feel */}
      <div className="relative z-20 max-w-7xl mx-auto ">
        <div className="bg-white shadow-xl grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-t-4 border-blue-800">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 group hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-slate-100 rounded-full group-hover:bg-amber-100 group-hover:text-blue-800 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed pl-16">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* --- ACADEMIC PROGRAMS (COURSES) --- */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-slate-200 pb-6">
            <div>
              <h2 className="text-4xl  font-bold text-slate-900 mb-2">
                Course Programs
              </h2>
              <p className="text-slate-500 text-lg">
                Explore your course you want learn.
              </p>
            </div>
            <Link
              to="/coursePagea"
              className="hidden md:flex items-center gap-2 text-blue-700 font-bold hover:text-blue-800 uppercase tracking-widest text-xs mt-4 md:mt-0"
            >
              View All Programs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {course
              ?.slice() // 1. Make a copy of the array so we don't accidentally mutate the original data
              .reverse() // 2. Flip the array upside down so the newest items are at the top
              .slice(0, 8) // 3. Cut the array to only keep the first 4 items
              .map((item) => (
                // 🛠️ Also added the bulletproof MongoDB _id check here for your key!
                <CourseCard key={item?._id || item?.id} data={item} />
              ))}
          </div>

          {/* Mobile Only Button */}
          <div className="mt-12 text-center md:hidden">
            <Link
              to="/coursePage"
              className="inline-flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-xs"
            >
              View All Programs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
