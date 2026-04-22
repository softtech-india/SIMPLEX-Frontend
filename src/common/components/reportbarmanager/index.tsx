import {
  ChevronDown,
  Download,
  Mail,
  Printer,
  Share2,
  FunnelPlus,
  Plus,
  Filter,
  Copy,
  Check,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { MenuItem } from "../filter/MenuItem";
import useIsMobile from "@/common/hooks/useIsMobile";
import { toast } from "sonner";

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
  notRunReport?: boolean;
}

const ReportBarManager: React.FC<ReportBarManagerProps> = ({
  reportName,
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
  notRunReport
}) => {
  const [openExport, setOpenExport] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [openShare, setOpenShare] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";


  const isWebShareSupported = () => {

    if (typeof navigator === "undefined") return false;

    const isSecureContext =
      typeof window !== "undefined" &&
      (window.location.protocol === "https:" ||
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1");

    if (!isSecureContext) return false;

    return (
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function"
    );
  };

  const isWebShareWithFilesSupported = () => {
    if (!isWebShareSupported()) return false;
    try {
      return navigator.canShare?.({ files: [new File([""], "test.pdf")] }) ?? false;
    } catch {
      return false;
    }
  };

  const generatePDFBlob = async (): Promise<Blob | null> => {
    try {
      setIsGeneratingPDF(true);
      setShareError(null);
      const blob = await onExporting();

      if (!blob) {
        setShareError("Failed to generate PDF - No response from server.");
        return null;
      }

      if (blob.size === 0) {
        setShareError("PDF is empty - Server returned empty response. Check API endpoint.");
        return null;
      }

      setPdfBlob(blob);
      return blob;
    } catch (err: any) {
      console.error("PDF Generation Error:", err);
      const errorMsg = err?.message || "Failed to generate PDF.";
      setShareError(errorMsg);
      toast.error(errorMsg);
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

  const handleShareViaEmail = async () => {
    const blob = await generatePDFBlob();
    if (!blob || blob.size === 0) {
      toast.error("Cannot send email: PDF is empty. Please check the API response.");
      return;
    }

    const fileName = `${reportName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
    const file = new File([blob], fileName, { type: "application/pdf" });

    if (isMobile && isWebShareWithFilesSupported()) {
      try {
        await navigator.share({
          files: [file],
          title: reportName,
          text: `Please find the ${reportName} report attached.`,
        });
        setShareSuccess("Email opened with PDF attached!");
        setTimeout(() => setShareSuccess(null), 2000);
        return;
      } catch (err: any) {
        if (err?.name === "AbortError") {
          return;
        }
        console.error("Email share failed:", err);
      }
    }
    onEmail(blob);
    setShareSuccess("Opening email client...");
    setTimeout(() => setShareSuccess(null), 2000);
  };

  const handleSharePDF = async () => {
    const blob = await generatePDFBlob();
    if (!blob || blob.size === 0) {
      toast.error("Cannot share: PDF is empty. Please check the API response.");
      return;
    }

    const fileName = `${reportName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
    const file = new File([blob], fileName, { type: "application/pdf" });

    if (isWebShareWithFilesSupported()) {
      try {
        await navigator.share({
          files: [file],
          title: reportName,
          text: `Here is the ${reportName} report.`,
        });
        setOpenShare(false);
        setShareSuccess("Shared successfully!");
        setTimeout(() => setShareSuccess(null), 2000);
        return;
      } catch (err: any) {
        if (err?.name === "AbortError") {
          setOpenShare(false);
          return;
        }
        console.error("File share failed:", err);
      }
    }

    if (isWebShareSupported() && isMobile) {
      try {
        await navigator.share({
          title: reportName,
          text: `Here is the ${reportName} report. Download it here:`,
          url: shareUrl,
        });
        setOpenShare(false);
        setShareSuccess("Shared successfully!");
        setTimeout(() => setShareSuccess(null), 2000);
        return;
      } catch (err: any) {
        if (err?.name === "AbortError") {
          setOpenShare(false);
          return;
        }
        console.error("URL share failed:", err);
      }
    }

    if (!isMobile) {
      const protocol = typeof window !== "undefined" ? window.location.protocol : "";
      const isHttps = protocol === "https:";
      const hostname = typeof window !== "undefined" ? window.location.hostname : "";
      const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

      let errorMsg = "Web Share not supported on desktop. Use Download, Email, or Copy Link instead.";
      if (!isHttps && !isLocalhost) {
        errorMsg = "⚠️ Web Share requires HTTPS. Please use: Download, Email, or Copy Link.";
      }

      toast.error(errorMsg);
      return;
    }

    const encodedText = encodeURIComponent(
      `Here is the ${reportName} report: ${shareUrl}`
    );
    window.open(`https://wa.me/?text=${encodedText}`, "_blank");
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
          setShareSuccess(null);
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
        <div className="bg-color border md:border-gray-200 rounded-lg shadow-sm p-1 md:mb-1">
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
                className="p-1 text-black border bg-white rounded hover:bg-gray-200"
              >
                <Download size={14} />
              </button>
              <button
                onClick={handleSharePDF}
                disabled={isGeneratingPDF}
                className="p-1 text-black bg-white border rounded hover:bg-gray-200 disabled:opacity-50"
              >
                <Share2 size={14} />
              </button>
              {/* <button
                onClick={handlePrintFromShare}
                className="p-1 text-black bg-white border rounded hover:bg-gray-200"
              >
                <Printer size={14} />
              </button>
              <button
                onClick={handleShareViaEmail}
                className="p-1 text-black bg-white border rounded hover:bg-gray-200"
              >
                <Mail size={14} />
              </button> */}
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

                {onRunReport ? (
                  <button
                    type="button"
                    onClick={onRunReport}
                    className="primary-btn px-3 py-2 font-semibold rounded-md border"
                  >
                    Run Report
                  </button>
                ):(
                  <></>
                )}

              </div>

              <div className="ml-auto flex gap-4 items-center">
                {datePeriodText && (
                  <div className="text-sm text-black whitespace-nowrap">
                    <span className="font-medium">{notRunReport === false ? 'Till Date' : 'Period'} :</span> {datePeriodText}
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
                      {shareSuccess && (
                        <div className="px-3 py-2 text-xs text-green-600 bg-green-50 rounded border border-green-200 m-1 flex items-center gap-1">
                          <Check size={14} />
                          {shareSuccess}
                        </div>
                      )}
                      <MenuItem icon={Download} onClick={handleDownloadPDF}>
                        {isGeneratingPDF ? "Generating..." : "Export File"}
                      </MenuItem>
                      <MenuItem icon={Printer} onClick={handlePrintFromShare}>
                        Print
                      </MenuItem>
                      <MenuItem icon={Mail} onClick={handleShareViaEmail}>
                        Email
                      </MenuItem>
                      <MenuItem icon={Share2} onClick={handleSharePDF}>
                        Share
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