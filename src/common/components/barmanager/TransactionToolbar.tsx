'use client';

import useIsMobile from "@/common/hooks/useIsMobile";
import {
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Printer,
  File,
  Share2,
  Lock,
  CircleCheckBig
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { MenuItem } from "@/common/components/filter/MenuItem";
import { Permissions } from "@/common/types/privilege.types";
import { ToolbarSelect } from "./ToolbarSelect";
import InlineSelectField from "../InlineSelectField";


type ToolbarSelect = {
  name: string;
  options: { value: string; label: string }[];
  label?: string;
  value?: string | null;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onChange?: (value: string | null) => void;
};

type ToolbarDateSelectProps = {
  name: string;
  label?: string;
  value?: string | null;
  placeholder?: string;
  className?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  dateFormat?: string;
  onChange?: (value: string | null) => void;
};
interface TransactionToolbarProps {
  title: string;
  permissions: Permissions;

  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onRefresh?: () => void;
  onView?: () => void;
  onPrint?: () => void;
  onExport?: (e?: any) => void;

  onApprove?: () => void;
  onConfirmed?: () => void;

  // hasSelection?: boolean; 
  isRowConfirmed?: boolean;
  isRowApproved?: boolean;

  periodTitle?: string;

  selectBranch?: ToolbarSelect;
  disabled?: boolean;
  selectFromDate?: ToolbarDateSelectProps;
  selectToDate?: ToolbarDateSelectProps
}

export function TransactionToolbar({
  title,
  permissions,
  onAdd,
  onEdit,
  onDelete,
  onRefresh,
  onView,
  onPrint,
  onExport,

  onConfirmed,
  onApprove,

  // hasSelection = true,
  isRowConfirmed,
  isRowApproved,

  periodTitle,
  selectBranch,
  disabled,
  selectFromDate,
  selectToDate,
}: TransactionToolbarProps) {

  const isMobile = useIsMobile();
  const { canAdd, canEdit, canDelete, canView, canPrint, canExport } = permissions;

  const [openShare, setOpenShare] = useState(false);
  const shareRef = useRef<HTMLDivElement | null>(null);

  const isEditDisabled = isRowConfirmed || isRowApproved;
  const isDeleteDisabled = isRowApproved;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setOpenShare(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isMobile) {
    return (
      <div className="w-full bg-blue-900 border rounded-lg shadow-sm p-1">
        <div className="flex items-center justify-between w-full">
          <strong className="text-white truncate">{title}</strong>

          <div className="flex gap-1 relative" ref={shareRef}>
            {canAdd && (
              <button onClick={onAdd} className="p-1 border rounded main-color">
                <Plus size={14} />
              </button>
            )}

            <button
              onClick={() => setOpenShare(prev => !prev)}
              className="p-1 border rounded main-color"
            >
              <Share2 size={14} />
            </button>

            {openShare && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white border rounded-md shadow-lg z-30">
                {canPrint && (
                  <MenuItem icon={Printer} onClick={onPrint}>
                    Print
                  </MenuItem>
                )}
                {canExport && (
                  <MenuItem icon={File} onClick={onExport}>
                    Export
                  </MenuItem>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-900 md:bg-white border md:border-gray-200 rounded-lg shadow-sm p-1">
      <div className="flex flex-wrap items-center gap-2">

        {/* ACTIONS */}
        <div className="flex gap-2 flex-wrap">
          {canAdd && (
            <button onClick={onAdd} className="secondary-btn">
              <Plus size={16} /> Add
            </button>
          )}

          {canEdit && (
            <button
              onClick={onEdit}
              disabled={isEditDisabled}
              className={`
                secondary-btn flex items-center gap-1
                transition-all duration-150
                ${isEditDisabled
                  ? "opacity-60 cursor-not-allowed bg-gray-200 text-gray-500 border-gray-300"
                  : "hover:bg-blue-50 hover:text-blue-600"}
              `}
            >
              {isEditDisabled ? <Lock size={16} /> : <Edit2 size={16} />} Edit
            </button>
          )}

          {canDelete && (
            <button
              onClick={onDelete}
              disabled={isDeleteDisabled}
              className="secondary-btn disabled:opacity-50"
            >
              {isDeleteDisabled ? <Lock size={16} /> : <Trash2 size={16} />} Delete
            </button>
          )}

          <button onClick={onRefresh} className="secondary-btn">
            <RefreshCw size={16} /> Refresh
          </button>

          {canView && (
            <button
              onClick={onView}
              //  disabled={!hasSelection}
              className="secondary-btn disabled:opacity-50"
            >
              <Eye size={16} /> View
            </button>
          )}

          {canExport && (
            <button onClick={onExport} className="secondary-btn">
              <File size={16} /> Export
            </button>
          )}

          {canPrint && (
            <button
              onClick={onPrint}
              // disabled={!hasSelection}
              className="secondary-btn disabled:opacity-50"
            >
              <Printer size={16} /> Print
            </button>
          )}

          {canView && onConfirmed && (
            <button
              onClick={onConfirmed}
              //  disabled={!hasSelection}
              disabled={isRowConfirmed}
              className={`
                secondary-btn flex items-center gap-1
                transition-all duration-150
                ${isRowConfirmed
                  ? "opacity-60 cursor-not-allowed bg-gray-200 text-gray-500 border-gray-300"
                  : "hover:bg-blue-50 hover:text-blue-600"}
              `}
            >
              {isRowConfirmed ? <Lock size={16} /> : <CircleCheckBig size={16} />} Confirm
            </button>
          )}

          {canEdit && onApprove && (
            <button
              onClick={onApprove}
              disabled={isRowApproved}
              className={`
                secondary-btn flex items-center gap-1
                transition-all duration-150
                ${isRowApproved
                  ? "opacity-60 cursor-not-allowed bg-gray-200 text-gray-500 border-gray-300"
                  : "hover:bg-blue-50 hover:text-blue-600"}
              `}
            >
              {isRowApproved ? <Lock size={16} /> : <CircleCheckBig size={16} />}  Approve
            </button>
          )}

        </div>

        {/* RIGHT SIDE  */}
        <div className="flex items-center gap-3 ml-auto">

          {periodTitle && (
            <span className="text-sm text-color">{periodTitle}</span>
          )}

          {selectFromDate && (
            <InlineSelectField label={selectFromDate.label || "From"}>
              <input
                type="date"
                name={selectFromDate.name}
                value={selectFromDate.value ?? ""}
                onChange={(e) =>
                  selectFromDate.onChange?.(e.target.value || null)
                }
                disabled={selectFromDate.isDisabled}
                className={`w-full border border-gray-300 bg-white px-2 py-1 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 ${selectFromDate.className || ""
                  }`}
              />
            </InlineSelectField>
          )}

          {selectToDate && (
            <InlineSelectField label={selectToDate.label || "To"}>
              <input
                type="date"
                name={selectToDate.name}
                value={selectToDate.value ?? ""}
                onChange={(e) =>
                  selectToDate.onChange?.(e.target.value || null)
                }
                disabled={selectToDate.isDisabled}
                className={`w-full border border-gray-300 bg-white px-2 py-1 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 ${selectToDate.className || ""}`}
              />
            </InlineSelectField>
          )}

          {selectBranch && (
            <InlineSelectField
              label={selectBranch.label || "Branch"}
            >
              <ToolbarSelect
                value={selectBranch.value}
                options={selectBranch.options}
                placeholder={selectBranch.placeholder || "Select"}
                isDisabled={selectBranch.disabled}
                onChange={(opt) =>
                  selectBranch.onChange?.(opt?.value ?? null)
                }
                className={` w-full text-sm font-medium
                  ${selectBranch.className || ""}
                `}
              />
            </InlineSelectField>
          )}

        </div>

      </div>
    </div>
  );
}