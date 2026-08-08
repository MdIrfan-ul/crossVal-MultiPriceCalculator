"use client";

import type { DocumentListItem } from "@/lib/documents-api";
import { formatCurrencyFull } from "@/lib/format";

interface DocumentsTableProps {
    documents: DocumentListItem[];
    isLoading: boolean;
}

function StatusChip({ status }: { status: DocumentListItem["status"] }) {
    const isFinalized = status === "finalized";
    return (
        <span
            className={`rounded px-2 py-1 font-label-bold text-[10px] uppercase ${isFinalized
                    ? "bg-secondary-container/20 text-on-secondary-container"
                    : "bg-surface-container-highest text-on-surface-variant"
                }`}
        >
            {status}
        </span>
    );
}

function formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function DocumentsTable({ documents, isLoading }: DocumentsTableProps) {
    if (isLoading) {
        return (
            <div className="rounded border border-outline-variant bg-surface-container-lowest p-lg">
                <div className="flex flex-col gap-sm">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-10 w-full animate-pulse rounded bg-surface-container-highest"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (documents.length === 0) {
        return (
            <div className="rounded border border-outline-variant bg-surface-container-lowest p-xl text-center">
                <p className="font-body-md text-on-surface-variant">
                    No documents yet. Create your first one to get started.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded border border-outline-variant bg-surface-container-lowest">
            <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                    <tr className="border-b border-outline-variant font-label-bold text-label-bold uppercase text-on-surface-variant">
                        <th className="p-md">Title</th>
                        <th className="p-md">Client</th>
                        <th className="p-md">Date</th>
                        <th className="p-md">Status</th>
                        <th className="p-md text-right">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant font-data-table text-data-table text-on-surface">
                    {documents.map((doc) => (
                        <tr
                            key={doc._id}
                            className="cursor-pointer transition-colors hover:bg-surface-container/50"
                        >
                            <td className="p-md font-medium">{doc.title}</td>
                            <td className="p-md text-on-surface-variant">
                                {doc.customer_name}
                            </td>
                            <td className="p-md text-on-surface-variant">
                                {formatDate(doc.issue_date)}
                            </td>
                            <td className="p-md">
                                <StatusChip status={doc.status} />
                            </td>
                            <td className="p-md text-right tabular-nums">
                                {formatCurrencyFull(doc.grand_total)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}