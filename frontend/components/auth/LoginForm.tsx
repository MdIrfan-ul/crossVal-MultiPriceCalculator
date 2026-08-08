"use client";

import { useState, type FormEvent } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { AuthField } from "./AuthField";
import { AlertBanner } from "./AlertBanner";
import { isValidEmail, type FieldErrors } from "@/lib/validation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!email.trim()) {
      next.email = "Email is required";
    } else if (!isValidEmail(email)) {
      next.email = "Enter a valid email address";
    }
    if (!password) {
      next.password = "Password is required";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Wire this up to your real auth endpoint, e.g.:
      // const res = await fetch("/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await res.json();
      // if (data.status !== 200) {
      //   setServerError(data.errorMessage || "Sign in failed");
      //   return;
      // }
      // redirect on success...

      await new Promise((resolve) => setTimeout(resolve, 800)); // placeholder
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      role="tabpanel"
      id="panel-login"
      aria-labelledby="tab-login"
      className="p-lg md:p-xl"
    >
      <form className="space-y-lg" onSubmit={handleSubmit} noValidate>
        {serverError ? <AlertBanner message={serverError} /> : null}

        <AuthField
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="name@email.com"
          icon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />

        <div className="space-y-sm">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block font-label-bold text-label-bold text-on-surface"
            >
              Password
            </label>
            <a
              href="/forgot-password"
              className="font-body-sm text-body-sm text-primary hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <AuthField
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            label=""
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-outline-variant hover:text-on-surface-variant focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-xs rounded border border-transparent bg-primary py-sm px-md font-label-bold text-label-bold text-on-primary shadow-sm transition-colors hover:bg-on-primary-fixed-variant focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="h-[18px] w-[18px]" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
