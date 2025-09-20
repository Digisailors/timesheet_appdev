"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Clock } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/Toaster";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) {
      router.push("/forgot-password");
      return;
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic OTP validation (assuming 6-digit OTP)
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP");
      toast.error("Please enter a valid 6-digit OTP");
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Replace with actual API call to verify OTP
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("OTP verified successfully!");
      // Navigate to reset password page with email and OTP as query params
      router.push(`/forgot-password/reset-password?email=${encodeURIComponent(email!)}&otp=${otp}`);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      const errorMessage = "Invalid OTP. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setIsResending(true);
    setError("");

    try {
      // TODO: Replace with actual API call to resend OTP
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("OTP sent successfully!");
      setCountdown(60);
      setCanResend(false);
    } catch (error) {
      console.error("Error resending OTP:", error);
      const errorMessage = "Failed to resend OTP. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return null; // Will redirect in useEffect
  }

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
            alt="Verify OTP Image"
            priority
          />
        </div>
      </div>
      {/* Right side - OTP Verification form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 h-screen">
        <div className="w-full max-w-md">
          {/* Back to forgot password link */}
          <div className="mb-4">
            <Link
              href="/forgot-password"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Forgot Password
            </Link>
          </div>

          {/* Welcome text */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verify OTP
            </h1>
            <p className="text-sm text-gray-600 mb-2">
              We&apos;ve sent a 6-digit verification code to
            </p>
            <p className="text-sm font-medium text-gray-900">{email}</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP field */}
            <div>
              <Label
                htmlFor="otp"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Enter Verification Code
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-black text-center text-lg tracking-widest"
                  required
                  disabled={isLoading}
                  maxLength={6}
                />
              </div>
            </div>

            {/* Resend OTP section */}
            <div className="text-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="text-sm text-blue-600 hover:underline font-medium disabled:opacity-50"
                >
                  {isResending ? "Resending..." : "Resend OTP"}
                </button>
              ) : (
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  Resend OTP in {countdown}s
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg"
                onClick={() => router.push("/forgot-password")}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>

          {/* Help text */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              Didn&apos;t receive the code? Check your spam folder or{" "}
              <button
                onClick={handleResendOTP}
                disabled={!canResend || isResending}
                className="text-blue-600 hover:underline font-medium disabled:opacity-50"
              >
                resend
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
