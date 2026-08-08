"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LineItemsTable, type EditableLineItem } from "@/components/documents/LineItemsTable";
import { FinancialSummaryPanel } from "@/components/documents/FinancialSummaryPanel";
import { AlertBanner } from "@/components/auth/AlertBanner";
import { calculateDocumentTotals, type LineItemInput } from "@/lib/document-calculations";
import { createDocument, updateDocument, type DocumentStatus } from "@/lib/documents-api";

// TODO: replace with a real customer lookup (e.g. GET /api/customers).
// Hardcoded to match the mock until that endpoint exists.
const CUSTOMER_OPTIONS = ["Acme Corporation", "Globex Inc.", "Soylent Corp"];

let rowKeyCounter = 0;
function nextRowKey() {
  rowKeyCounter += 1;
  return `row-${rowKeyCounter}`;
}

function emptyRow(): EditableLineItem {
  return {
    key: nextRowKey(),
    description: "",
    quantity: 1,
    unit_price: 0,
    discount_value: 0,
    discount_type: "percent",
    tax_percent: 0,
  };
}

export default function NewDocumentPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [customerName, setCustomerName] = useState(CUSTOMER_OPTIONS[0]);
  const [issueDate, setIssueDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<EditableLineItem[]>([emptyRow()]);

  const [documentId, setDocumentId] = useState<string | null>(null);
  const [status, setStatus] = useState<DocumentStatus>("draft");
  const [isSaving, setIsSaving] = useState<DocumentStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isFinalized = status === "finalized";

  const lineItemInputs: LineItemInput[] = useMemo(
    () =>
      items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount: item.discount_value
          ? { type: item.discount_type, value: item.discount_value }
          : undefined,
        tax_percent: item.tax_percent || undefined,
      })),
    [items],
  );

  const { lines, totals } = useMemo(
    () => calculateDocumentTotals(lineItemInputs),
    [lineItemInputs],
  );

  function updateItem(key: string, patch: Partial<EditableLineItem>) {
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, ...patch } : item)),
    );
  }

  function addItem() {
    setItems((prev) => [...prev, emptyRow()]);
  }

  function removeItem(key: string) {
    setItems((prev) => prev.filter((item) => item.key !== key));
  }

  function validate(): string | null {
    if (!title.trim()) return "Document title is required";
    if (!customerName.trim()) return "Customer name is required";
    if (!issueDate) return "Issue date is required";
    if (items.length === 0) return "Add at least one line item";
    for (const item of items) {
      if (!item.description.trim()) return "Every line item needs a description";
      if (item.quantity < 1) return "Quantity must be at least 1";
      if (item.unit_price < 0) return "Unit price must be 0 or greater";
    }
    return null;
  }

  async function handleSave(nextStatus: DocumentStatus) {
    setErrorMessage(null);

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSaving(nextStatus);
    try {
      const payload = {
        title,
        customer_name: customerName,
        issue_date: issueDate,
        status: nextStatus,
        notes,
        line_items: lineItemInputs.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          discount: item.discount,
          tax_percent: item.tax_percent,
        })),
      };

      const res = documentId
        ? await updateDocument(documentId, payload)
        : await createDocument(payload);

      if (res.status !== 200 || !res.result) {
        setErrorMessage(res.errorMessage || "Could not save document");
        return;
      }

      setDocumentId(res.result._id);
      setStatus(res.result.status);
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSaving(null);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F5F7] font-body-md text-on-background">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-margin-desktop py-lg">
        <div className="flex items-center gap-lg">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex items-center justify-center rounded-full p-sm text-on-surface-variant transition-colors hover:bg-surface-container"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-sm">
              <h1 className="font-headline-md text-headline-md text-on-surface">
                {documentId ? "Edit Document" : "Create New Document"}
              </h1>
              <span
                className={`rounded px-2 py-1 font-label-bold text-[10px] uppercase ${
                  isFinalized
                    ? "bg-primary-container text-on-primary"
                    : "bg-surface-container-highest text-on-surface"
                }`}
              >
                {status}
              </span>
            </div>
            <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
              {documentId ? `Editing document ${documentId}` : "Drafting a new document"}
            </p>
          </div>
        </div>

        {!isFinalized ? (
          <div className="flex items-center gap-md">
            <button
              type="button"
              onClick={() => handleSave("draft")}
              disabled={isSaving !== null}
              className="rounded border border-outline-variant bg-transparent px-md py-sm font-label-bold text-label-bold text-on-surface-variant transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving === "draft" ? "Saving…" : "Save Draft"}
            </button>
            <button
              type="button"
              onClick={() => handleSave("finalized")}
              disabled={isSaving !== null}
              className="rounded bg-primary px-md py-sm font-label-bold text-label-bold text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving === "finalized" ? "Finalizing…" : "Finalize"}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => router.push("/documents/new")}
            className="rounded border border-outline-variant bg-transparent px-md py-sm font-label-bold text-label-bold text-on-surface-variant transition-colors hover:bg-surface-container"
          >
            Duplicate
          </button>
        )}
      </header>

      {/* Main content */}
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-gutter px-margin-desktop py-lg md:flex-row">
        {/* Left column */}
        <div className="flex flex-1 flex-col gap-lg">
          {errorMessage ? <AlertBanner message={errorMessage} /> : null}

          {/* Document Details */}
          <section className="rounded border border-outline-variant bg-surface-container-lowest p-lg">
            <h2 className="mb-lg font-headline-sm text-headline-sm text-on-surface">
              Document Details
            </h2>
            <div className="grid grid-cols-1 gap-x-gutter gap-y-md md:grid-cols-2">
              <div className="flex flex-col gap-xs">
                <label
                  htmlFor="doc-title"
                  className="font-label-bold text-label-bold text-on-surface-variant"
                >
                  Document Title
                </label>
                <input
                  id="doc-title"
                  type="text"
                  value={title}
                  disabled={isFinalized}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter document title"
                  className="w-full rounded border border-outline-variant px-md py-sm font-body-md text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:border-transparent disabled:bg-surface-container-lowest"
                />
              </div>

              <div className="flex flex-col gap-xs">
                <label
                  htmlFor="doc-client"
                  className="font-label-bold text-label-bold text-on-surface-variant"
                >
                  Customer Name
                </label>
                <select
                  id="doc-client"
                  value={customerName}
                  disabled={isFinalized}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded border border-outline-variant bg-surface-container-lowest px-md py-sm font-body-md text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:border-transparent"
                >
                  {CUSTOMER_OPTIONS.map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-xs">
                <label
                  htmlFor="doc-date"
                  className="font-label-bold text-label-bold text-on-surface-variant"
                >
                  Issue Date
                </label>
                <input
                  id="doc-date"
                  type="date"
                  value={issueDate}
                  disabled={isFinalized}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full rounded border border-outline-variant px-md py-sm font-body-md text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:border-transparent disabled:bg-surface-container-lowest"
                />
              </div>
            </div>
          </section>

          {/* Line Items */}
          <LineItemsTable
            items={items}
            lineTotals={lines.map((l) => l.line_total)}
            disabled={isFinalized}
            onChange={updateItem}
            onAdd={addItem}
            onRemove={removeItem}
          />

          {/* Internal Notes */}
          <section className="rounded border border-outline-variant bg-surface-container-lowest p-lg">
            <h2 className="mb-sm font-headline-sm text-headline-sm text-on-surface">
              Internal Notes
            </h2>
            <p className="mb-md font-body-sm text-body-sm text-on-surface-variant">
              These notes will not appear on the finalized document sent to the client.
            </p>
            <textarea
              value={notes}
              disabled={isFinalized}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add private notes here…"
              className="h-32 w-full resize-y rounded border border-outline-variant p-md font-body-md text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:border-transparent disabled:bg-surface-container-lowest"
            />
          </section>
        </div>

        {/* Right column */}
        <FinancialSummaryPanel totals={totals} status={status} />
      </main>
    </div>
  );
}
