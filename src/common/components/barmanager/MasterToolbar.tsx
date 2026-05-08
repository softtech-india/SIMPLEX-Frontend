'use client'

import useIsMobile from "@/common/hooks/useIsMobile";
import {
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Printer,
  File,
  Share2
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { MenuItem } from "@/common/components/filter/MenuItem";
import { Permissions } from "@/common/types/privilege.types";
import { useKeyboardShortcuts } from "@/common/hooks/useKeyboardShortcuts";
import { SHORTCUTS } from "@/common/constants/shortcuts";

interface MasterToolbarProps {
  title: string;
  permissions: Permissions;

  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onRefresh?: () => void;
  onView?: () => void;
  onPrint?: () => void;
  onExport?: (e?: any) => void;

  hasSelection?: boolean;
}

export function MasterToolbar({
  title,
  permissions,
  onAdd,
  onEdit,
  onDelete,
  onRefresh,
  onView,
  onPrint,
  onExport,
  hasSelection = true,
}: MasterToolbarProps) {

  const isMobile = useIsMobile();
  const { canAdd, canEdit, canDelete, canView, canPrint, canExport } = permissions;

  const [openShare, setOpenShare] = useState(false);
  const shareRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setOpenShare(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // handle Sortcuts 
  useKeyboardShortcuts({
    [SHORTCUTS.ADD]: () => { if (canAdd && onAdd) onAdd(); },
    [SHORTCUTS.EDIT]: () => { if (canEdit && onEdit) onEdit(); },
    [SHORTCUTS.DELETE]: () => { if (canDelete && onDelete) onDelete(); },
    [SHORTCUTS.REFRESH]: () => { onRefresh?.(); },
    [SHORTCUTS.VIEW]: () => { if (canView && onView) onView(); },
    [SHORTCUTS.EXPORT]: () => { if (canExport && onExport) onExport(); },
    [SHORTCUTS.PRINT]: () => { if (canPrint && onPrint) onPrint(); },
  });

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

        {canAdd && (
          <button onClick={onAdd} className="secondary-btn">
            <Plus size={16} /> Add
          </button>
        )}

        {canEdit && (
          <button
            onClick={onEdit}
            disabled={!hasSelection}
            className="secondary-btn disabled:opacity-50"
          >
            <Edit2 size={16} /> Edit
          </button>
        )}

        {canDelete && (
          <button
            onClick={onDelete}
            disabled={!hasSelection}
            className="secondary-btn disabled:opacity-50"
          >
            <Trash2 size={16} /> Delete
          </button>
        )}

        <button onClick={onRefresh} className="secondary-btn">
          <RefreshCw size={16} /> Refresh
        </button>

        {canView && (
          <button
            onClick={onView}
            disabled={!hasSelection}
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
            disabled={!hasSelection}
            className="secondary-btn disabled:opacity-50"
          >
            <Printer size={16} /> Print
          </button>
        )}

      </div>
    </div>
  );
}