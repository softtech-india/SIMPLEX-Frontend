import { fetchProductByScanId } from "@/api/master/product-api";
import { RequisitionItem } from "@/features/inventory/requisition/types/requisition.types";
import useUserStore from "@/store/userStore";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "sonner";

const safeNumber = (val: any) => {
  const n = Number(val);
  return isNaN(n) ? 0 : n;
};

type Product = {
  id: number;
  productname: string;
  productcategoryid: number;
  categorynm: string;
  unit: string;
};

type Params = {
  setValue: any;
  onUpdateItems: (
    updater: (prev: RequisitionItem[]) => RequisitionItem[]
  ) => void;
};

export const useRequisitionQrScanner = ({
  setValue,
  onUpdateItems,
}: Params) => {
  const { userId, companyId } = useUserStore();
  const queryClient = useQueryClient();
  const scanInputRef = useRef<HTMLInputElement | null>(null);

  const focusInput = () => {
    setTimeout(() => {
      scanInputRef.current?.focus();
    }, 0);
  };

  const handleScan = async (value: string) => {
    const rawValue = value
      ?.replace(/\u00A0/g, " ")
      ?.replace(/\s+/g, "")
      ?.trim();

    if (!rawValue) {
      focusInput();
      return;
    }

    if (!rawValue.startsWith("{") || !rawValue.endsWith("}")) {
      toast.error("Invalid Barcode");
      setValue("qrcode", "");
      focusInput();
      return;
    }

    try {
      const match = rawValue.match(/\{.*\}/);
      if (!match) throw new Error("Invalid");

      const parsed = JSON.parse(match[0]);
      const scannedId = parsed?.id;

      console.log('Scanned ID:', scannedId);
      if (!scannedId) throw new Error("Invalid");

      // Fetch product
      const response: Product[] | null = await queryClient.fetchQuery({
        queryKey: ["fetchProductByScanId", userId, companyId, scannedId],
        queryFn: () => fetchProductByScanId(userId, companyId, scannedId),
        staleTime: 0,
      });

      const matchedProduct = response?.[0] ?? null;

      if (!matchedProduct) {
        toast.error("Product not found");
        setValue("qrcode", "");
        focusInput();
        return;
      }

      // SAFE FUNCTIONAL UPDATE (NO STALE STATE)
      onUpdateItems((prev: RequisitionItem[]) => {
        const updated: RequisitionItem[] = [...prev];

        const existingIndex = updated.findIndex(
          (item) => item.productid === matchedProduct.id
        );

        if (existingIndex > -1) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            qty: safeNumber(updated[existingIndex].qty) + 1,
          };
        } else {
          const newItem: RequisitionItem = {
            pcategoryid: matchedProduct.productcategoryid,
            pcategorynm: matchedProduct.categorynm,
            productid: matchedProduct.id,
            productnm: matchedProduct.productname,
            qty: 1,
            rate: 0,
          };
          updated.push(newItem);
        }

        return updated;
      });

      setValue("qrcode", "");

      if (scanInputRef.current) {
        scanInputRef.current.value = "";
      }

      focusInput();

    } catch (error) {
      toast.error("Invalid Barcode");
      setValue("qrcode", "");
      focusInput();
    }
  };

  return {
    scanInputRef,
    handleScan,
  };
};