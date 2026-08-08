"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: ReactNode;
  error?: string;
  trailing?: ReactNode;
}

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  function AuthField(
    { label, icon, error, trailing, id, className, ...inputProps },
    ref,
  ) {
    const describedBy = error ? `${id}-error` : undefined;

    return (
      <div className="space-y-sm">
        {label ? (
          <label
            htmlFor={id}
            className="block font-label-bold text-label-bold text-on-surface"
          >
            {label}
          </label>
        ) : null}
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-sm text-outline-variant">
            {icon}
          </span>
          <input
            ref={ref}
            id={id}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={`block w-full rounded border py-sm pl-[36px] pr-sm font-body-md text-body-md text-on-surface placeholder-outline transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              error
                ? "border-error focus:border-error"
                : "border-outline-variant focus:border-primary"
            } ${trailing ? "pr-[40px]" : ""} ${className ?? ""}`}
            {...inputProps}
          />
          {trailing ? (
            <span className="absolute inset-y-0 right-0 flex items-center pr-sm">
              {trailing}
            </span>
          ) : null}
        </div>
        {error ? (
          <p id={`${id}-error`} className="font-body-sm text-body-sm text-error">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
