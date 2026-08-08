"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { AlertBanner } from "@/components/auth/AlertBanner";
import { listDocuments, type DocumentListItem } from "@/lib/documents-api";
import { DocumentsTable } from "@/components/documents/DocumentsListTable";

export default function DocumentsPage() {
    const router = useRouter();

    const [documents, setDocuments] = useState<DocumentListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadDocuments = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await listDocuments({ page: 1, page_size: 50 });
            if (res.status !== 200 || !res.result) {
                setError(res.errorMessage || "Could not load documents");
                return;
            }
            setDocuments(res.result.documents);
        } catch {
            setError("Could not reach the server. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDocuments();
    }, [loadDocuments]);

    return (
        <div className="flex h-screen overflow-hidden bg-[#F4F5F7] font-body-md text-on-surface">
            <Sidebar />
            <div className="flex w-full flex-1 flex-col md:ml-64">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop">
                    <div className="mx-auto max-w-7xl space-y-lg">
                        <header className="flex flex-col justify-between gap-md md:flex-row md:items-end">
                            <div>
                                <h2 className="font-headline-xl text-headline-xl text-on-surface">
                                    Documents
                                </h2>
                                <p className="mt-xs font-body-md text-on-surface-variant">
                                    All invoices and billing documents.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => router.push("/documents/new")}
                                className="flex items-center justify-center gap-sm rounded bg-primary px-md py-sm font-label-bold text-label-bold text-on-primary transition-colors hover:bg-primary-container hover:text-on-primary-container"
                            >
                                <Plus className="h-[18px] w-[18px]" />
                                Create Document
                            </button>
                        </header>

                        {error ? <AlertBanner message={error} /> : null}

                        <DocumentsTable documents={documents} isLoading={isLoading} />
                    </div>
                </main>
            </div>
        </div>
    );
}