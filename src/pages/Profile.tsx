import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import { User, Mail, Phone } from "lucide-react";
import { getuserDetails } from "../utils/api/user";
import { ProfileForm } from "../types";


const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getuserDetails();
      } catch (err: any) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const onSubmit = (data: ProfileForm) => {
    updateUser(data);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1f] via-[#111827] to-[#0f172a] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="text-gray-400 mt-1">
              Manage your personal information and account details
            </p>
          </div>

          <div className="mt-4 sm:mt-0">
            <Button
              variant="secondary"
              onClick={() => setIsEditing(!isEditing)}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 font-semibold 
                         px-5 py-2.5 rounded-lg shadow hover:shadow-lg hover:from-yellow-500 hover:to-yellow-700 
                         transition-all duration-200"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel */}
          <Card
            className="p-6 text-center bg-[#0f172a]/60 border border-gray-700/50 
                       backdrop-blur-md rounded-2xl hover:border-yellow-400/40 transition-all duration-300"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-3xl font-bold text-gray-900">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-2 right-2 w-4 h-4 rounded-full bg-green-500 border-2 border-[#0f172a]"></div>
              </div>
              <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
              <p className="text-gray-400 break-all text-sm">{user?.email}</p>
            </div>

            <div className="mt-8 border-t border-gray-700 pt-4 text-left space-y-2">
              <p className="text-gray-400 text-sm">
                Keep your details updated to get the best experience across our AI tools.
              </p>
            </div>
          </Card>

          {/* Right Panel */}
          <Card
            className="lg:col-span-2 bg-[#111827]/70 border border-gray-700/50 rounded-2xl backdrop-blur-md p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              Profile Information
            </h3>

            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      {...register("name", { required: "Name is required" })}
                      className="w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-800/60 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.name.message}
                    </p>
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
                      {...register("phone", { required: "Phone is required" })}
                      className="w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-800/60 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <Button type="submit">Save Changes</Button>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-800/40 border border-gray-700 rounded-lg">
                  <User className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-400">Full Name</p>
                    <p className="text-white">{user?.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-800/40 border border-gray-700 rounded-lg">
                  <Mail className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-400">Email Address</p>
                    <p className="text-white">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-800/40 border border-gray-700 rounded-lg">
                  <Phone className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-400">Phone Number</p>
                    <p className="text-white">{user?.phone}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
