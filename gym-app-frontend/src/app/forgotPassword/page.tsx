"use client";

import type React from "react";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { set } from "react-hook-form";

export default function Component() {
  const [step, setStep] = useState<"email" | "sent">("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    try {
      const sendEmailRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/auth/send-reset-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await sendEmailRes.json();

      if (!sendEmailRes.ok) {
        throw new Error(data.message || "Failed to send reset email.");
      }

      setStep("sent");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleResend = async () => {
    setIsLoading(true);
    try {
      // Simulate resending
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Here you would add your resend logic
    } catch (err) {
      setError("Error resending email");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "sent") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Email sent!</CardTitle>
              <CardDescription className="mt-2">
                We've sent a reset link to
              </CardDescription>
              <p className="font-medium text-sm mt-1">{email}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>Check your inbox and click the link to reset your password.</p>
              <p>The email may take a few minutes to arrive.</p>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResend}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Resend email"}
              </Button>

              <Button asChild variant="ghost" className="w-full">
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Link>
              </Button>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              <p>Didn't receive the email?</p>
              <p>Check your spam folder or contact support.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Forgot password?</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send reset link"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button asChild variant="ghost" className="text-sm">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </Button>
          </div>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
