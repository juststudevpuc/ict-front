import { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { request } from "@/utils/request/request";
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { setUser } from "@/store/userSlice";
import { setToken } from "@/store/tokenSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [validate, setValidate] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  // async function onSubmit(e) {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setValidate({});
  //   try {
  //     const res = await request("login", "post", form);
  //     if (res?.error) {
  //       if (res?.errors) setValidate(res?.errors);
  //       setIsLoading(false);
  //       return;
  //     }
  //     if (res) {
  //       dispatch(setUser(res?.user));
  //       dispatch(setToken(res?.token));
  //       // Simple role-based routing
  //       navigate(res?.user?.role === "admin" ? "/admin" : "/user", { replace: true });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setIsLoading(false);
  //   }
  // }
  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setValidate({});

    try {
      // 1. Hit the User-only endpoint
      const res = await request("login", "post", form);

      if (res?.error) {
        if (res?.errors) setValidate(res?.errors);
        setIsLoading(false);
        return;
      }

      if (res) {
        dispatch(setUser(res?.user));
        dispatch(setToken(res?.token));

        // 2. We removed the "admin" check!
        // Just send them straight to the courses or their profile.
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* --- LEFT SIDE: BRANDING & IMAGE --- */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#002147]">
        {/* <img 
          src="/ict_logo.png" // Use a high-quality campus/tech image
          alt="ICT Center" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        /> */}

        <div className="relative z-10 p-12 flex flex-col justify-between w-full">
          <div className="flex items-center gap-2 text-white">
            <div className="w-13 h-13 flex items-center justify-center bg-white rounded-4xl ">
              <img
                alt="ICT Center Logo"
                src="/ict_logo2.png"
                className="w-full h-full object-contain"
              />
            </div>
            <span className=" font-bold text-xl tracking-tight">
              ICT CENTER
            </span>
          </div>

          <div className="space-y-6">
            <h2 className="text-5xl font-serif font-bold text-white leading-tight">
              Empowering your <br />
              <span className="text-amber-400 font-sans font-light">
                Digital Future.
              </span>
            </h2>
            <p className="text-slate-300 text-lg max-w-md font-light">
              Join the largest tech community in Cambodia and master the skills
              of tomorrow.
            </p>
          </div>

          <p className="text-slate-400 text-sm">
            © 2026 ICT Center of Technology. All rights reserved.
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: LOGIN FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-slate-50 lg:bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Back Button for UX */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-400 hover:text-blue-700 transition-colors text-sm font-medium group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Website
          </button>

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-[#002147] tracking-tight">
              User Dashboard
            </h1>
            <p className="text-slate-500">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold text-xs uppercase tracking-widest">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-700 transition-colors"
                    size={18}
                  />
                  <Input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="name@example.com"
                    className={`pl-10 h-12 bg-white border-slate-200 focus:border-[#006039] focus:ring-4 focus:ring-[#006039]/5 transition-all ${
                      validate?.email ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {validate?.email && (
                  <p className="text-red-500 text-[10px] font-bold uppercase mt-1 tracking-wider">
                    {validate?.email[0]}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-slate-700 font-bold text-xs uppercase tracking-widest">
                    Password
                  </Label>
                  {/* <NavLink to="/auth/forgot" className="text-xs font-bold text-amber-600 hover:text-amber-700">Forgot?</NavLink> */}
                </div>
                <div className="relative group">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-700 transition-colors"
                    size={18}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="••••••••"
                    className={`pl-10 pr-12 h-12 bg-white border-slate-200 focus:border-[#006039] focus:ring-4 focus:ring-[#006039]/5 transition-all ${
                      validate?.password ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {validate?.password && (
                  <p className="text-red-500 text-[10px] font-bold uppercase mt-1 tracking-wider">
                    {validate?.password[0]}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-lg shadow-[#006039]/20 transition-all font-bold text-sm tracking-wide disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                "SIGN IN TO DASHBOARD"
              )}
            </Button>
          </form>

          <p className="text-center text-slate-500 text-sm">
            New student?{" "}
            <NavLink
              to="/auth/register"
              className="font-bold color- hover:underline decoration-2 underline-offset-4"
            >
              Create an account
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}
