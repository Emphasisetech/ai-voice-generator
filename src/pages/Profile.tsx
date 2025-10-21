import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { User, Mail, Phone, Wallet, Copy, Check } from 'lucide-react';
import { getuserDetails } from '../utils/api/user';

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  walletAddress: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false); 

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      walletAddress: user?.walletAddress || '',
    }
  });


  useEffect(() => {

    const fetchData = async () => {
      try {
        const data = await getuserDetails();
        
      } catch (err: any) {
       console.log(err);
      } 
    };
    fetchData();
    return () => {
    };
  }, []);



  const onSubmit = (data: ProfileForm) => {
    updateUser(data);
    setIsEditing(false);
  };


  const copyReferralCode = () => {
    if (user?.referCode) {
      navigator.clipboard.writeText(`https://crypto-invest-beta.vercel.app/signup?referralCode=${user?.referCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-3xl font-bold text-gray-900">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
             
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">{user?.name}</h2>
            <p className="text-gray-400 mb-4 break-all text-sm px-4">
              {user?.email}
            </p>

            {/* <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-300 mb-2">Referral Code</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-yellow-400 font-mono text-lg truncate max-w-[80%] block" >
                  {`crypto-invest-beta.vercel.app/signup?referralCode=${user?.referCode}`}
                </span>
                <button
                  onClick={copyReferralCode}
                  className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div> */}

            {/* <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Investment</span>
                <span className="text-white">$ {user?.investment || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total ROI</span>
                <span className="text-green-400">$ {user?.totalROI || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Team Earnings</span>
                <span className="text-blue-400">$ {user?.teamEarnings || 0}</span>
              </div>
            </div> */}
          </Card>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Profile Information</h3>
                <Button
                  variant="secondary"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        className="w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        {...register('phone', { required: 'Phone is required' })}
                        className="w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      BEP-20 USDT Wallet Address
                    </label>
                    <div className="relative">
                      <Wallet className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        {...register('walletAddress', { required: 'Wallet address is required' })}
                        className="w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    {errors.walletAddress && (
                      <p className="mt-1 text-sm text-red-400">{errors.walletAddress.message}</p>
                    )}
                  </div> */}

                  <div className="flex space-x-4">
                    <Button type="submit">Save Changes</Button>
                    <Button variant="secondary" type="button" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Full Name</p>
                      <p className="text-white">{user?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Email Address</p>
                      <p className="text-white">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Phone Number</p>
                      <p className="text-white">{user?.phone}</p>
                    </div>
                  </div>

                  {/* <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                    <Wallet className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Wallet Address</p>
                      <p className="text-white text-sm font-mono break-all">{user?.walletAddress}</p>
                    </div>
                  </div> */}
                </div>
              )}
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;