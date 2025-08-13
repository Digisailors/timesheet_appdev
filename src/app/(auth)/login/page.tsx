"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, Phone, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/Toaster";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("email");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEdgeBrowser, setIsEdgeBrowser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const showLogoutSuccess = localStorage.getItem('showLogoutSuccess');
    if (showLogoutSuccess === 'true') {
      toast.success("Logout Successful", {
        style: {
          background: '#3b82f6',
          color: 'white',
          border: 'none',
        },
      });
      localStorage.removeItem('showLogoutSuccess');
    }
    // Detect Edge browser
    const userAgent = window.navigator.userAgent;
    setIsEdgeBrowser(userAgent.includes("Edg"));
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const credentials = activeTab === "email"
      ? { email, password }
      : { phoneNumber, password };
    try {
      const result = await signIn("credentials", {
        ...credentials,
        redirect: false,
      });
      if (result?.error) {
        const errorMessage = result.error;
        setError(errorMessage);
        if (errorMessage.toLowerCase().includes("email")) {
          toast.error("Incorrect email");
        } else if (errorMessage.toLowerCase().includes("password")) {
          toast.error("Incorrect password");
        } else if (errorMessage.toLowerCase().includes("phone")) {
          toast.error("Incorrect phone number");
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        "The email/phone number or password is incorrect. Please check your credentials and try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-hidden">
      <Toaster />
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 justify-center items-center h-screen bg-gray-100">
        <div className="relative w-full h-full flex justify-center items-center">
          <Image
            src="/assets/auth/login.png"
            fill
            style={{ objectFit: "contain" }}
            alt="Login Image"
            priority
          />
        </div>
      </div>
      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 h-screen">
        <div className="w-full max-w-md">
          {/* Welcome text */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Hi, Welcome
            </h1>
            <p className="text-sm text-gray-600">Please login to Time Sheet App</p>
          </div>
          {/* Tab buttons */}
          <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("email")}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${
                activeTab === "email"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sign in with Email
            </button>
            <button
              onClick={() => setActiveTab("mobile")}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${
                activeTab === "mobile"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Log in with Mobile
            </button>
          </div>
          {/* Error message */}
          {error && (
            <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded-md text-xs">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email or Phone Number field */}
            <div>
              <Label
                htmlFor={activeTab === "email" ? "email" : "phoneNumber"}
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                {activeTab === "email" ? "Email" : "Phone Number"}
              </Label>
              <div className="relative">
                {activeTab === "email" ? (
                  <>
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-black"
                      required
                      disabled={isLoading}
                    />
                  </>
                ) : (
                  <>
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-black"
                      required
                      disabled={isLoading}
                    />
                  </>
                )}
              </div>
            </div>
            {/* Password field */}
            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-black"
                  required
                  disabled={isLoading}
                />
                {!isEdgeBrowser && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                )}
              </div>
            </div>
            {/* Login button */}
            <Button
              type="submit"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Login"}
            </Button>
            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
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
            <div className="text-center mt-2">
              <span className="text-sm text-gray-600">
                Don&#39;t have an account?{" "}
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
