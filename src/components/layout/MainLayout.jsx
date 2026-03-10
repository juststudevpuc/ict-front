import { Button, Dialog, DialogPanel, PopoverGroup } from "@headlessui/react";
import { Menu, X, Search, Globe, ChevronDown, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
// ✅ Added Redux imports for Logout functionality
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
import { setToken } from "@/store/tokenSlice";
// for check 
import { NavDropdown } from "./NavDropdown";

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useDispatch(); // ✅ Initialize dispatch

  // ✅ Secure Logout Function
  const handleLogout = () => {
    dispatch(setUser(null));
    dispatch(setToken(null));
    localStorage.clear();
    setMobileMenuOpen(false); // Close mobile menau if open
    navigate("/auth/login");
  };

  const nav_item = [
    { to: "/coursePage", label: "Courses" },
    { to: "/aboutict", label: "About the Center" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
      {/* --- UTILITY BAR --- */}
      <div className="bg-[#00152e] text-white text-[10px] uppercase tracking-widest font-bold py-2 px-6 hidden lg:flex justify-end gap-6 items-center">
        {/* <span className="hover:text-amber-500 cursor-pointer transition-colors">
          Dashboard 
        </span> */}
        {user?.role === "admin" && (
          <span
            onClick={() => navigate("/admin")}
            className="hover:text-amber-500 cursor-pointer transition-colors font-bold tracking-widest uppercase"
          >
            Dashboard
          </span>
        )}
        <span className="hover:text-amber-500 cursor-pointer transition-colors">
          Faculty & Staff
        </span>
        <span className="hover:text-amber-500 cursor-pointer transition-colors">
          Student Portal
        </span>
        <div className="h-3 w-px bg-slate-600 mx-2"></div>
        <div className="flex items-center gap-1 cursor-pointer hover:text-amber-500">
          <Globe className="w-3 h-3" /> <span>Global</span>
        </div>
      </div>

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 w-full bg-[#002147] shadow-md border-b border-[#00152e]">
        <nav
          aria-label="Global"
          className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
        >
          {/* LOGO SECTION */}
          <div className="flex lg:flex-1">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-white p-1 rounded-4xl">
                <img alt="crest" src="/ict_logo2.png" className="h-10 w-auto" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold tracking-tight text-white leading-none">
                  ICT Center
                </h2>
              </div>
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <div className="flex lg:hidden gap-4">
            <button className="text-white hover:text-amber-400 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex lg:gap-x-8 items-center">
            <PopoverGroup className="flex gap-8">
              {nav_item.map((item) =>
                item.children ? (
                  <NavDropdown key={item.label} item={item} />
                ) : (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="relative text-xs font-bold uppercase tracking-[0.15em] text-white hover:text-amber-400 transition-colors py-2 group"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ),
              )}
            </PopoverGroup>

            <div className="pl-6 border-l border-slate-600 flex items-center gap-6">
              <button className="text-white hover:text-amber-400 transition-colors">
                <Search className="w-5 h-5" />
              </button>

              {/* ✅ SMART LOGIN / LOGOUT DESKTOP BUTTON */}
              {!user?.email ? (
                <Button
                  onClick={() => navigate("/auth/login")}
                  className="group flex items-center justify-center gap-3 bg-amber-600 hover:bg-amber-700 text-white rounded-none px-5 py-3 border-none shadow-sm transition-all"
                >
                  <span className="text-xs font-black uppercase tracking-[0.15em] pt-0.5">
                    Login
                  </span>
                  <LogIn
                    size={18}
                    strokeWidth={2.5}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              ) : (
                <Button
                  onClick={handleLogout}
                  className="group flex items-center justify-center gap-3 bg-slate-800 hover:bg-red-700 text-white rounded-none px-5 py-3 border-none shadow-sm transition-all"
                >
                  <span className="text-xs font-black uppercase tracking-[0.15em] pt-0.5">
                    Logout
                  </span>
                  <LogIn
                    size={18}
                    strokeWidth={2.5}
                    className="group-hover:translate-x-1 transition-transform rotate-180"
                  />
                </Button>
              )}
            </div>
          </div>
        </nav>

        {/* --- MOBILE MENU DIALOG --- */}
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full flex flex-col overflow-y-auto bg-white sm:max-w-sm shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex flex-col">
                <span className="text-[#002147] font-serif font-bold text-lg">
                  ICT Center
                </span>
                <span className="text-[10px] uppercase text-slate-500 tracking-widest">
                  Navigation
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-slate-700 hover:bg-slate-100 hover:text-[#002147] transition-colors"
              >
                <X aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6 flow-root px-6 flex-1">
              <div className="-my-6 divide-y divide-slate-100">
                <div className="space-y-2 py-6">
                  {nav_item.map((nav) =>
                    nav.children ? (
                      <div key={nav.label} className="space-y-2">
                        <div className="block px-3 py-2 text-sm font-serif font-bold text-[#002147] border-l-2 border-[#002147] bg-slate-50">
                          {nav.label}
                        </div>
                        {nav.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.to}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-between rounded-lg py-3 pl-6 pr-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#002147] transition-colors"
                          >
                            {child.label}
                            <ChevronDown className="w-3 h-3 -rotate-90 text-slate-300" />
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link
                        key={nav.label}
                        to={nav.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className="-mx-3 block rounded-lg px-3 py-3 text-sm font-bold uppercase tracking-widest text-slate-900 hover:bg-slate-50 hover:text-[#002147]"
                      >
                        {nav.label}
                      </Link>
                    ),
                  )}
                </div>
                <div className="py-6 space-y-3">
                  <Link
                    to="#"
                    className="block text-xs font-semibold text-slate-500 hover:text-[#002147] uppercase tracking-wider"
                  >
                    Student Portal
                  </Link>
                  <Link
                    to="#"
                    className="block text-xs font-semibold text-slate-500 hover:text-[#002147] uppercase tracking-wider"
                  >
                    Faculty Access
                  </Link>
                </div>
              </div>
            </div>

            {/* ✅ SMART LOGIN / LOGOUT MOBILE BUTTON */}
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              {!user?.email ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/auth/login");
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-amber-600 text-white p-4 font-black uppercase tracking-[0.15em] text-xs rounded-none shadow-sm hover:bg-amber-700 transition-colors"
                >
                  System Login <LogIn size={16} />
                </button>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="text-center text-xs font-bold text-slate-500">
                    Logged in as{" "}
                    <span className="text-[#002147]">{user?.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white p-4 font-black uppercase tracking-[0.15em] text-xs rounded-none shadow-sm hover:bg-red-700 transition-colors"
                  >
                    Secure Logout <LogIn size={16} className="rotate-180" />
                  </button>
                </div>
              )}
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 w-full bg-slate-50">
        <Outlet />
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#00152e] text-slate-300 py-16 border-t-4 border-amber-500">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-serif text-2xl font-bold mb-4">
              ICT Center of Technology
            </h3>
            <p className="text-sm leading-relaxed max-w-md text-slate-400">
              Dedicated to the advancement of knowledge and the education of
              students in science, technology, and other areas of scholarship
              that will best serve the nation and the world in the 21st century.
            </p>
            <div className="mt-6 flex gap-4">
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors cursor-pointer text-white font-serif">
                f
              </div>
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors cursor-pointer text-white font-serif">
                x
              </div>
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors cursor-pointer text-white font-serif">
                in
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="#" className="hover:text-amber-500 transition-colors">
                  Apply for Admission
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-500 transition-colors">
                  Campus Map
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-500 transition-colors">
                  Academic Calendar
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-amber-500 transition-colors">
                  Library
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>Kampuchea Krom Blvd</li>
              <li className="pt-2 text-amber-500 font-bold">+855 1234567</li>
              <li>info@ict-center.edu</li>
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 uppercase tracking-widest">
          <p>© 2026 ICT Center. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-white">
              Privacy
            </Link>
            <Link to="#" className="hover:text-white">
              Accessibility
            </Link>
            <Link to="#" className="hover:text-white">
              Emergency Info
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
