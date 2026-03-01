import { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { request } from "@/utils/request/request";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { setUser } from "@/store/userSlice";
import { setToken } from "@/store/tokenSlice";

export default function LoginPage() {
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
      const res = await request("login", "post", form);
      if (res?.error) {
        if (res?.errors) setValidate(res?.errors);
        setIsLoading(false);
        return;
      }
      if (res) {
        dispatch(setUser(res?.user));
        dispatch(setToken(res?.token));
        if (res?.user?.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/user", { replace: true });
        }
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 font-serif">
      {/* Login Card */}
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-8 border border-gray-200"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-14 h-14 bg-[#006039] rounded-xl flex items-center justify-center shadow-md">
              <LogIn className="text-white" size={28} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
            Welcome Back
          </h1>
          <p className="text-gray-500">Sign in to your account</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="email"
                value={form?.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Enter your email"
                className={`pl-10 pr-4 py-5 rounded-lg border-gray-300 focus:border-[#006039] focus:ring-2 focus:ring-[#006039]/30 transition ${
                  validate?.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                }`}
              />
            </div>
            {validate?.email && <p className="text-red-500 text-sm mt-1">{validate?.email[0]}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type={showPassword ? "text" : "password"}
                value={form?.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
                className={`pl-10 pr-12 py-5 rounded-lg border-gray-300 focus:border-[#006039] focus:ring-2 focus:ring-[#006039]/30 transition ${
                  validate?.password ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {validate?.password && <p className="text-red-500 text-sm mt-1">{validate?.password[0]}</p>}
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#006039] hover:bg-[#004d2f] text-white py-5 rounded-lg shadow-md transition font-medium text-base disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full py-5 rounded-lg border-gray-300 hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-gray-600">
            Don’t have an account?{" "}
            <NavLink
              to="/auth/register"
              className="font-semibold text-[#006039] hover:text-[#004d2f] transition"
            >
              Create Account
            </NavLink>
          </p>
        </div>
      </form>
    </div>
  );
}
