import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import { Eye, EyeOff, Mail, Lock, User, Phone, Wallet } from 'lucide-react';
// import { signup } from '../utils/api/user';
import toast from "react-hot-toast";


interface SignupForm {
  name: string;
  email: string;
  phone: string;
  // walletAddress: string;
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

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<SignupForm>({
    defaultValues: {
      referralCode: referralFromUrl, // pre-fill from URL if exists
    }
  });
  // if referralCode changes in URL, update form value
  useEffect(() => {
    if (referralFromUrl) {
      setValue("referralCode", referralFromUrl);
    }
  }, [referralFromUrl, setValue]);

  const password = watch('password');

  const onSubmit = async (data: SignupForm) => {
    try {
      // remove confirmPassword before sending to backend
      const { confirmPassword, referralCode: enteredRefCode, ...userData } = data;

      // build payload with referral code
      const payload: any = {
        ...userData,
        // referralCode: `${userData.name.toUpperCase().slice(0, 4)}${Math.random().toString(36).slice(2, 6)}`,
        referredBy: enteredRefCode || undefined,
      };

      const res: any = await signup(payload);
      toast.success(res.message || "Signup successful ");
      navigate("/login");
    } catch (err: any) {
      console.log(err)
      toast.error(err.response?.data?.message || "Signup failed ");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-gray-900 font-bold text-xl">CI</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Join the platform and start investing
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Please enter a valid email'
                    }
                  })}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="phone"
                  type="tel"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,   // 10 digits only
                      message: "Enter a valid 10-digit phone number"
                    }
                  })}
                  maxLength={10}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
              )}
            </div>

            {/* <div>
              <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-300 mb-1">
                BEP-20 USDT Wallet Address
              </label>
              <div className="relative">
                <Wallet className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="walletAddress"
                  type="text"
                  {...register('walletAddress', { 
                    required: 'Wallet address is required',
                    pattern: {
                      value: /^0x[a-fA-F0-9]{40}$/,
                      message: 'Please enter a valid BEP-20 wallet address'
                    }
                  })}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="0x..."
                />
              </div>
              {errors.walletAddress && (
                <p className="mt-1 text-sm text-red-400">{errors.walletAddress.message}</p>
              )}
            </div> */}

            <div>
              <label htmlFor="referralCode" className="block text-sm font-medium text-gray-300 mb-1">
                Referral Code (Optional)
              </label>
              <input
                id="referralCode"
                type="text"
                {...register('referralCode')}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter referral code if you have one"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            loading={isLoading}
            className="w-full"
          >
            Create Account
          </Button>

          <div className="text-center">
            <span className="text-gray-400">Already have an account? </span>
            <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-medium">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;