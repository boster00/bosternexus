"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/libs/supabase/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import config from "@/config";

// This a login/singup page for Supabase Auth.
// Successfull login redirects to /api/auth/callback where the Code Exchange is processed (see app/api/auth/callback/route.js).
export default function Login() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [authMode, setAuthMode] = useState("password"); // 'magic_link' or 'password'

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
        return;
      }

      if (data.user) {
        toast.success("Sign in successful!");
        router.push(config.auth.callbackUrl);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e, options) => {
    e?.preventDefault();

    setIsLoading(true);

    try {
      const { type } = options;
      const redirectURL = window.location.origin + "/api/auth/callback";

      if (type === "magic_link") {
        if (!email) {
          toast.error("Please enter your email address");
          setIsLoading(false);
          return;
        }

        // Validate email domain
        const allowedDomains = process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAINS?.split(',').map(d => d.trim().toLowerCase()) || [];
        
        if (allowedDomains.length > 0) {
          const emailDomain = email.split('@')[1]?.toLowerCase();
          if (!emailDomain || !allowedDomains.includes(emailDomain)) {
            toast.error(`Sign in is only allowed for: ${allowedDomains.join(', ')}`);
            setIsLoading(false);
            return;
          }
        }

        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: redirectURL,
          },
        });

        if (error) {
          toast.error(error.message || "Failed to send magic link");
        } else {
          toast.success("Check your emails!");
          setIsDisabled(true);
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(error.message || "An error occurred");
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
        Sign-in to {config.appName}{" "}
      </h1>

      <div className="space-y-8 max-w-xl mx-auto">
        {/* Toggle between Email & Password and Magic Link */}
        <div className="tabs tabs-boxed w-full mb-4">
          <button
            className={`tab flex-1 ${authMode === "password" ? "tab-active" : ""}`}
            onClick={() => setAuthMode("password")}
            type="button"
          >
            Email & Password
          </button>
          <button
            className={`tab flex-1 ${authMode === "magic_link" ? "tab-active" : ""}`}
            onClick={() => setAuthMode("magic_link")}
            type="button"
          >
            Magic Link
          </button>
        </div>

        {authMode === "password" ? (
          <form
            className="form-control w-full space-y-4"
            onSubmit={handleEmailPasswordLogin}
          >
            <input
              required
              type="email"
              value={email}
              autoComplete="email"
              placeholder="tom@cruise.com"
              className="input input-bordered w-full placeholder:opacity-60"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              required
              type="password"
              value={password}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="input input-bordered w-full placeholder:opacity-60"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="btn btn-primary btn-block"
              disabled={isLoading}
              type="submit"
            >
              {isLoading && (
                <span className="loading loading-spinner loading-xs"></span>
              )}
              Sign In
            </button>
          </form>
        ) : (
          <form
            className="form-control w-full space-y-4"
            onSubmit={(e) => handleSignup(e, { type: "magic_link" })}
          >
            <input
              required
              type="email"
              value={email}
              autoComplete="email"
              placeholder="tom@cruise.com"
              className="input input-bordered w-full placeholder:opacity-60"
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              className="btn btn-primary btn-block"
              disabled={isLoading || isDisabled}
              type="submit"
            >
              {isLoading && (
                <span className="loading loading-spinner loading-xs"></span>
              )}
              Send Magic Link
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <p className="text-sm opacity-70">
            Don&apos;t have an account?{" "}
            <Link href="/signin/register" className="link link-primary">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
