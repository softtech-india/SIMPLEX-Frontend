import {
  ChevronDown,
  Download,
  Mail,
  Printer,
  Share2,
  FunnelPlus,
  Plus,
  Filter,
  EllipsisVertical,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { MenuItem } from "../filter/MenuItem";
import useIsMobile from "@/common/hooks/useIsMobile";

interface ReportBarManagerProps {
  reportName: string;
  datePeriod?: string;
  onPrint: () => void;
  onExporting: () => Promise<Blob | null>;
  onColumnChooser?: () => void;
  onEmail: (blob?: Blob) => void;
  moreFilter: () => void;
  dateRangeComponent?: React.ReactNode;
  brandYesNoSelect?: React.ReactNode;
  onRunReport?: () => void;
  onFilterBuilder?: () => void;
  setShowCriteria?: (show: boolean) => void;
  showCriteria?: boolean;
  datePeriodText?: string;
}

interface ShareButtonItemProps {
  Button?: React.ComponentType<any>;
  Icon: React.ComponentType<any>;
  name: string;
  url?: string;
  title?: string;
  onClick: () => void;
  isSupported?: boolean;
  showSupportBadge?: boolean;
}

const ShareButtonItem: React.FC<ShareButtonItemProps> = ({
  Button,
  Icon,
  name,
  url,
  title,
  onClick,
  isSupported = true,
  showSupportBadge = false,
}) => {
  if (Button && url) {
    return (
      <Button
        url={url}
        title={title}
        onClick={onClick}
        className="flex items-center gap-2 w-full text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded"
      >
        <Icon size={18} />
        <span>{name}</span>
      </Button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={!isSupported}
      className={`flex items-center gap-2 w-full text-sm rounded transition-colors ${isSupported
          ? "text-gray-700 hover:bg-gray-100 cursor-pointer"
          : "text-gray-400 cursor-not-allowed"
        }`}
    >
      <Icon size={16} />
      <span>{name}</span>
      {showSupportBadge && !isSupported && (
        <span className="text-xs text-gray-500 ml-auto">(Not supported)</span>
      )}
    </button>
  );
};

const ReportBarManager: React.FC<ReportBarManagerProps> = ({
  reportName,
  datePeriod,
  onPrint,
  onExporting,
  onColumnChooser,
  onEmail,
  moreFilter,
  dateRangeComponent,
  brandYesNoSelect,
  onRunReport,
  onFilterBuilder,
  setShowCriteria,
  showCriteria,
  datePeriodText,
}) => {
  const [openExport, setOpenExport] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [openShare, setOpenShare] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const isMobile = useIsMobile();

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const isWebShareWithFilesSupported = () =>
    typeof navigator !== "undefined" &&
    !!navigator.canShare &&
    !!navigator.share;

  const generatePDFBlob = async (): Promise<Blob | null> => {
    try {
      setIsGeneratingPDF(true);
      setShareError(null);
      const blob = await onExporting();
      if (!blob || blob.size === 0) {
        setShareError("PDF is empty. Cannot proceed.");
        return null;
      }
      setPdfBlob(blob);
      return blob;
    } catch (err: any) {
      console.error(err);
      setShareError(err?.message || "Failed to generate PDF.");
      return null;
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadPDF = async () => {
    const blob = await generatePDFBlob();
    if (!blob) return;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportName.replace(/\s+/g, "_")}_${new Date().getTime()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintFromShare = () => {
    onPrint();
    setOpenShare(false);
  };

  const handleEmailFromShare = async () => {
    const blob = await generatePDFBlob();
    if (!blob) return;
    onEmail(blob);
    setOpenShare(false);
  };

  const handleSharePDF = async () => {
    const blob = await generatePDFBlob();
    if (!blob) return;

    // Web Share with file
    if (isWebShareWithFilesSupported()) {
      const file = new File([blob], `${reportName.replace(/\s+/g, "_")}.pdf`, {
        type: "application/pdf",
      });
      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: reportName,
            text: `Check out this report: ${reportName}`,
          });
          setOpenShare(false);
          return;
        } catch (err) {
          console.error("Web Share failed, fallback:", err);
        }
      }
    }

    // Fallback: WhatsApp share link
    const encodedText = encodeURIComponent(
      `Check out this report: ${reportName} - ${shareUrl}`
    );
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
    setOpenShare(false);
  };

  const dropdowns = [
    { ref: dropdownRef, setter: setOpenExport },
    { ref: shareRef, setter: setOpenShare },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      dropdowns.forEach(({ ref, setter }) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          setter(false);
          setShareError(null);
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Mobile View */}
      {isMobile && (
        <div className="bg-blue-900 border md:border-gray-200 rounded-lg shadow-sm p-1 md:mb-1">
          <div className="flex items-center justify-between w-full ">
            <strong className="md:text-lg font-semibold text-white truncate">
              {reportName}
            </strong>
            <div className="flex gap-1 relative" ref={shareRef}>
              <button
                onClick={moreFilter}
                className="p-1 text-black bg-white border rounded hover:bg-gray-200"
              >
                <FunnelPlus size={14} />
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="p-1 text-black border bg-white rounded hover:bg-gray-200 disabled:opacity-50"
              >
                <Download size={14} />
              </button>
              <button
                onClick={() => setOpenShare((prev) => !prev)}
                className="p-1 text-black border bg-white rounded hover:bg-gray-200"
              >
                <EllipsisVertical size={14} />
              </button>

              {openShare && (
                <div className="absolute right-0 top-full mt-2 w-56 p-1 bg-white border rounded-md shadow-lg z-30 max-h-96 overflow-y-auto">
                  {shareError && (
                    <div className="px-3 py-2 text-xs text-red-600 bg-red-50 rounded mb-2 border border-red-200">
                      {shareError}
                    </div>
                  )}
                  <ShareButtonItem
                    Icon={Share2}
                    name="Share"
                    onClick={handleSharePDF}
                  />
                  {isGeneratingPDF && (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      Generating PDF...
                    </div>
                  )}
                  <ShareButtonItem Icon={Printer} name="Print" onClick={handlePrintFromShare} />
                  <ShareButtonItem Icon={Mail} name="Email" onClick={handleEmailFromShare} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop View */}
      {!isMobile && (
        <div className="my-2">
          <div className="bg-white border rounded-lg shadow-sm p-1 md:mb-1">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex gap-4 items-end">
                <button
                  type="button"
                  onClick={() => setShowCriteria?.(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md border bg-gray-100"
                >
                  <Plus size={20} />
                  <span className="text-sm whitespace-nowrap">More Filters</span>
                </button>

                {dateRangeComponent}
                {brandYesNoSelect}

                <button
                  type="button"
                  onClick={onRunReport}
                  className="primary-btn px-3 py-2 font-semibold rounded-md border"
                >
                  Run Report
                </button>
              </div>

              <div className="ml-auto flex gap-4 items-center">
                {datePeriodText && (
                  <div className="text-sm text-black whitespace-nowrap">
                    <span className="font-medium">Period:</span> {datePeriodText}
                  </div>
                )}

                <button
                  type="button"
                  onClick={onFilterBuilder}
                  className="flex items-center gap-2 px-1 py-1 rounded border bg-gray-100"
                >
                  <Filter size={20} />
                  <span className="text-sm whitespace-nowrap">Filter Builder</span>
                </button>

                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setOpenExport((prev) => !prev)}
                    className="flex items-center gap-2 px-1 py-1 text-black border rounded hover:bg-gray-200"
                  >
                    Export
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${openExport ? "rotate-180" : ""}`}
                    />
                  </button>

                  {openExport && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-20">
                      {shareError && (
                        <div className="px-3 py-2 text-xs text-red-600 bg-red-50 rounded border border-red-200 m-1">
                          {shareError}
                        </div>
                      )}
                      <MenuItem icon={Download} onClick={handleDownloadPDF}>
                        {isGeneratingPDF ? "Generating..." : "Export File"}
                      </MenuItem>
                      <MenuItem icon={Printer} onClick={handlePrintFromShare}>
                        Print
                      </MenuItem>
                      <MenuItem icon={Mail} onClick={handleEmailFromShare}>
                        Email
                      </MenuItem>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportBarManager;