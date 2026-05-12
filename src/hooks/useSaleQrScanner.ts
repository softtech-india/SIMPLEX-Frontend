import { DirectSaleItem } from "@/features/sale/direct-sale/types/directSale.types";
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
  watchedItems: DirectSaleItem[];
  productList: ProductMaster[];
  setValue: any;
  onUpdateItems: (items: DirectSaleItem[]) => void;
};

export const useSaleQrScanner = ({
  watchedItems,
  productList,
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

    // validate json format
    if (!rawValue.startsWith("{") || !rawValue.endsWith("}")) {
      toast.error("Invalid Barcode");
      setValue("qrcode", "");
      focusInput();
      return;
    }

    try {
      const match = rawValue.match(/\{.*\}/);

      if (!match) {
        toast.error("Invalid Barcode");
        setValue("qrcode", "");
        focusInput();
        return;
      }

      const parsed = JSON.parse(match[0]);

      const scannedId = parsed?.id;

      if (!scannedId) {
        toast.error("Invalid Barcode");
        setValue("qrcode", "");
        focusInput();
        return;
      }

      /**
       * Find product from master list
       */
      const matchedProduct = productList.find(
        (item) => item.id === scannedId
      );

      if (!matchedProduct) {
        toast.error("Product not found");
        setValue("qrcode", "");
        focusInput();
        return;
      }

      /**
       * Check existing item
       */
      const existingIndex = watchedItems.findIndex(
        (item) => item.productid === matchedProduct.id
      );

      let updatedItems = [...watchedItems];

      /**
       * Product already exists
       * increase qty only
       */
      if (existingIndex > -1) {
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          // qty1: (Number(updatedItems[existingIndex].qty1) || 0) + 1,
          qty1: safeNumber(updatedItems[existingIndex].qty1) + 1,
        };
      } else {
        /**
         * Add new row
         */
        updatedItems.push({
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

      onUpdateItems(updatedItems);

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