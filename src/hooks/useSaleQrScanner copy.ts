import { fetchProductByScanId } from "@/api/master/product-api";
import { DirectSaleItem } from "@/features/sale/direct-sale/types/directSale.types";
import useUserStore from "@/store/userStore";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "sonner";

const safeNumber = (val: any) => {
  const n = Number(val);
  return isNaN(n) ? 0 : n;
};

type ProductMaster = {
  id: number;
  productname: string;
  productcategoryid: number;
  categorynm: string;
  unit: string;
};

type Params = {
  // productList: ProductMaster[];
  setValue: any;
  onUpdateItems: (updater: (prev: DirectSaleItem[]) => DirectSaleItem[]) => void;
};

export const useSaleQrScanner = ({
  //productList,
  setValue,
  onUpdateItems,
}: Params) => {


  const {
    userId,
    companyId,
    branchId,
    finid,
  } = useUserStore();
  const scanInputRef = useRef<HTMLInputElement | null>(null);

  const focusInput = () => {
    setTimeout(() => {
      scanInputRef.current?.focus();
    }, 0);
  };

  const handleScan = (value: string) => {
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

      const { data: matchedProduct = [] } = useQuery({
        queryKey: ["fetchProductByScanId", userId, companyId, scannedId],
        queryFn: () => fetchProductByScanId(userId, companyId, scannedId),
        staleTime: 0,
        enabled: !!userId && !!companyId && !!scannedId,
        retry: 1,
        refetchOnWindowFocus: true,
      });

      // const matchedProduct = productList.find(
      //   (item : any) => item.id === scannedId
      // );

      if (!matchedProduct) {
        toast.error("Product not found");
        setValue("qrcode", "");
        focusInput();
        return;
      }

      // SAFE FUNCTIONAL UPDATE (NO STALE STATE)
      onUpdateItems((prev) => {
        const updated = [...prev];

        const existingIndex = updated.findIndex(
          (item) => item.productid === matchedProduct.id
        );

        if (existingIndex > -1) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            qty1: safeNumber(updated[existingIndex].qty1) + 1,
          };
        } else {
          updated.push({
            pcategoryid: matchedProduct.productcategoryid,
            pcategorynm: matchedProduct.categorynm,

            productid: matchedProduct.id,
            productnm: matchedProduct.productname,

            unit: matchedProduct.unit,

            qty1: 1,
            rate: 0,
            clqty: 0,
          });
        }

        return updated;
      });

      setValue("qrcode", "");

      if (scanInputRef.current) {
        scanInputRef.current.value = "";
      }

      focusInput();
    } catch (err) {
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