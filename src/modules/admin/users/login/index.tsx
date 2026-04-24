import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import notify from "devextreme/ui/notify";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { User, Lock, EyeOff, Eye } from "lucide-react";

import { GetLogin } from "@/api/admin/users/users-api.js";
import useCompanyStore from "@/store/useCompanyStore";
import useUserStore from "@/store/userStore";
import { CONTACTS } from "../data.js";
import { toast } from "sonner";
import { storageService } from "@/common/utility/storageService";

// Types
interface LoginFormData {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  data?: {
    user: {
      token: string;
      userid: string;
      username: string;
      usercode: string;
      salesmanid: string;
      compid: string;
      name: string;
      stateid: string;
      branchid: string;
      branch: string;
      finid: string;
      usertype: string;
      usersegment: string;
      dbdwaiveondiscprice: string;
      pfwaiveondiscprice: string;
    };
  };
  errorMessage?: string;
}

// Validation schema
const loginSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  // Login 
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response: LoginResponse = await GetLogin(data.username, data.password);

      if (response.errorMessage) {
        throw new Error(response.errorMessage);
      }

      if (!response.success) {
        throw new Error("Invalid credentials");
      }

      if (!response.data?.user) {
        throw new Error("Invalid response from server");
      }

      return response;
    },
    onSuccess: (response) => {
      const user = response.data!.user;

      // Save auth data to localStorage
      storageService.setItem("accessToken", user.token);
      storageService.setItem("userPriviledge", JSON.stringify(response.data));
      storageService.setItem("userId", user.userid);
      storageService.setItem("userName", user.username);
      storageService.setItem("userCode", user.usercode);
      storageService.setItem("companyId", user.compid);
      storageService.setItem("companyName", user.name);
      storageService.setItem("isLoggedIn", "true");


      // Update stores
      useCompanyStore.getState().setCompanyData({
        companyId: user.compid,
        branchId: user.branchid,
        financialYearId: user.finid,
      });

      useUserStore.getState().setUserData({
       // userId: user.userid,
        userName: user.username,
        userType: user.usertype,
        userSegment: user.usersegment,
      });


      toast.success('Login successful');
      notify("Login successful", "success", 1500);
      router.push("/dashboard");

    },
    onError: (error: Error) => {
      console.error("Login error:", error);
      notify(error.message || "Login failed", "error", 3000);
      toast.error(error.message || "Login failed");
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 p-2">
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white rounded-xl overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-2">
            {/* Left Section - Welcome & Illustration */}
            <div className="hidden md:flex flex-col items-center justify-start bg-color text-white p-2">
              <h2 className="text-2xl font-bold mb-1 mt-4">Welcome Back!</h2>
              <p className="text-sm font-medium opacity-90 mb-4 text-blue-100">
                Enter your credentials to access your dashboard
              </p>
              <img
                src="/images/login-illustration_1.png"
                alt="Login Illustration"
                className="w-full object-contain rounded-l-xl"
                onError={(e) => {
                  e.currentTarget.src = "/images/fallback-login.jpg";
                }}
              />
            </div>

            {/* Right Section - Login Form */}
            <div className="p-8 md:p-10">
              <div className="flex justify-center mb-6">
                <img
                  src="/images/new_balance_logo.png"
                  alt="Application Logo"
                  className="h-20 object-contain rounded-xl"
                  onError={(e) => {
                    e.currentTarget.src = "/images/fallback-logo.png";
                  }}
                />
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Sign in to your account
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <Controller
                      control={control}
                      name="username"
                      render={({ field }) => (
                        <input
                          {...field}
                          id="username"
                          type="text"
                          placeholder="Enter your username"
                          className={`w-full pl-10 pr-3 py-3 border rounded-lg text-sm ${errors.username
                            ? "border-red-500 focus:ring-red-400"
                            : "border-gray-300 focus:ring-blue-400"
                            } focus:outline-none focus:ring-2 focus:border-transparent transition`}
                          autoComplete="off"
                          autoCorrect="off"
                          spellCheck={false}
                          disabled={loginMutation.isPending}
                        />
                      )}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <Controller
                      control={control}
                      name="password"
                      render={({ field }) => (
                        <input
                          {...field}
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className={`w-full pl-10 pr-10 py-3 border rounded-lg text-sm ${errors.password
                            ? "border-red-500 focus:ring-red-400"
                            : "border-gray-300 focus:ring-blue-400"
                            } focus:outline-none focus:ring-2 focus:border-transparent transition`}
                          autoComplete="off"
                          autoCorrect="off"
                          spellCheck={false}
                          disabled={loginMutation.isPending}
                        />
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-blue-600 hover:text-blue-700 hover:underline transition font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full py-3 bg-color text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                >
                  {loginMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact & Support Section */}
          <div className="w-full py-2 px-4 border-t border-gray-200">
            <p className="text-lg font-semibold text-gray-800 text-center mb-1">
              Contact & Support
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {CONTACTS.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : "_self"}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`
                    flex items-center justify-center gap-2 px-4 py-2 rounded-lg border
                    border-blue-200 text-blue-700 text-sm font-medium
                    ${item.bg} ${item.hover} transition-all duration-200
                    hover:shadow-md
                  `}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="w-full text-center text-sm text-gray-500 py-4 border-t border-gray-200">
            &copy; {new Date().getFullYear()} Softtech. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}