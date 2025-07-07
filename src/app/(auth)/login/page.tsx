"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left side - Image and branding */}
      <div className="hidden lg:flex lg:w-1/2 justify-center items-center">
        <Image
          src="/assets/auth/login.png"
          width={600}
          height={600}
          alt="Login Image"
        />
        {/* Logo overlay */}
        {/* <div className="absolute top-6 left-6 z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
              <div className="w-4 h-4 bg-white transform rotate-45"></div>
            </div>
            <span className="text-blue-600 font-bold text-xl">GAMBIT</span>
          </div>
          <p className="text-gray-600 text-sm">
            Engineering Consultancies Pvt Ltd
          </p>
        </div> */}

        {/* Bottom text overlay */}
        {/* <div className="absolute bottom-8 left-6 z-10 text-white max-w-md">
          <h2 className="text-3xl font-bold mb-4 leading-tight">
            Streamline your workday with
            <br />
            Timesheet App
          </h2>
          <p className="text-white/90 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sem
            magna, sollicitudin id vehicula eu, mattis a leo. Nam ut egestas ex.
          </p>
        </div> */}
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Welcome text */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Hi, Welcome
            </h1>
            <p className="text-gray-600">Please login to Time Sheet App</p>
          </div>

          {/* Tab buttons */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("email")}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all ${
                activeTab === "email"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sign in with Email
            </button>
            <button
              onClick={() => setActiveTab("mobile")}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all ${
                activeTab === "mobile"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Log in with Mobile
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email field */}
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Login button */}
            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
            >
              Login
            </Button>

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign up link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{" "}
              </span>
              <Link
                href="/signup"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
