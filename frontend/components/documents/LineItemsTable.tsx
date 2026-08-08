"use client";

import { Plus, Trash2 } from "lucide-react";
import type { DiscountType } from "@/lib/document-calculations";
import { formatCurrencyFull } from "@/lib/format";

export interface EditableLineItem {
  key: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount_value: number;
  discount_type: DiscountType;
  tax_percent: number;
}

interface LineItemsTableProps {
  items: EditableLineItem[];
  lineTotals: number[];
  disabled?: boolean;
  onChange: (key: string, patch: Partial<EditableLineItem>) => void;
  onAdd: () => void;
  onRemove: (key: string) => void;
}

const inputClass =
  "w-full rounded border border-transparent bg-transparent px-sm py-xs outline-none transition-colors hover:border-outline-variant focus:border-primary focus:bg-surface-container-lowest disabled:cursor-not-allowed disabled:opacity-70";

export function LineItemsTable({
  items,
  lineTotals,
  disabled,
  onChange,
  onAdd,
  onRemove,
}: LineItemsTableProps) {
  return (
    <section className="flex flex-col rounded border border-outline-variant bg-surface-container-lowest">
      <div className="flex items-center justify-between border-b border-outline-variant p-lg">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">
          Line Items
        </h2>
        {!disabled ? (
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-sm font-label-bold text-label-bold text-primary hover:underline"
          >
            <Plus className="h-[18px] w-[18px]" />
            Add Item
          </button>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low font-label-bold text-label-bold text-on-surface-variant">
              <th className="w-[25%] p-md">Description</th>
              <th className="w-[10%] p-md text-right">Qty</th>
              <th className="w-[15%] p-md text-right">Unit Price</th>
              <th className="w-[15%] p-md text-right">Discount</th>
              <th className="w-[10%] p-md text-right">Tax %</th>
              <th className="w-[15%] p-md text-right">Subtotal</th>
              <th className="w-10 p-md" />
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant font-data-table text-data-table text-on-surface">
            {items.map((item, i) => (
              <tr
                key={item.key}
                className="group transition-colors hover:bg-surface-container/50"
              >
                <td className="p-md">
                  <input
                    type="text"
                    value={item.description}
                    disabled={disabled}
                    onChange={(e) =>
                      onChange(item.key, { description: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Item or service name"
                  />
                </td>
                <td className="p-md">
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={item.quantity}
                    disabled={disabled}
                    onChange={(e) =>
                      onChange(item.key, {
                        quantity: Number(e.target.value),
                      })
                    }
                    className={`${inputClass} text-right`}
                  />
                </td>
                <td className="p-md">
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.unit_price}
                    disabled={disabled}
                    onChange={(e) =>
                      onChange(item.key, {
                        unit_price: Number(e.target.value),
                      })
                    }
                    className={`${inputClass} text-right`}
                  />
                </td>
                <td className="p-md">
                  <div className="flex items-center justify-end gap-xs">
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.discount_value}
                      disabled={disabled}
                      onChange={(e) =>
                        onChange(item.key, {
                          discount_value: Number(e.target.value),
                        })
                      }
                      className={`${inputClass} w-16 text-right text-on-surface-variant`}
                    />
                    <select
                      value={item.discount_type}
                      disabled={disabled}
                      onChange={(e) =>
                        onChange(item.key, {
                          discount_type: e.target.value as DiscountType,
                        })
                      }
                      className={`${inputClass} w-12 appearance-none text-center text-on-surface-variant`}
                    >
                      <option value="percent">%</option>
                      <option value="fixed">$</option>
                    </select>
                  </div>
                </td>
                <td className="p-md">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={item.tax_percent}
                    disabled={disabled}
                    onChange={(e) =>
                      onChange(item.key, {
                        tax_percent: Number(e.target.value),
                      })
                    }
                    className={`${inputClass} text-right text-on-surface-variant`}
                  />
                </td>
                <td className="p-md text-right font-medium tabular-nums">
                  {formatCurrencyFull(lineTotals[i] ?? 0)}
                </td>
                <td className="p-md text-center">
                  {!disabled ? (
                    <button
                      type="button"
                      onClick={() => onRemove(item.key)}
                      aria-label={`Remove ${item.description || "line item"}`}
                      className="text-outline opacity-0 transition-opacity hover:text-error group-hover:opacity-100"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-lg text-center font-body-sm text-body-sm text-on-surface-variant"
                >
                  No line items yet. Add one to get started.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
