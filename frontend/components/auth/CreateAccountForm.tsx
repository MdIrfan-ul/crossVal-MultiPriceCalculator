"use client";

import { useState, type FormEvent } from "react";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { AuthField } from "./AuthField";
import { AlertBanner } from "./AlertBanner";
import { isValidEmail, isValidPassword, type FieldErrors } from "@/lib/validation";

export function CreateAccountForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!name.trim()) {
      next.name = "Full name is required";
    }
    if (!email.trim()) {
      next.email = "Work email is required";
    } else if (!isValidEmail(email)) {
      next.email = "Enter a valid email address";
    }
    if (!password) {
      next.password = "Password is required";
    } else if (!isValidPassword(password)) {
      next.password = "Password must be at least 8 characters";
    }
    if (confirmPassword !== password) {
      next.confirmPassword = "Passwords do not match";
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
      // Wire this up to your real registration endpoint, e.g.:
      // const res = await fetch("/api/auth/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name, email, password }),
      // });
      // const data = await res.json();
      // if (data.status !== 200) {
      //   setServerError(data.errorMessage || "Could not create account");
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
      id="panel-create"
      aria-labelledby="tab-create"
      className="p-lg md:p-xl"
    >
      <form className="space-y-lg" onSubmit={handleSubmit} noValidate>
        {serverError ? <AlertBanner message={serverError} /> : null}

        <AuthField
          id="name"
          name="name"
          type="text"
          label="Full Name"
          placeholder="Jordan Lee"
          icon={<User className="h-4 w-4" />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          autoComplete="name"
        />

        <AuthField
          id="create-email"
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

        <AuthField
          id="create-password"
          name="password"
          type={showPassword ? "text" : "password"}
          label="Password"
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="new-password"
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

        <AuthField
          id="confirm-password"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          label="Confirm Password"
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-xs rounded border border-transparent bg-primary py-sm px-md font-label-bold text-label-bold text-on-primary shadow-sm transition-colors hover:bg-on-primary-fixed-variant focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account…
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="h-[18px] w-[18px]" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
