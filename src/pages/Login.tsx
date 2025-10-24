import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import Button from "../components/UI/Button";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setError("");
    try {
      const res = await login(data.email, data.password);
      toast.success(res?.message || "Sign-in successful");
      navigate("/dashboard");
    } catch (err: any) {
      console.log(err);
      toast.error(err.response?.data?.message || "Sign-in failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#1e293b]/70 backdrop-blur-xl border border-[#334155] rounded-2xl p-8 shadow-2xl hover:border-blue-500/40 transition-all duration-300">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/40">
              <span className="text-white font-extrabold text-2xl">AT</span>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-wide">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in and start your journey with AI Tools
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-900/60 border border-red-700 text-red-200 px-4 py-2 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Please enter a valid email",
                  },
                })}
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                className="w-full pl-10 pr-10 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-blue-400 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
          <Button
            type="submit"
            size="lg"
            loading={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-400 hover:to-indigo-500 focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 rounded-lg"
          >
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Don’t have an account?{" "}
            {/* <Link
              to="/signup"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign Up
            </Link> */}
          </p>
          <p className="text-gray-400 text-sm">
            Drop an email at{" "}
            <a
              href="mailto:emphasisetech@gmail.com"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >emphasisetech@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
