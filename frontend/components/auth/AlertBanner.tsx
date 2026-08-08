"use client";

import { AlertCircle } from "lucide-react";

export function AlertBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-sm rounded border border-error-container bg-error-container px-md py-sm"
    >
      <AlertCircle className="mt-[2px] h-4 w-4 flex-shrink-0 text-on-error-container" />
      <p className="font-body-sm text-body-sm text-on-error-container">
        {message}
      </p>
    </div>
  );
}
