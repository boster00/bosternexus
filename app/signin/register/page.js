"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/libs/supabase/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import config from "@/config";

export default function Register() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate email domain
    const allowedDomains = process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAINS?.split(',').map(d => d.trim().toLowerCase()) || [];
    
    if (allowedDomains.length > 0) {
      const emailDomain = email.split('@')[1]?.toLowerCase();
      if (!emailDomain || !allowedDomains.includes(emailDomain)) {
        toast.error(`Registration is only allowed for: ${allowedDomains.join(', ')}`);
        return;
      }
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Sign up with email and password
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          data: {
            name: name || email.split('@')[0],
          },
        },
      });

      if (authError) {
        toast.error(authError.message || "Registration failed");
        return;
      }

      if (authData.user) {
        // Create profile entry via server-side API to ensure proper permissions
        try {
          const registerResponse = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: authData.user.id,
              email: authData.user.email,
              name: name || email.split('@')[0],
            }),
          });

          const registerData = await registerResponse.json();

          if (!registerResponse.ok) {
            console.error("Profile creation error:", registerData);
            // Still show success message since auth user was created
            // Profile will be created on first login via callback route
          }
        } catch (error) {
          console.error("Failed to create profile:", error);
          // Still show success message since auth user was created
          // Profile will be created on first login via callback route
        }

        toast.success("Registration successful! Please check your email to verify your account.");
        
        // Redirect to signin page after a short delay
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-8 md:p-24" data-theme={config.colors.theme}>
      <div className="text-center mb-4">
        <Link href="/" className="btn btn-ghost btn-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Home
        </Link>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-12">
        Create Account - {config.appName}
      </h1>

      <div className="max-w-xl mx-auto">
        <form className="form-control w-full space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              value={name}
              autoComplete="name"
              placeholder="John Doe"
              className="input input-bordered w-full placeholder:opacity-60"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              required
              type="email"
              value={email}
              autoComplete="email"
              placeholder="tom@cruise.com"
              className="input input-bordered w-full placeholder:opacity-60"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              required
              type="password"
              value={password}
              autoComplete="new-password"
              placeholder="Minimum 6 characters"
              className="input input-bordered w-full placeholder:opacity-60"
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              required
              type="password"
              value={confirmPassword}
              autoComplete="new-password"
              placeholder="Confirm your password"
              className="input input-bordered w-full placeholder:opacity-60"
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
            />
          </div>

          <button
            className="btn btn-primary btn-block"
            disabled={isLoading}
            type="submit"
          >
            {isLoading && <span className="loading loading-spinner loading-xs"></span>}
            Create Account
          </button>
        </form>

        <div className="divider text-xs text-base-content/50 font-medium mt-8">
          OR
        </div>

        <div className="text-center mt-6">
          <p className="text-sm opacity-70">
            Already have an account?{" "}
            <Link href="/signin" className="link link-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

