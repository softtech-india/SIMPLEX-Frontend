import { useRef } from "react";
import { toast } from "sonner";

type Item = {
  productid: number;
  qty1: number;
  scanqty?: number;
  shortqty?: number;
  excessqty?: number;
};

type Params = {
  watchedItems: Item[];
  setValue: any; 
  onUpdateItems: (items: Item[]) => void; 
};

export const useQrScanner = ({
  watchedItems,
  setValue,
  onUpdateItems,
}: Params) => {
  const scanInputRef = useRef<HTMLInputElement | null>(null);

  const focusInput = () => {
    setTimeout(() => {
      scanInputRef.current?.focus();
    }, 0);
  };

  const handleScan = (value: string) => {
    let rawValue = value
      ?.replace(/\u00A0/g, " ") 
      ?.replace(/\s+/g, "") 
      ?.trim();

    if (!rawValue) {
      focusInput();
      return;
    }

    // basic structure check
    if (!rawValue.startsWith("{") || !rawValue.endsWith("}")) {
      toast.error("Invalid QR Code");
      setValue("qrcode", "");
      focusInput();
      return;
    }

    try {
      const match = rawValue.match(/\{.*\}/);

      if (!match) {
        toast.error("Invalid QR Code");
        setValue("qrcode", "");
        focusInput();
        return;
      }

      const parsed = JSON.parse(match[0]);
      const scannedId = parsed?.id;

      if (!scannedId) {
        toast.error("Invalid QR Code");
        setValue("qrcode", "");
        focusInput();
        return;
      }

      let matchFound = false;

      const updatedItems = (watchedItems || []).map((item) => {
        if (item.productid === scannedId) {
          matchFound = true;

          const balance = Number(item.qty1) || 0;
          const newScanQty = (Number(item.scanqty) || 0) + 1;

          const newShortQty = Math.max(balance - newScanQty, 0);
          const newExcessQty =
            newScanQty > balance ? newScanQty - balance : 0;

          return {
            ...item,
            scanqty: newScanQty,
            shortqty: newShortQty,
            excessqty: newExcessQty,
          };
        }

        return item;
      });

      if (!matchFound) {
        toast.error("Scanned product not found in items");
        setValue("qrcode", "");
        focusInput();
        return;
      }

      onUpdateItems(updatedItems);

      setValue("qrcode", "");
      focusInput();

    } catch (err) {
      toast.error("Invalid QR Code");
      setValue("qrcode", "");
      focusInput();
    }
  };

  return {
    scanInputRef,
    handleScan,
  };
};