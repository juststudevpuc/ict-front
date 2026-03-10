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
  LogOut,
  GitGraph,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { GiTeacher } from "react-icons/gi";
import { useDispatch } from "react-redux";

// ✅ Added the missing Redux imports
import { setUser } from "@/store/userSlice";
import { setToken } from "@/store/tokenSlice";
import { request } from "@/utils/request/request";

const Sidebar = ({ isOpen, setIsOpen, setIsOpenDesktop, isOpenDesktop }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      to: "/admin/dashboard",
      label: "Dashboard",
      icon: <GitGraph size={20} />,
    },
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
      to: "/admin/schedulePage",
      label: "Schedule",
      icon: <GiTeacher size={20} />,
    },
    {
      to: "/admin/EmployeePage",
      label: "Employee",
      icon: <PersonStanding size={20} />,
    },
    {
      to: "/admin/instructorPage",
      label: "Instructor",
      icon: <GiTeacher size={20} />,
    },

    // { to: "/admin/borrowing", label: "Borrowing", icon: <Bookmark size={20} /> },
    // { to: "/admin/categories", label: "Categories", icon: <Tags size={20} /> },
    {
      label: "Logout",
      icon: <LogOut size={20} />,
      isLogout: true, // Tag it so we can handle the click logic later
      danger: true, // Optional: for red styling
    },
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

  const handleLogout = async () => {
    try {
      await request("logout", "post");
    } catch (error) {
      console.error("Server logout error:", error);
    } finally {
      // ✅ Now these functions exist and will safely clear your state
      dispatch(setUser(null));
      dispatch(setToken(null));
      navigate("/admin/login", { replace: true });
    }
  };

  // Helper function to render the navigation items
  const renderNavigation = (isMobile = false) => {
    return nav_item.map((item) => {
      // 1. Handle Logout Button
      if (item.isLogout) {
        return (
          <button
            key="logout-btn"
            onClick={handleLogout}
            className="relative px-4 py-3 mx-2 mt-auto mb-4 flex items-center gap-3 text-sm font-bold uppercase tracking-widest transition-colors border border-transparent hover:border-red-500/50 text-red-500 hover:bg-red-500/10 rounded-none"
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        );
      }

      // 2. Handle Dropdown Menus (subItems)
      if (item.subItems) {
        const isOpen = openMenus[item.label];

        return (
          <div key={item.label} className="flex flex-col mb-1">
            <button
              onClick={() => toggleMenu(item.label)}
              className={`relative px-4 py-3 mx-2 my-0.5 flex items-center justify-between text-sm font-bold uppercase tracking-widest transition-colors rounded-none border-l-4 ${
                isOpen
                  ? "bg-[#002b50] text-white border-slate-400"
                  : "text-slate-300 hover:bg-[#002b50] hover:text-white border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isOpen ? "text-white" : "text-slate-400"}>
                  {item.icon}
                </span>
                {item.label}
              </div>
              {isOpen ? (
                <ChevronDown size={16} className="text-white" />
              ) : (
                <ChevronRight size={16} className="text-slate-400" />
              )}
            </button>

            {/* Classic Dropdown Content */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden flex flex-col ml-8 pl-2 border-l border-[#002b50] mt-1"
                >
                  {item.subItems.map((sub) => (
                    <NavLink
                      key={sub.to}
                      to={sub.to}
                      onClick={() => isMobile && setIsOpen(false)}
                      className={({ isActive }) =>
                        `px-4 py-2 my-0.5 flex items-center text-xs font-bold uppercase tracking-widest transition-colors rounded-none ${
                          isActive
                            ? "text-emerald-400 bg-[#002b50]/50"
                            : "text-slate-400 hover:text-white hover:bg-[#002b50]/30"
                        }`
                      }
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

      // 3. Handle Normal Links
      return (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={() => isMobile && setIsOpen(false)}
          className={({ isActive }) =>
            `relative px-4 py-3 mx-2 my-0.5 flex items-center gap-3 text-sm font-bold uppercase tracking-widest transition-colors rounded-none border-l-4 ${
              isActive
                ? "bg-[#002b50] text-white border-emerald-500 shadow-sm"
                : "text-slate-300 hover:bg-[#002b50] hover:text-white border-transparent"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={isActive ? "text-emerald-500" : "text-slate-400"}
              >
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
      {/* --- DESKTOP SIDEBAR --- */}
      <AnimatePresence>
        {isOpenDesktop && (
          <motion.div
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            /* 1. Changed to a smooth, classic slide instead of a bouncy spring */
            transition={{ type: "tween", duration: 0.3 }}
            /* 2. Switched to a dark Navy theme with sharp borders */
            className="hidden md:flex flex-col fixed left-0 h-full w-64 bg-[#003868] border-r-4 border-slate-900/20 shadow-2xl z-40 select-none"
          >
            {/* Classic Branding Section */}
            <div className="p-6 border-b border-[#002b50] bg-[#002b50]/50">
              <div
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => navigate("/admin/courseAdmin")}
              >
                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-4xl p-1 shadow-sm">
                  <img
                    alt="ICT Center Logo"
                    src="/ict_logo2.png"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-lg font-black tracking-wide text-white uppercase">
                    ICT Center
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300 mt-1">
                    System Admin
                  </span>
                </div>
              </div>
            </div>

            <nav className="flex flex-col mt-6 flex-1 overflow-y-auto px-4 gap-1">
              {renderNavigation()}
            </nav>

            {/* Classic Bottom Status Indicator */}
            <div className="mt-auto border-t border-[#002b50] bg-[#002140]">
              <div className="p-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  System Status
                </p>
                <div className="flex items-center gap-3">
                  {/* 3. Replaced the pinging circle with a sharp, static status square */}
                  <span className="h-3 w-3 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Operational
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MOBILE SIDEBAR --- */}
      {/* --- MOBILE SIDEBAR --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay: Removed the modern 'backdrop-blur' for a classic, solid dimming effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/70 z-50 md:hidden"
            />

            {/* Sidebar: Switched to Navy Blue with strict transition */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 h-full w-72 bg-[#003868] z-[60] shadow-2xl md:hidden flex flex-col border-r-4 border-slate-900/30"
            >
              {/* Classic Branding & Close Button */}
              <div className="flex justify-between items-center p-6 border-b border-[#002b50] bg-[#002b50]/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-white p-1 shadow-sm">
                    <img
                      alt="ICT Center Logo"
                      src="/ict_logo2.png"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-black tracking-wide text-white uppercase">
                      ICT Center
                    </span>
                  </div>
                </div>

                {/* Classic Sharp Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-300 border border-transparent hover:text-white hover:border-slate-400 rounded-none transition-colors"
                  title="Close Menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col mt-6 overflow-y-auto h-full px-4 gap-1">
                {renderNavigation(true)}
              </nav>

              {/* Classic Bottom Status Indicator (Mobile) */}
              <div className="mt-auto border-t border-[#002b50] bg-[#002140]">
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      System Online
                    </span>
                  </div>
                </div>
              </div>
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
    <div className="flex min-h-screen font-sans bg-slate-100">
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
        {/* --- CLASSIC SOLID HEADER --- */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-300 shadow-sm px-6 py-7 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Desktop Menu Toggle */}
            <button
              onClick={() => setIsOpenDesktop(!isOpenDesktop)}
              className="hidden md:flex p-2 rounded-none text-[#003868] border border-transparent hover:bg-slate-50 hover:border-slate-300 transition-colors"
              title="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-none text-[#003868] border border-transparent hover:bg-slate-50 hover:border-slate-300 transition-colors"
              title="Open Menu"
            >
              <Menu size={20} />
            </button>

            {/* Classic Breadcrumbs */}
            <div className="hidden sm:flex items-center text-xl font-bold uppercase tracking-widest ml-2">
              <span className="text-slate-400">Dashboard</span>
              <span className="mx-3 text-slate-300">/</span>
              {/* Note: You can make this dynamic later based on the React Router path! */}
              <span className="text-[#003868]">Overview</span>
            </div>
          </div>

          {/* Right Side Header Area */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8 relative group">
            {/* Placeholder for Search or Profile Actions */}
          </div>
        </header>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="p-6 md:p-8 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
