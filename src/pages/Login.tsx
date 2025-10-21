import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
// import { login } from '../utils/api/user';
import toast from "react-hot-toast";
import { setDataIntoLc } from '../utils/helper';


interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
  setError('');
  try {
    const res = await login(data.email,data.password);
     toast.success(res?.message || "Sigin successful ");
    navigate('/dashboard');
  } catch (err:any) {
    console.log(err)
    toast.error(err.response?.data?.message || "Signup failed ");
    // setError('Invalid email or password. Try admin@platform.com / password');
  }
};


  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-gray-900 font-bold text-xl">AT</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
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
          </div>

          {/* <div className="flex items-center justify-between">
            <Link to="/forgot-password" className="text-sm text-yellow-400 hover:text-yellow-300">
              Forgot your password?
            </Link>
          </div> */}

          <Button
            type="submit"
            size="lg"
            loading={isLoading}
            className="w-full"
          >
            Sign in
          </Button>

          {/* <div className="text-center">
            <span className="text-gray-400">Don't have an account? </span>
            <Link to="/signup" className="text-yellow-400 hover:text-yellow-300 font-medium">
              Sign up
            </Link>
          </div> */}

          {/* <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mt-6">
            <p className="text-sm text-gray-300 mb-2">Demo Credentials:</p>
            <p className="text-xs text-gray-400">Email: admin@platform.com</p>
            <p className="text-xs text-gray-400">Password: password</p>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default Login;