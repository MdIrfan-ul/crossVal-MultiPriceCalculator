import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F5F7] font-body-md text-on-surface">
      <Sidebar />
      <div className="flex w-full flex-1 flex-col md:ml-64">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop">
          <div className="mx-auto max-w-7xl space-y-lg">{children}</div>
        </main>
      </div>
    </div>
  );
}
