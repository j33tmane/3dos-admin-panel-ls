"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import type { FormEvent } from "react";
import { authService } from "@/services";
import { User, Tokens } from "@/types";
import { formatOtpInput } from "@/utils";

type LoginStep = "email" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("OTP sent to your email address");
        setStep("otp");
      } else {
        setErrorMessage(data.message || "Failed to send OTP");
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/login-with-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens and user info in browser cache (localStorage)
        if (data.tokens && data.user) {
          authService.setTokens(data.tokens as Tokens);
          authService.setUser(data.user as User);
          console.log("✅ Tokens and user data stored successfully:", {
            user: data.user,
            tokens: {
              access: { expires: data.tokens.access.expires },
              refresh: { expires: data.tokens.refresh.expires },
            },
          });

          // Debug: Verify stored data
          authService.debugStoredData();
        }

        // Login successful, redirect to dashboard
        router.replace("/dashboard");
      } else {
        setErrorMessage(data.message || "Invalid OTP");
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setOtp("");
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            {step === "email" ? "Login to your account" : "Enter OTP"}
          </CardTitle>
          <CardDescription>
            {step === "email"
              ? "Enter your email to receive an OTP"
              : `Enter the 6-digit OTP sent to ${email}`}
          </CardDescription>
          {step === "email" && (
            <CardAction>
              <Button
                variant="link"
                onClick={() => router.push("/register")}
                className="hover"
              >
                Sign Up
              </Button>
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          {step === "email" ? (
            <form onSubmit={handleEmailSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              {errorMessage && (
                <p className="text-sm text-red-600 mt-4" role="alert">
                  {errorMessage}
                </p>
              )}
              <CardFooter className="flex-col gap-2 p-0 pt-6">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </CardFooter>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="otp">OTP Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    required
                    value={otp}
                    onChange={(e) => setOtp(formatOtpInput(e.target.value))}
                    disabled={isLoading}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>
                {successMessage && (
                  <p className="text-sm text-green-600" role="alert">
                    {successMessage}
                  </p>
                )}
                {errorMessage && (
                  <p className="text-sm text-red-600" role="alert">
                    {errorMessage}
                  </p>
                )}
              </div>
              <CardFooter className="flex-col gap-2 p-0 pt-6">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleBackToEmail}
                  disabled={isLoading}
                >
                  Back to Email
                </Button>
              </CardFooter>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
