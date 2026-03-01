import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  Search,
  Bell,
  Library,
  BookOpen,
  Users,
  Bookmark,
  Tags,
  LayoutDashboard,
  CalendarDays,
  PersonStanding,
  UserPen,
  LucideUserPlus,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { GiTeacher } from "react-icons/gi";

const Sidebar = ({ isOpen, setIsOpen, setIsOpenDesktop, isOpenDesktop }) => {
  const navigate = useNavigate();
  // State to track which dropdown menus are open
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const nav_item = [
    // { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    {
      to: "/admin/enrollmentPage",
      label: "Enrollment",
      icon: <UserPen size={20} />,
    },
    {
      to: "/admin/studentPage",
      label: "Student",
      icon: <LucideUserPlus size={20} />,
    },

    {
      label: "Courses",
      icon: <BookOpen size={20} />,
      subItems: [
        { to: "/admin/courseAdmin", label: "All Courses" },
        { to: "/admin/courseDetail", label: "Course Details" },
      ],
    },
    {
      to: "/admin/SchedulePage",
      label: "Schedule",
      icon: <CalendarDays size={20} />,
    },
    {
      to: "/admin/instructorPage",
      label: "Instructor",
      icon: <GiTeacher size={20} />,
    },
    // { to: "/admin/borrowing", label: "Borrowing", icon: <Bookmark size={20} /> },
    // { to: "/admin/categories", label: "Categories", icon: <Tags size={20} /> },
  ];

  // Modern pill-shaped navigation items with strong Navy active states
  const NavItemStyle = ({ isActive }) =>
    `relative px-4 py-3 mx-4 my-1 flex items-center gap-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-[#003868] text-white shadow-md shadow-[#003868]/20"
        : "text-slate-500 hover:text-[#003868] hover:bg-slate-100"
    }`;

  // Styling specifically for sub-items in the dropdown
  const SubItemStyle = ({ isActive }) =>
    `relative px-4 py-2.5 mx-4 my-0.5 flex items-center gap-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-[#003868]/10 text-[#003868]"
        : "text-slate-500 hover:text-[#003868] hover:bg-slate-50"
    }`;

  // Helper function to render the navigation items so we don't duplicate code for Mobile and Desktop
  const renderNavigation = (isMobile = false) => {
    return nav_item.map((item) => {
      // IF ITEM HAS A DROPDOWN (subItems)
      if (item.subItems) {
        return (
          <div key={item.label} className="flex flex-col mb-1">
            <button
              onClick={() => toggleMenu(item.label)}
              className="relative px-4 py-3 mx-4 my-1 flex items-center justify-between text-sm font-semibold rounded-xl transition-all duration-200 text-slate-500 hover:text-[#003868] hover:bg-slate-100"
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-400">{item.icon}</span>
                {item.label}
              </div>
              {openMenus[item.label] ? (
                <ChevronDown size={16} className="text-slate-400" />
              ) : (
                <ChevronRight size={16} className="text-slate-400" />
              )}
            </button>

            {/* Dropdown Content */}
            <AnimatePresence>
              {openMenus[item.label] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden flex flex-col ml-6 pl-2 border-l-2 border-slate-100"
                >
                  {item.subItems.map((sub) => (
                    <NavLink
                      key={sub.to}
                      to={sub.to}
                      onClick={() => isMobile && setIsOpen(false)}
                      className={SubItemStyle}
                    >
                      {sub.label}
                    </NavLink>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      }

      // IF IT IS A NORMAL LINK
      return (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={() => isMobile && setIsOpen(false)}
          className={NavItemStyle}
        >
          {({ isActive }) => (
            <>
              <span className={`${isActive ? "text-white" : "text-slate-400"}`}>
                {item.icon}
              </span>
              {item.label}
            </>
          )}
        </NavLink>
      );
    });
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <AnimatePresence>
        {isOpenDesktop && (
          <motion.div
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="hidden md:flex flex-col fixed left-0 h-full w-64 bg-white border-r border-slate-200/60 z-40"
          >
            {/* Modern Branding */}
            <div className="p-8 flex items-center justify-between">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate("/admin/courseAdmin")}
              >
                {/* Logo Container - Simple and Transparent */}
                <div className="w-10 h-10 flex items-center justify-center">
                  <img
                    alt="ICT Center Logo"
                    src="/ict_logo2.png"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Text Content - Highly Legible */}
                <div className="flex flex-col">
                  <h2 className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                    ICT Center
                  </h2>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#003868] mt-1.5">
                    System Admin
                  </span>
                </div>
              </div>
            </div>

            <nav className="flex flex-col mt-4 flex-1 overflow-y-auto">
              {renderNavigation()}
            </nav>

            {/* Bottom Section */}
            <div className="mt-auto p-8">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-xs font-medium text-slate-500 mb-2">
                  System Status
                </p>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    All systems operational
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed left-0 top-0 h-full w-72 bg-white z-[60] shadow-2xl md:hidden py-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8 px-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#003868] flex items-center justify-center text-white">
                    <Library size={16} />
                  </div>
                  <span className="text-lg font-bold text-slate-900">
                    ICT Center
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 bg-slate-50 rounded-full hover:bg-slate-100 transition"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex flex-col overflow-y-auto">
                {renderNavigation(true)}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDesktop, setIsOpenDesktop] = useState(true);

  return (
    <div className="flex min-h-screen font-sans">
      <Sidebar
        isOpen={isOpen}
        isOpenDesktop={isOpenDesktop}
        setIsOpen={setIsOpen}
        setIsOpenDesktop={setIsOpenDesktop}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isOpenDesktop ? "md:ml-64" : "ml-0"
        }`}
      >
        {/* Modern Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpenDesktop(!isOpenDesktop)}
              className="hidden md:flex p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-[#003868] transition-colors"
            >
              <Menu size={20} />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Menu size={20} />
            </button>

            <div className="hidden sm:flex items-center text-sm font-medium">
              <span className="text-slate-400">Dashboard</span>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-[#003868]">Overview</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8 relative group"></div>
        </header>

        {/* Main Content Area */}
        <main className="p-6 md:p-8 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
