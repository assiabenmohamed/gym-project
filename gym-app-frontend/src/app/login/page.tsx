"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    try {
      if (!emailRef.current?.value || !passwordRef.current?.value) {
        setError("Email and password are required");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailRef.current.value,
            password: passwordRef.current.value,
          }),
          credentials: "include",
        }
      );

      if (res.ok) {
        const data = await res.json();
        console.log("Login successful", data);
        setUser(data);
        router.push("/");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Connection error. Please try again later.");
    }
  }

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden flex">
        {/* Left Section - Illustration */}
        <div className="w-1/2 bg-gradient-to-br from-[#ff1313] to-[#ff857a] relative overflow-hidden">
          <div className="absolute -bottom-10 -right-20 w-full">
            <img
              src="/api/placeholder/400/400"
              alt="Fitness"
              className="w-full object-cover transform -rotate-12 hover:rotate-0 transition-transform duration-300"
            />
          </div>

          <div className="absolute top-10 left-10 text-white">
            <h1 className="text-4xl font-black">PlusFit</h1>
            <p className="text-xl mt-2 font-light">
              Your fitness journey starts here
            </p>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>
            <p className="text-gray-500 mb-8">Access your fitness account</p>

            {/* Email Field */}
            <div className="relative">
              <MdOutlineEmail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={24}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={credentials.email}
                onChange={handleChange}
                ref={emailRef}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-accent transition-colors"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <RiLockPasswordLine
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={24}
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                ref={passwordRef}
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-accent transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            {/* Additional Options */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="mr-2 rounded text-accent focus:ring-accent/80"
                />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-accent hover:text-accent/80">
                Forgot password?
              </a>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm font-medium">{error}</div>
            )}

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-[#ff1313] to-[#ff857a]


 text-white py-3 rounded-lg hover:from-[#ff1313e3] hover:to-[#ff857ae3] transition-all"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
