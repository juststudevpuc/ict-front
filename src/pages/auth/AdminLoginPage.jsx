import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { request } from "@/utils/request/request";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { setUser } from "@/store/userSlice";
import { setToken } from "@/store/tokenSlice";

export default function AdminLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [validate, setValidate] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setValidate({});

    try {
      // 1. Hit the Admin-only endpoint!
      const res = await request("admin/login", "post", form);

      if (res?.error) {
        if (res?.errors) setValidate(res?.errors);
        setIsLoading(false);
        return;
      }

      if (res) {
        dispatch(setUser(res?.user));
        dispatch(setToken(res?.token));

        // 2. Send them straight to the secure vault
        navigate("/admin", { replace: true });
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#00152e] relative overflow-hidden font-sans px-4">
      {/* Background Decor (Subtle Academic Watermark) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-900/20 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-600/10 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest group mb-6"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Return to Public Site
        </button>

        {/* The Secure Login Card */}
        <div className="bg-white p-10 shadow-2xl relative">
          {/* Classic Top Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500"></div>

          <div className="flex flex-col items-center mb-8 text-center space-y-3">
            <div className="w-16 h-16 bg-[#002147] flex items-center justify-center rounded-none shadow-md mb-2">
              <ShieldCheck size={32} className="text-amber-500" strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-black text-[#002147] uppercase tracking-widest">
              Admin Portal
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
              Authorized Personnel Only
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-black text-[10px] uppercase tracking-[0.15em]">
                  Administrator Email
                </Label>
                <div className="relative group">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#002147] transition-colors"
                    size={18}
                  />
                  <Input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="user@gmail.com"
                    className={`pl-10 h-12 rounded-none bg-slate-50 border-slate-300 focus:border-[#002147] focus:ring-1 focus:ring-[#002147] transition-all text-sm ${
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
                <Label className="text-slate-700 font-black text-[10px] uppercase tracking-[0.15em]">
                  Security Password
                </Label>
                <div className="relative group">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#002147] transition-colors"
                    size={18}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className={`pl-10 pr-12 h-12 rounded-none bg-slate-50 border-slate-300 focus:border-[#002147] focus:ring-1 focus:ring-[#002147] transition-all text-sm ${
                      validate?.password ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#002147] transition-colors"
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
              className="w-full h-14 bg-[#002147] hover:bg-[#00152e] text-white rounded-none transition-colors font-black text-xs uppercase tracking-[0.2em] disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  Verifying Identity...
                </div>
              ) : (
                "Grant Access"
              )}
            </Button>
          </form>
        </div>

        {/* Footer Text */}
        <div className="mt-8 text-center text-slate-500 text-[10px] uppercase tracking-widest font-bold">
          System Monitored by ICT Center IT Dept. <br />
          <span className="text-slate-600 font-normal">Unauthorized access is prohibited.</span>
        </div>
      </div>
    </div>
  );
}