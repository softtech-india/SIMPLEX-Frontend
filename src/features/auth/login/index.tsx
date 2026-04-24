"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Lock, EyeOff, Eye } from "lucide-react";
import { toast } from "sonner";
import { login } from "../services/auth.service";
import useCompanyStore from "@/store/useCompanyStore";
import useUserStore from "@/store/userStore";
import { CONTACTS } from "../data";
import { storageService } from "@/common/utility/storageService";

// =======================
// ZOD VALIDATION
// =======================
const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().trim().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// =======================
// TYPES
// =======================
interface LoginResponseSuccess {
  success: true;
  message: string;
  data: {
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
    };
  };
}

interface LoginResponseError {
  success: false;
  message: string;
  data?: undefined;
}

type LoginResponse = LoginResponseSuccess | LoginResponseError;

// =======================
// COMPONENT
// =======================
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  // =======================
  // LOGIN MUTATION
  // =======================
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response: LoginResponse = await login(
        data.username,
        data.password
      );

      if (!response.success) {
        throw new Error(response.message || "Login failed");
      }

      if (!response.data?.user) {
        throw new Error("Invalid server response");
      }

      return response;
    },

    onSuccess: (response) => {
      const user = response.data.user;
      // Save to storage
      storageService.setItem("accessToken", user.token);
      storageService.setItem("userPriviledge", JSON.stringify(response.data));
      storageService.setItem("userId", user.userid);
      storageService.setItem("userName", user.username);
      storageService.setItem("userCode", user.usercode);
      storageService.setItem("companyId", user.compid);
      storageService.setItem("companyName", user.name);
      storageService.setItem("isLoggedIn", "true");

      // Update stores branchid
      useCompanyStore.getState().setCompanyData({
        companyId: user.compid,
        branchId: user.branchid,
       // financialYearId: user.finid,
      });


      useUserStore.getState().setUserData({
        userId: user.userid,
        companyId: user.compid,
        branchId: user.branchid,
        finid: user.finid,
        userName: user.username,
        userType: user.usertype || "",
        userSegment: user.usersegment || "",
      });

      toast.success('Login successful');
      router.push("/dashboard");
    },

    onError: (error: any) => {
      const message =
        error?.message || "Something went wrong. Please try again.";

      if (message.toLowerCase().includes("invalid")) {
        setError("password", {
          type: "manual",
          message: "Invalid username or password",
        });
      }

      toast.error(message);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  // =======================
  // UI
  // =======================
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 p-2">
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white rounded-xl overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-2">

            {/* LEFT */}
            <div className="hidden md:flex flex-col items-center bg-color text-white p-2">
              <h2 className="text-2xl font-bold mt-4">Welcome Back!</h2>
              <p className="text-sm opacity-90 mb-4 text-blue-100">
                Enter your credentials to access your dashboard
              </p>
              <img
                src="/images/login-illustration_1.png"
                alt="Login"
                className="w-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/images/fallback-login.jpg";
                }}
              />
            </div>

            {/* RIGHT */}
            <div className="p-8 md:p-10">
              <div className="flex justify-center mb-6">
                <img
                  src="/images/new_balance_logo.png"
                  alt="Logo"
                  className="h-20"
                  onError={(e) => {
                    e.currentTarget.src = "/images/fallback-logo.png";
                  }}
                />
              </div>

              <h3 className="text-2xl font-semibold text-center mb-6">
                Sign in to your account
              </h3>


              {/* {loginMutation.isError && (
                <p className="text-sm text-red-500 text-center mb-3">
                  {(loginMutation.error as Error)?.message}
                </p>
              )} */}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* USERNAME */}
                <div>
                  <label className="text-sm">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Controller
                      control={control}
                      name="username"
                      render={({ field }) => (
                        <input
                          {...field}
                          className={`w-full pl-10 py-3 border rounded-lg ${errors.username
                            ? "border-red-500"
                            : "border-gray-300"
                            }`}
                          disabled={loginMutation.isPending}
                        />
                      )}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-xs text-red-500">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="text-sm">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Controller
                      control={control}
                      name="password"
                      render={({ field }) => (
                        <input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          className={`w-full pl-10 pr-10 py-3 border rounded-lg ${errors.password
                            ? "border-red-500"
                            : "border-gray-300"
                            }`}
                          disabled={loginMutation.isPending}
                        />
                      )}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-3"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="text-xs text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex justify-between text-sm">
                  <label>
                    <input type="checkbox" /> Remember me
                  </label>

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-blue-600"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full py-3 bg-color text-white rounded-lg"
                >
                  {loginMutation.isPending ? "Signing in..." : "Login"}
                </button>
              </form>
            </div>
          </div>

          {/* CONTACT */}
          <div className="w-full py-2 px-4 border-t border-gray-200">
            <p className="text-lg font-semibold text-gray-800 text-center mb-1">
              Contact & Support
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {CONTACTS.map((item) => {
                const Icon = item.icon;
                return (
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
                    <Icon className="inline w-5 h-5" /> {item.name}
                  </a>
                );
              })}
            </div>
          </div>


          <div className="w-full text-center text-sm text-gray-500 py-4 border-t border-gray-200">
            &copy; {new Date().getFullYear()} Softtech. All rights reserved.
          </div>

        </div>
      </div>
    </div>
  );
}