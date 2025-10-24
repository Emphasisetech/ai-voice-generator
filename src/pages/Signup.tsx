import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import Button from "../components/UI/Button";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
} from "lucide-react";
import toast from "react-hot-toast";

interface SignupForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  referralCode?: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // extract referralCode from URL
  const queryParams = new URLSearchParams(location.search);
  const referralFromUrl = queryParams.get("referralCode") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SignupForm>({
    defaultValues: {
      referralCode: referralFromUrl,
    },
  });

  useEffect(() => {
    if (referralFromUrl) {
      setValue("referralCode", referralFromUrl);
    }
  }, [referralFromUrl, setValue]);

  const password = watch("password");

  const onSubmit = async (data: SignupForm) => {
    try {
      const { confirmPassword, referralCode: enteredRefCode, ...userData } = data;
      const payload: any = {
        ...userData,
        referredBy: enteredRefCode || undefined,
      };

      const res: any = await signup(payload);
      toast.success(res.message || "Signup successful");
      navigate("/login");
    } catch (err: any) {
      console.log(err);
      toast.error(err.response?.data?.message || "Signup failed");
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
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Join the platform and start your journey with AI Tools
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <div className="relative group">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              <input
                id="name"
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your full name"
              />
            </div>
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
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
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
              Phone Number
            </label>
            <div className="relative group">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              <input
                id="phone"
                type="tel"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit phone number",
                  },
                })}
                maxLength={10}
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your phone number"
              />
            </div>
            {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>}
          </div>

          {/* Referral */}
          {/* <div>
            <label htmlFor="referralCode" className="block text-sm font-medium text-gray-300 mb-1">
              Referral Code (Optional)
            </label>
            <input
              id="referralCode"
              type="text"
              {...register("referralCode")}
              className="w-full px-3 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter referral code if you have one"
            />
          </div> */}

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full pl-10 pr-10 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-blue-400 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
                className="w-full pl-10 pr-10 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-blue-400 transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            loading={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-400 hover:to-indigo-500 focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 rounded-lg"
          >
            Create Account
          </Button>

          {/* Footer */}
          <div className="text-center">
            <span className="text-gray-400">Already have an account? </span>
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
