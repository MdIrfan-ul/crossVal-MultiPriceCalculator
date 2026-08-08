"use client";

export type AuthTab = "login" | "create";

interface AuthTabsProps {
  active: AuthTab;
  onChange: (tab: AuthTab) => void;
}

const TABS: { id: AuthTab; label: string }[] = [
  { id: "login", label: "Login" },
  { id: "create", label: "Create Account" },
];

export function AuthTabs({ active, onChange }: AuthTabsProps) {
  return (
    <div role="tablist" aria-label="Authentication" className="flex border-b border-outline-variant">
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            type="button"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={`flex-1 py-md font-label-bold text-label-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
              isActive
                ? "border-b-2 border-primary bg-surface-container-low text-primary"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
