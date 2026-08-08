"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { AuthTabs, type AuthTab } from "@/components/auth/AuthTabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { CreateAccountForm } from "@/components/auth/CreateAccountForm";

export default function LoginPage() {
  const [tab, setTab] = useState<AuthTab>("login");

  return (
    <main className="flex min-h-full items-center justify-center px-margin-mobile py-xl md:px-margin-desktop">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="mb-xl text-center">
          <div className="mb-md inline-flex h-16 w-16 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
            <FileText className="h-8 w-8" strokeWidth={2} />
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary">
            CrossVal- Multi Price Calculator
          </h1>
          <p className="mt-sm font-body-lg text-body-lg text-on-surface-variant">
            Secure Document Management
          </p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
          <AuthTabs active={tab} onChange={setTab} />
          {tab === "login" ? <LoginForm /> : <CreateAccountForm />}
        </div>

      </div>
    </main>
  );
}
