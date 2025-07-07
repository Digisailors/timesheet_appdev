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
import { Mail, Lock, User } from "lucide-react";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }
    router.push("/login");
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
            Join our team and
            <br />
            manage your time efficiently
          </h2>
          <p className="text-white/90 leading-relaxed">
            Create your account to start tracking your work hours and boost your
            productivity with our timesheet app.
          </p>
        </div> */}
      </div>

      {/* Right side - Sign up form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Welcome text */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">Sign up for Time Sheet App</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="firstName"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  First Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="pl-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="lastName"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

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
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Password fields */}
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
                  name="password"
                  type="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    agreeToTerms: checked as boolean,
                  }))
                }
              />
              <Label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms and Conditions
                </Link>
              </Label>
            </div>

            {/* Create account button */}
            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
            >
              Create Account
            </Button>

            {/* Sign in link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{" "}
              </span>
              <Link
                href="/login"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
