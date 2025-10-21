import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SignupPayload, SignupResponse } from '../types';
import { removeDataFromLc, getDataFromLc, setDataIntoLc } from '../utils/helper';
import { loginApi, signupApi, updateUserProfile } from '../utils/api/user';
import { LoginResponse } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: SignupPayload | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  signup: (userData: Omit<SignupPayload, 'id' | 'createdAt'>) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<SignupResponse>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SignupPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  // Restore from sessionStorage on mount
  useEffect(() => {
    const storedUser = getDataFromLc<SignupPayload>("userId", true);
    const storedToken = getDataFromLc<string>("token");
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      setIsLoading(true);
      const res = await loginApi({ email, password });
      if (res.success) {
        setUser(res.user);
        setToken(res.token);
        setDataIntoLc("userId", res.user, true);
        setDataIntoLc("token", res.token);
        return res;
      }

      // Explicitly throw if API responded with success=false
      throw new Error(res.message || "Login failed");

    } catch (err: any) {
      console.error("Login failed", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };



  const signup = async (
    userData: Omit<SignupPayload, "id" | "createdAt">
  ): Promise<SignupResponse | null> => {
    try {
      setIsLoading(true);
      const res = await signupApi(userData);

      if (res.success) {
        return res;
      } else {
        throw new Error(res.message || "Signup failed");
      }

    } catch (err: any) {
      console.error("Signup failed", err);
      toast.error(err.response?.data?.message || "Signup failed");
      return null;
    } finally {
      setIsLoading(false);
    }
  };



  const logout = () => {
    setUser(null);
    removeDataFromLc("userId");
    removeDataFromLc("token");
  };

  const updateUser = async (userData: any) => {
    const res = await updateUserProfile(userData);
    
    if (!res.success) {
      toast.error(res.message || "Failed to update profile");
      if (user) {
        setUser({ ...user, ...userData });
      }
      return;
    }

    if (res.success) {
      toast.success(res.message);
      if (user) {
        setUser({ ...user, ...userData });
      }
      return;
    }

  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateUser,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};