import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { request } from "@/utils/request/request";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const [validate, setValidate] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    password_confirmation: "",
  });

  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setValidate({});
    
    try {
      const res = await request("register", "post", {
        ...form,
        password_confirmation: form?.password, // Keeping your logic here!
      });

      if (res?.error) {
        if (res?.errors) setValidate(res?.errors);
        setIsLoading(false);
        return;
      }

      if (res) {
        navigate("/auth/login");
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
        <div className="relative z-10 p-12 flex flex-col justify-between w-full">
          <div className="flex items-center gap-2 text-white">
            <div className="w-13 h-13 flex items-center justify-center bg-white rounded-4xl p-1">
              <img
                alt="ICT Center Logo"
                src="/ict_logo2.png"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-xl tracking-tight">ICT CENTER</span>
          </div>

          <div className="space-y-6">
            <h2 className="text-5xl font-serif font-bold text-white leading-tight">
              Begin your <br />
              <span className="text-amber-400 font-sans font-light">Academic Journey.</span>
            </h2>
            <p className="text-slate-300 text-lg max-w-md font-light">
              Create your student account to access courses, schedules, and the largest tech community in Cambodia.
            </p>
          </div>

          <p className="text-slate-400 text-sm">© 2026 ICT Center of Technology. All rights reserved.</p>
        </div>
      </div>

      {/* --- RIGHT SIDE: REGISTRATION FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-slate-50 lg:bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-8 my-auto">
          
          {/* Back Button */}
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-400 hover:text-[#002147] transition-colors text-sm font-medium group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Website
          </button>

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-[#002147] tracking-tight">Student Registration</h1>
            <p className="text-slate-500">Enter your details to create your portal account.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              
              {/* Username Field */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold text-xs uppercase tracking-widest">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition-colors" size={18} />
                  <Input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className={`pl-10 h-12 rounded-none bg-slate-50 border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all ${
                      validate?.name ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {validate?.name && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 tracking-wider">{validate?.name[0]}</p>}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold text-xs uppercase tracking-widest">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition-colors" size={18} />
                  <Input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="student@example.com"
                    className={`pl-10 h-12 rounded-none bg-slate-50 border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all ${
                      validate?.email ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {validate?.email && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 tracking-wider">{validate?.email[0]}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold text-xs uppercase tracking-widest">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition-colors" size={18} />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className={`pl-10 pr-12 h-12 rounded-none bg-slate-50 border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all ${
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
                {validate?.password && <p className="text-red-500 text-[10px] font-bold uppercase mt-1 tracking-wider">{validate?.password[0]}</p>}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white rounded-none shadow-sm transition-all font-black text-xs uppercase tracking-widest disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : "REGISTER ACCOUNT"}
            </Button>
          </form>

          <p className="text-center text-slate-500 text-sm">
            Already have an account?{" "}
            <NavLink to="/auth/login" className="font-bold text-[#002147] hover:text-amber-600 hover:underline decoration-2 underline-offset-4 transition-colors">
              Sign in here
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}