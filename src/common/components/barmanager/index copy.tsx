import React, { useEffect, useRef, useState, useCallback } from "react";
import { isEmpty } from "lodash";
import useIsMobile from "../../hooks/useIsMobile";
import {
  ChevronDown,
  Download,
  Edit2,
  Eye,
  Filter,
  FunnelPlus,
  Mail,
  Plus,
  Printer,
  RefreshCw,
  Share2,
  Trash2,
} from "lucide-react";
import { MenuItem } from "../../components/filter/MenuItem";
import DatePeriodPicker from "../DatePeriodPicker/DatePeriodPicker copy";
import InlineSelectField from "../InlineSelectField";
import { DateRange } from "@/common/components/DatePeriodPicker/types";

export interface Privilege {
  isadded?: boolean;
  isupdated?: boolean;
  isdeleted?: boolean;
  isprinted?: boolean;
  isexported?: boolean;
  isviewed?: boolean;
  isemailed?: boolean;
  [key: string]: any;
}

interface BarManagerProps {
  reportName: string;
  datePeriod?: string;
  priviledge?: Privilege | null;
  addItem?: () => void;
  editItem?: () => void;
  deleteItem?: () => void;
  refreshList?: () => void;
  onExporting?: (e?: any) => void;
  onColumnChooser?: () => void;
  onPrint?: () => void;
  viewItem?: () => void;
  isTransaction?: boolean;
  moreFilter?: () => void;
  criteria?: DateRange | null;       // ✅ renamed from saleRegCriteria
  onDateChange?: (range: DateRange) => void; // ✅ callback for date picker
}

const BarManager: React.FC<BarManagerProps> = ({
  reportName,
  datePeriod,
  criteria,
  priviledge,
  addItem,
  editItem,
  deleteItem,
  refreshList,
  onPrint,
  viewItem,
  onDateChange,
  moreFilter,
  onExporting,
}) => {
  const isMobile = useIsMobile();
  const [openExport, setOpenExport] = useState(false);
  const exportRef = useRef<HTMLDivElement | null>(null);
  const [openShare, setOpenShare] = useState(false);
  const shareRef = useRef<HTMLDivElement | null>(null);

  const dropdowns = [
    { ref: exportRef, setter: setOpenExport },
    { ref: shareRef, setter: setOpenShare },
  ];

  const [disabled, setDisabled] = useState({
    add: false,
    edit: false,
    delete: false,
    print: false,
    view: false,
    refresh: false,
  });

  useEffect(() => {
    if (!isEmpty(priviledge)) {
      setDisabled({
        add: !priviledge?.isadded,
        edit: !priviledge?.isupdated,
        delete: !priviledge?.isdeleted,
        print: !priviledge?.isprinted,
        view: !priviledge?.isviewed,
        refresh: !priviledge?.isviewed,
      });
    }
  }, [priviledge]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      dropdowns.forEach(({ ref, setter }) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          setter(false);
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateChange = useCallback(
    (range: DateRange) => {
      if (onDateChange) onDateChange(range);
    },
    [onDateChange]
  );

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

      {/* Mobile Layout */}
      {isMobile && (
        <div className="w-full mb-0">
          <div className="flex items-center justify-between w-full">
            <strong className="md:text-lg font-semibold text-white truncate">
              {reportName}
            </strong>
            <div className="flex items-right gap-1 relative" ref={shareRef}>
              {moreFilter && (
                <button
                  onClick={moreFilter}
                  className="p-1 text-black border rounded main-color hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label="More Filters"
                >
                  <FunnelPlus size={14} />
                </button>
              )}
              <button
                onClick={() => { }}
                className="p-1 text-black border rounded main-color hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                aria-label="Download"
              >
                <Download size={14} />
              </button>
              <button
                onClick={() => setOpenShare((prev) => !prev)}
                className="p-1 text-black border rounded main-color hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                aria-label="Share"
              >
                <Share2 size={14} />
              </button>

              {openShare && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white border rounded-md shadow-lg z-30">
                  <MenuItem icon={Printer} onClick={onPrint}>Print</MenuItem>
                  <MenuItem icon={Mail} onClick={() => { }}>Email</MenuItem>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout */}

        <>
          <div className="md:bg-white border md:border-gray-200 rounded-lg shadow-sm p-1 md:mb-1 w-full">
            <div className="flex flex-wrap items-center w-full gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {moreFilter && (
                  <button className="secondary-btn" onClick={moreFilter}>
                    <Plus size={16} /> <span>More Filters</span>
                  </button>
                )}

                {criteria && onDateChange && (
                  <InlineSelectField label="Date Range">
                    <DatePeriodPicker
                      value={{
                        period: criteria.period,
                        fromDate: criteria.fromDate,
                        toDate: criteria.toDate,
                      }}
                      onChange={handleDateChange}
                    />
                  </InlineSelectField>
                )}


                {refreshList && (
                  <button
                    disabled={disabled.refresh}
                    onClick={refreshList}
                    className="secondary-btn disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw size={16} /> Refresh
                  </button>
                )}


                  <button
                    disabled={disabled.add}
                    onClick={addItem}
                    className="secondary-btn disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={16} /> Add
                  </button>



                  <button
                    disabled={disabled.edit}
                    onClick={editItem}
                    className="secondary-btn disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit2 size={16} /> Edit
                  </button>


                  <button
                    disabled={disabled.delete}
                    onClick={deleteItem}
                    className="secondary-btn disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={16} /> Delete
                  </button>



                  <button
                    disabled={disabled.view}
                    onClick={viewItem}
                    className="secondary-btn disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Eye size={16} /> View
                  </button>

              </div>

              <div className="ml-auto flex flex-wrap items-center gap-1">
                {datePeriod && (
                  <div className="text-sm whitespace-nowrap">
                    <span className="font-medium">Period:</span> {datePeriod}
                  </div>
                )}

                {/* {onColumnChooser && (
                <button className="secondary-btn" onClick={onColumnChooser}>
                  <Filter size={16} /> Filter Builder
                </button>
              )} */}

                <div className="relative" ref={exportRef}>
                  <button
                    type="button"
                    onClick={() => setOpenExport((prev) => !prev)}
                    className="secondary-btn"
                    aria-haspopup="menu"
                    aria-expanded={openExport}
                  >
                    Export
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${openExport ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {openExport && (
                    <div className="absolute right-0 mt-2 w-44 rounded-lg shadow-md z-50 bg-white">
                      <MenuItem icon={Download} onClick={onExporting}>Export File</MenuItem>
                      <MenuItem icon={Printer} onClick={onPrint} disabled={!disabled.print}>
                        Print
                      </MenuItem>
                      <MenuItem icon={Mail} onClick={() => { }}>Email</MenuItem>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>

    </div>
  );
};

export default BarManager;
