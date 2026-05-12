'use client';

import useIsMobile from "@/common/hooks/useIsMobile";
import {
    RefreshCw,
    File,
    Share2,
    Filter,
    Printer,
    Eye
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { MenuItem } from "@/common/components/filter/MenuItem";
import { Permissions } from "@/common/types/privilege.types";
import InlineSelectField from "@/common/components/InlineSelectField";
import { ToolbarSelect as ToolbarSelectComponent } from "@/common/components/barmanager/ToolbarSelect";

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
    onMoreFilter?: () => void;
    onRefresh?: () => void;
    onExport?: (e?: any) => void;
    onPrint?: () => void;
    hasSelection?: boolean;
    periodTitle?: string;
    selects?: ToolbarSelect;
    disabled?: boolean;
    selectFromDate?: ToolbarDateSelectProps;
    selectToDate?: ToolbarDateSelectProps;
}

export function TransactionToolbar({
    title,
    permissions,
    onMoreFilter,
    onRefresh,
    onExport,
    onPrint,
    hasSelection = true,
    selects,
    disabled,
    selectFromDate,
    selectToDate,
}: TransactionToolbarProps) {
    const isMobile = useIsMobile();
    const { canPrint, canExport } = permissions;

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



    if (isMobile) {
        return (
            <div className="w-full bg-blue-900 border rounded-lg shadow-sm p-1">
                <div className="flex items-center justify-between w-full">
                    <strong className="text-white truncate">{title}</strong>
                    <div className="flex gap-1 relative" ref={shareRef}>
                        {onMoreFilter && (
                            <button onClick={onMoreFilter} className="p-1 border rounded main-color">
                                <Filter size={14} />
                            </button>
                        )}
                        {onRefresh && (
                            <button onClick={onRefresh} className="p-1 border rounded main-color">
                                <RefreshCw size={14} />
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
                                {canPrint && onPrint && (
                                    <MenuItem icon={Printer} onClick={onPrint}>
                                        Print
                                    </MenuItem>
                                )}
                                {canExport && onExport && (
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
                {/* LEFT SIDE - Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                    {onMoreFilter && (
                        <button onClick={onMoreFilter} className="secondary-btn">
                            <Filter size={16} /> Filter
                        </button>
                    )}

                    {canExport && onExport && (
                        <button onClick={onExport} className="secondary-btn">
                            <File size={16} /> Export
                        </button>
                    )}

                    {canPrint && onPrint && (
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
        </div>
    );
}