"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/Toaster";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEdgeBrowser, setIsEdgeBrowser] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

  useEffect(() => {
    if (!email || !otp) {
      router.push("/forgot-password");
      return;
    }

    // Detect Edge browser
    const userAgent = window.navigator.userAgent;
    setIsEdgeBrowser(userAgent.includes("Edg"));
  }, [email, otp, router]);

  const validatePassword = (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber,
      errors: {
        minLength: !minLength,
        hasUpperCase: !hasUpperCase,
        hasLowerCase: !hasLowerCase,
        hasNumber: !hasNumber,
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setError("Password must be at least 8 characters long and contain uppercase, lowercase, and number");
      toast.error("Password does not meet requirements");
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Replace with actual API call to reset password
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Password reset successfully!");
      router.push("/login");
    } catch (error) {
      console.error("Error resetting password:", error);
      const errorMessage = "Failed to reset password. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!email || !otp) {
    return null; // Will redirect in useEffect
  }

  const passwordValidation = validatePassword(newPassword);

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
            alt="Reset Password Image"
            priority
          />
        </div>
      </div>
      {/* Right side - Reset Password form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 h-screen">
        <div className="w-full max-w-md">
          {/* Back to OTP verification link */}
          <div className="mb-4">
            <Link
              href={`/forgot-password/verify-otp?email=${encodeURIComponent(email)}`}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to OTP Verification
            </Link>
          </div>

          {/* Welcome text */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Reset Password
            </h1>
            <p className="text-sm text-gray-600">
              Enter your new password below
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password field */}
            <div>
              <Label
                htmlFor="newPassword"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-black"
                  required
                  disabled={isLoading}
                />
                {!isEdgeBrowser && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                )}
              </div>
              
              {/* Password requirements */}
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className={`text-xs flex items-center ${passwordValidation.errors.minLength ? 'text-red-500' : 'text-green-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${passwordValidation.errors.minLength ? 'bg-red-500' : 'bg-green-500'}`} />
                    At least 8 characters
                  </div>
                  <div className={`text-xs flex items-center ${passwordValidation.errors.hasUpperCase ? 'text-red-500' : 'text-green-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${passwordValidation.errors.hasUpperCase ? 'bg-red-500' : 'bg-green-500'}`} />
                    One uppercase letter
                  </div>
                  <div className={`text-xs flex items-center ${passwordValidation.errors.hasLowerCase ? 'text-red-500' : 'text-green-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${passwordValidation.errors.hasLowerCase ? 'bg-red-500' : 'bg-green-500'}`} />
                    One lowercase letter
                  </div>
                  <div className={`text-xs flex items-center ${passwordValidation.errors.hasNumber ? 'text-red-500' : 'text-green-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${passwordValidation.errors.hasNumber ? 'bg-red-500' : 'bg-green-500'}`} />
                    One number
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password field */}
            <div>
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-black"
                  required
                  disabled={isLoading}
                />
                {!isEdgeBrowser && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                )}
              </div>
              
              {/* Password match indicator */}
              {confirmPassword && (
                <div className="mt-2">
                  <div className={`text-xs flex items-center ${newPassword === confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${newPassword === confirmPassword ? 'bg-green-500' : 'bg-red-500'}`} />
                    {newPassword === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                disabled={isLoading || !passwordValidation.isValid || newPassword !== confirmPassword}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg"
                onClick={() => router.push("/login")}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>

          {/* Help text */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
