'use client';

import { useEffect, useRef, useState } from "react";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";
import { useQuery } from "@tanstack/react-query";
import { useDirectSaleById, useCreateDirectSale, useUpdateDirectSale, useDeleteDirectSale, useApproveDirectSale } from "../hooks/useDirectSale";
import { DirectSaleFormType, OperationMode } from "../types/directSale.types";
import { DirectSaleFormSchema } from "../schemas/directSale.schema";
import { defaultItemDtl, directSaleFormDefaults } from "../constants/directSaleFormDefaults";
import { useDirectSaleForm } from "../hooks/useDirectSaleForm";
import { useFieldArray } from "react-hook-form";
import { fetchSeriesList } from "@/api/purchase/purchase-api";
import useUserStore from "@/store/userStore";
import { FormSelect } from "@/common/components/FormSelect";
import { DirectSaleItems } from "./DirectSaleItems";
import { useWatch } from "react-hook-form";
import { formatDate, formatDateForInput } from "@/helpers/dateUtils";
import SearchModal from "@/common/components/SearchModal";
import { toast } from "sonner";
import { useConfirm } from "@/common/hooks/useConfirm";
import { useKeyboardShortcuts } from "@/common/hooks/useKeyboardShortcuts";
import { SHORTCUTS } from "@/common/constants/shortcuts";
import { apiCall } from "@/utils/apiClient";
import { useSaleQrScanner } from "@/hooks/useSaleQrScanner";
import { fetchProductList } from "@/api/master/product-api";
import { usePathname } from "next/navigation";
import { OrderbasedSaleItems } from "./OrderbasedSaleItems";

interface DirectSaleFormProps {
  visible: boolean;
  onClose: () => void;
  formDirectSaleId: number;
  mode: OperationMode;
  formSelectedBranch: string;
  toolbarBranchId: number;

  onUpdated?: () => void;
}

export function DirectSaleForm({ visible, onClose, formDirectSaleId, mode, formSelectedBranch, toolbarBranchId, onUpdated }: DirectSaleFormProps) {

  const {
    userId,
    companyId,
    branchId,
    finid,
  } = useUserStore();

  const confirmDelete = useConfirm();
  const pathname = usePathname();
  const isOrderBasedSale = pathname?.includes("saleagnstorder");

  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [billTypeModalOpen, setBillTypeModalOpen] = useState(false);
  const [salemanModalOpen, setSalemanModalOpen] = useState(false);
  const [godownModalOpen, setGodownModalOpen] = useState(false);
  const [saleLedgerModalOpen, setSaleLedgerModalOpen] = useState(false);
  const [transporterModalOpen, setTransporterModalOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Order Based Sale
  const [soPendingModalOpen, setSoPendingModalOpen] = useState(false);

  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isApproveMode = mode === "Approve";
  const isReadOnly = mode === "View" || mode === "Print";

  // handle Sortcuts 
  useKeyboardShortcuts(
    {
      [SHORTCUTS.SAVE]: () => { formRef.current?.requestSubmit(); },
      [SHORTCUTS.EXIT]: () => { onClose(); },
    },
    visible
  );

  const { data: DirectSale, isLoading: isLoadingDirectSale } =
    useDirectSaleById({
      id: formDirectSaleId,
      userid: Number(userId),
      compid: Number(companyId),
      branchid: toolbarBranchId,
      finid: Number(finid),
    });

  const createMutation = useCreateDirectSale();
  const updateMutation = useUpdateDirectSale();
  const deleteMutation = useDeleteDirectSale();
  const approveMutation = useApproveDirectSale();

  const isSubmitting = createMutation.isPending || approveMutation.isPending || updateMutation.isPending || deleteMutation.isPending;


  const { data: productList = [] } = useQuery({
    queryKey: ["fetchProductList", userId, companyId, toolbarBranchId],
    queryFn: () => fetchProductList(userId, companyId, toolbarBranchId,),
    staleTime: 0,
    enabled: !!userId && !!companyId && !!toolbarBranchId && !!visible,
    retry: 1,
    refetchOnWindowFocus: true,
  });

  // useEffect(() => { fetchProductStock
  //   console.log('productList :', productList);
  // }, [productList])

  const { control, register, handleSubmit, setFocus, reset, watch, setValue, getValues, trigger, formState: { errors }, } = useDirectSaleForm(isApproveMode);

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "itemdtl",
  });

  // Calculate Total Quantity and Vlaue
  const watchedItems = useWatch({
    control,
    name: "itemdtl",
  }) || [];

  useEffect(() => {
    console.log('watchedItems :', watchedItems);
  }, [watchedItems])

  const totalQty = (watchedItems || []).reduce((sum, item) => {
    return sum + (Number(item?.qty1) || 0);
  }, 0) || 0;

  const totalValue = (watchedItems || []).reduce((sum, item) => {
    const qty = Number(item?.qty1) || 0;
    const rate = Number(item?.rate) || 0;

    return sum + qty * rate;
  }, 0) || 0;

  const { scanInputRef, handleScan } = useSaleQrScanner({
    productList,
    setValue,
    // onUpdateItems: (updater) => {
    //   replace(updater(watchedItems));
    // }
    onUpdateItems: (updater) => {
      replace(updater(getValues("itemdtl") || []));
      trigger("itemdtl");
    }

  });

  // 
  const billdt = watch("billdt");

  // Reset form 
  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("billdt");
    }, 100);

    // if (DirectSale) {
    //   reset({
    //     ...directSaleFormDefaults,

    //     ...DirectSale,

    //     billdt: DirectSale.billdt ? formatDateForInput(DirectSale.billdt) : "",

    //     compid: Number(DirectSale.compid ?? 0),
    //     branchid: Number(DirectSale.branchid ?? 0),
    //     finid: Number(DirectSale.finid ?? 0),

    //     vnumid: Number(DirectSale.vnumid ?? 0),

    //     billtypeid: Number(DirectSale.billtypeid ?? 0),
    //     customerid: Number(DirectSale.customerid ?? 0),
    //     saledgerid: Number(DirectSale.saledgerid ?? 0),
    //     godownid: Number(DirectSale.godownid ?? 0),
    //     smid: Number(DirectSale.smid ?? 0),
    //     transporterid: Number(DirectSale.transporterid || 0),

    //     crdays: Number(DirectSale.crdays ?? 0),

    //     qty1: Number(DirectSale.qty1 ?? 0),
    //     qtyrateval: Number(DirectSale.qtyrateval ?? 0),

    //     discval: Number(DirectSale.discval ?? 0),
    //     netval: Number(DirectSale.netval ?? 0),
    //     beftaxval: Number(DirectSale.beftaxval ?? 0),
    //     taxableval: Number(DirectSale.taxableval ?? 0),
    //     taxval: Number(DirectSale.taxval ?? 0),
    //     amtwithtaxval: Number(DirectSale.amtwithtaxval ?? 0),
    //     afttaxval: Number(DirectSale.afttaxval ?? 0),
    //     billamt: Number(DirectSale.billamt ?? 0),

    //     sgstval: Number(DirectSale.sgstval ?? 0),
    //     cgstval: Number(DirectSale.cgstval ?? 0),
    //     igstval: Number(DirectSale.igstval ?? 0),

    //     itemdtl:
    //       DirectSale.itemdtl?.map((item, index) => ({
    //         tag: item.tag ?? "I",

    //         sl: Number(item.sl ?? index + 1),
    //         dtlid: Number(item.dtlid ?? index + 1),

    //         pcategoryid: Number(item.pcategoryid ?? 0),
    //         pcategorynm: item.pcategorynm ?? "",

    //         productid: Number(item.productid ?? 0),
    //         productnm: item.productnm ?? "",

    //         qty1: Number(item.qty1 ?? 0),
    //         rate: Number(item.rate ?? 0),
    //         value: Number(item.value ?? 0),

    //         discpct: Number(item.discpct ?? 0),
    //         discamt: Number(item.discamt ?? 0),

    //         netval: Number(item.netval ?? 0),

    //         taxablerate: Number(item.taxablerate ?? 0),
    //         taxableval: Number(item.taxableval ?? 0),

    //         taxid: Number(item.taxid ?? 0),
    //         taxval: Number(item.taxval ?? 0),

    //         finalval: Number(item.finalval ?? 0),
    //         stockval: Number(item.stockval ?? 0),

    //         cgstpct: Number(item.cgstpct ?? 0),
    //         cgstval: Number(item.cgstval ?? 0),
    //         cgstledgerid: Number(item.cgstledgerid ?? 0),

    //         sgstpct: Number(item.sgstpct ?? 0),
    //         sgstval: Number(item.sgstval ?? 0),
    //         sgstledgerid: Number(item.sgstledgerid ?? 0),

    //         igstpct: Number(item.igstpct ?? 0),
    //         igstval: Number(item.igstval ?? 0),
    //         igstledgerid: Number(item.igstledgerid ?? 0),

    //         hsnid: Number(item.hsnid ?? 0),
    //         hsnno: item.hsnno ?? "",
    //         orderdtlid: item.orderdtlid || 0,

    //         mrp: Number(item.mrp ?? 0),
    //         clqty: Number(item.clqty ?? 0),
    //         balanceqty1: Number(item.balanceqty1 ?? 0),
    //         unit: item.unit ?? '',

    //       })) ?? [],
    //   });
    // }

    if (DirectSale) {
      const mappedItems =
        DirectSale.itemdtl?.map((item, index) => ({
          tag: item.tag ?? "I",
          sl: Number(item.sl ?? index + 1),
          dtlid: Number(item.dtlid ?? index + 1),

          pcategoryid: Number(item.pcategoryid ?? 0),
          pcategorynm: item.pcategorynm ?? "",

          productid: Number(item.productid ?? 0),
          productnm: item.productnm ?? "",

          qty1: Number(item.qty1 ?? 0),
          rate: Number(item.rate ?? 0),
          value: Number(item.value ?? 0),

          discpct: Number(item.discpct ?? 0),
          discamt: Number(item.discamt ?? 0),

          netval: Number(item.netval ?? 0),

          taxablerate: Number(item.taxablerate ?? 0),
          taxableval: Number(item.taxableval ?? 0),

          taxid: Number(item.taxid ?? 0),
          taxval: Number(item.taxval ?? 0),

          finalval: Number(item.finalval ?? 0),
          stockval: Number(item.stockval ?? 0),

          cgstpct: Number(item.cgstpct ?? 0),
          cgstval: Number(item.cgstval ?? 0),

          sgstpct: Number(item.sgstpct ?? 0),
          sgstval: Number(item.sgstval ?? 0),

          igstpct: Number(item.igstpct ?? 0),
          igstval: Number(item.igstval ?? 0),

          hsnid: Number(item.hsnid ?? 0),
          hsnno: item.hsnno ?? "",
          orderdtlid: item.orderdtlid || 0,

          mrp: Number(item.mrp ?? 0),
          clqty: Number(item.clqty ?? 0),
          balanceqty1: Number(item.balanceqty1 ?? 0),
          unit: item.unit ?? "",
        })) ?? [];

      reset({
        ...directSaleFormDefaults,
        ...DirectSale,

        billdt: DirectSale.billdt
          ? formatDateForInput(DirectSale.billdt)
          : "",

        compid: Number(DirectSale.compid ?? 0),
        branchid: Number(DirectSale.branchid ?? 0),
        finid: Number(DirectSale.finid ?? 0),

        vnumid: Number(DirectSale.vnumid ?? 0),
        billtypeid: Number(DirectSale.billtypeid ?? 0),
        customerid: Number(DirectSale.customerid ?? 0),
        saledgerid: Number(DirectSale.saledgerid ?? 0),
        godownid: Number(DirectSale.godownid ?? 0),
        smid: Number(DirectSale.smid ?? 0),
        transporterid: Number(DirectSale.transporterid || 0),

        crdays: Number(DirectSale.crdays ?? 0),

        qty1: Number(DirectSale.qty1 ?? 0),
        qtyrateval: Number(DirectSale.qtyrateval ?? 0),

        discval: Number(DirectSale.discval ?? 0),
        netval: Number(DirectSale.netval ?? 0),
        beftaxval: Number(DirectSale.beftaxval ?? 0),
        taxableval: Number(DirectSale.taxableval ?? 0),
        taxval: Number(DirectSale.taxval ?? 0),
        amtwithtaxval: Number(DirectSale.amtwithtaxval ?? 0),
        afttaxval: Number(DirectSale.afttaxval ?? 0),
        billamt: Number(DirectSale.billamt ?? 0),

        sgstval: Number(DirectSale.sgstval ?? 0),
        cgstval: Number(DirectSale.cgstval ?? 0),
        igstval: Number(DirectSale.igstval ?? 0),

        itemdtl: mappedItems,
      });

      // IMPORTANT FIX
      replace(mappedItems);
    }

  }, [DirectSale, isAddMode, reset, visible, setFocus]);

  const numMethodOptions = [
    { label: "Auto", value: "A" },
    { label: "Manual", value: "M" }
  ];

  // Series No Options
  const voucherType = "SA";
  const { data: seriesNoOptions = [] } = useQuery({
    queryKey: ["fetchSeriesList", userId, companyId, toolbarBranchId, voucherType],
    queryFn: () => fetchSeriesList(userId, companyId, toolbarBranchId, voucherType, finid),
    staleTime: 0,
    enabled: !!companyId && !!toolbarBranchId && !!userId && !!visible,
    retry: 1,
    refetchOnWindowFocus: true,

    select: (data) => {
      const options =
        (data ?? []).map((s: any) => ({
          value: s.id,
          label: s.name,
          manualallow: s.manualallow,
        })) || [];

      // auto-set first option safely
      setTimeout(() => {
        if (options.length > 0) {
          setValue("vnumid", options[0].value);
        }
      }, 0);

      return options;
    },
  });

  const selectedSeries = seriesNoOptions.find(
    (s: any) => s.value === watch("vnumid")
  );

  // Model Search Customer Modal Handlers
  const baseCustomerParams = {
    userid: userId,
    compid: companyId,
  };

  const searchCustomerColumns = [
    { key: "name", label: "name." },
  ];

  const searchCustomerFields = [
    { value: "name", label: "Name" },
  ];

  const handleCustomerSelect = (row: any) => {
    setValue("customerid", row.id);
    setValue("customernm", row.name);
    setCustomerModalOpen(false);
  };

  const customerName = watch("customernm")

  // Model Search Bill Type Modal Handlers
  const BillTypeName = watch("billtypenm");
  const billTypeId = watch("billtypeid");

  const baseBillTypeParams = {
    userid: userId,
    compid: companyId,
    billtype: "SA"
  };

  const searchBillTypeColumns = [
    { key: "name", label: "name." },
  ];

  const searchBillTypeFields = [
    { value: "name", label: "Name" },
  ];

  const handleBillTypeSelect = (row: any) => {
    setValue("billtypeid", row.id);
    setValue("billtypenm", row.name);
    setBillTypeModalOpen(false);
  };

  useEffect(() => {
    if (!visible || billTypeId) return;

    const fetchDefaultBillType = async () => {
      try {
        const response: any = await apiCall.get(
          process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + "billtype",
          baseBillTypeParams
        );

        const defaultBillType = response?.data?.find(
          (item: any) => item.isdefault === "Y"
        );

        if (defaultBillType) {
          setValue("billtypeid", defaultBillType.id);
          setValue("billtypenm", defaultBillType.name);
          setValue("saledgerid", defaultBillType.accountheadid);
          setValue("saledgernm", defaultBillType.accountheadnm);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchDefaultBillType();
  }, [visible, billTypeId, userId, companyId, setValue]);

  // Model Search Saleman Modal Handlers
  const baseSalemanParams = {
    userid: userId,
    compid: companyId,
    branchid: toolbarBranchId
  };

  const searchSalemanColumns = [
    { key: "name", label: "name." },
  ];

  const searchSalemanFields = [
    { value: "name", label: "Name" },
  ];

  const handleSalemanSelect = (row: any) => {
    setValue("smid", row.id);
    setValue("smnm", row.name);
    setSalemanModalOpen(false);
  };

  const SalemanName = watch("smnm")

  // Model Search Godown Modal Handlers
  const baseGodownParams = {
    userid: userId,
    compid: companyId,
    branchid: toolbarBranchId
  };

  const searchGodownColumns = [
    { key: "name", label: "name." },
  ];

  const searchGodownFields = [
    { value: "name", label: "Name" },
  ];

  const handleGodownSelect = (row: any) => {
    setValue("godownid", row.id);
    setValue("godownnm", row.name);
    setGodownModalOpen(false);
  };

  const GodownName = watch("godownnm")

  // Model Search SaleLedger Modal Handlers
  const baseSaleLedgerParams = {
    userid: userId,
    compid: companyId,
    grouptype: "S"
  };

  const searchSaleLedgerColumns = [
    { key: "ledgername", label: "name." },
  ];

  const searchSaleLedgerFields = [
    { value: "ledgername", label: "Ledger Name" },
  ];

  const handleSaleLedgerSelect = (row: any) => {
    setValue("saledgerid", row.id);
    setValue("saledgernm", row.ledgername);
    setSaleLedgerModalOpen(false);
  };

  const SaleLedgerName = watch("saledgernm")

  // Model Search Transporter Modal Handlers
  const baseTransporterParams = {
    userid: userId,
    compid: companyId,
  };

  const searchTransporterColumns = [
    { key: "name", label: "name." },
  ];

  const searchTransporterFields = [
    { value: "name", label: "Ledger Name" },
  ];

  const handleTransporterSelect = (row: any) => {
    setValue("transporterid", row.id);
    setValue("transporternm", row.name);
    setTransporterModalOpen(false);
  };

  const transporterName = watch("transporternm")

  // Model Search SoPending Modal Handlers
  const orderid = watch("orderid");
  const orderno = watch("orderno");
  const orderdt = watch("orderdt");
  const customerId = watch("customerid");

  const baseSoPendingParams = {
    userid: userId,
    compid: companyId,
    branchid: toolbarBranchId,
    finid: finid,
    customerid: customerId,
  };

  const searchSoPendingColumns = [
    { key: "orderno", label: "Order No." },
    { key: "orderdt", label: "Order Date." },
  ];

  const searchSoPendingFields = [
    { value: "name", label: "Name" },
  ];

  const handleSoPendingSelect = (row: any) => {
    setValue("orderid", row.id);
    setValue(`orderno`, row.orderno);
    setValue(`orderdt`, row.orderdt);
    setSoPendingModalOpen(false);
  };

  const calculateTotals = (items: any[] = []) => {
    let qty1 = 0;
    let qtyrateval = 0;
    let discval = 0;
    let netval = 0;
    let taxableval = 0;
    let taxval = 0;
    let cgstval = 0;
    let sgstval = 0;
    let igstval = 0;

    let billamt = 0;

    const itemdtl = items.map((item, index) => {
      const qty = Number(item?.qty1 ?? 0);
      const rate = Number(item?.rate ?? 0);
      const value = qty * rate;

      const discpct = Number(item?.discpct ?? 0);
      const discamt = Number(item?.discamt ?? 0) || (value * discpct) / 100;

      const itemNetVal = value - discamt;

      const taxablerate = Number(item?.taxablerate ?? rate);
      const itemTaxableVal = Number(item?.taxableval ?? 0) || itemNetVal;

      const cgstpct = Number(item?.cgstpct ?? 0);
      const sgstpct = Number(item?.sgstpct ?? 0);
      const igstpct = Number(item?.igstpct ?? 0);

      const itemCgstVal = Number(item?.cgstval ?? 0) || (itemTaxableVal * cgstpct) / 100;
      const itemSgstVal = Number(item?.sgstval ?? 0) || (itemTaxableVal * sgstpct) / 100;
      const itemIgstVal = Number(item?.igstval ?? 0) || (itemTaxableVal * igstpct) / 100;
      const itemTaxVal = itemCgstVal + itemSgstVal + itemIgstVal;
      const finalval = itemTaxableVal + itemTaxVal;

      qty1 += qty;
      qtyrateval += value;
      discval += discamt;
      netval += itemNetVal;
      taxableval += itemTaxableVal;
      taxval += itemTaxVal;
      cgstval += itemCgstVal;
      sgstval += itemSgstVal;
      igstval += itemIgstVal;

      billamt += finalval;

      return {
        tag: item?.tag || "I",
        sl: Number(item?.sl ?? index + 1),
        dtlid: Number(item?.dtlid ?? index + 1),
        pcategoryid: Number(item?.pcategoryid ?? 0),
        pcategorynm: item?.pcategorynm ?? "",
        productid: Number(item?.productid ?? 0),
        productnm: item?.productnm ?? "",
        qty1: qty,
        rate: rate ?? 0,
        value: value,
        discpct: discpct,
        discamt: discamt,
        netval: itemNetVal,
        taxablerate: taxablerate,
        taxableval: itemTaxableVal,

        taxid: Number(item?.taxid ?? 0),
        taxval: itemTaxVal,
        finalval: finalval,
        stockval: Number(item?.stockval ?? 0),

        cgstpct: cgstpct,
        cgstval: itemCgstVal,
        cgstledgerid: Number(item?.cgstledgerid ?? 0),
        sgstpct: sgstpct,
        sgstval: itemSgstVal,
        sgstledgerid: Number(item?.sgstledgerid ?? 0),
        igstpct: igstpct,
        igstval: itemIgstVal,
        igstledgerid: Number(item?.igstledgerid ?? 0),
        hsnid: Number(item?.hsnid ?? 0),
        hsnno: item?.hsnno ?? "",
        mrp: Number(item?.mrp ?? 0),
        orderdtlid: item?.orderdtlid || 0,
        clqty: item?.clqty || 0,
      };
    });

    return {
      qty1, qtyrateval, discval, netval, beftaxval: netval, taxableval, taxval,
      amtwithtaxval: billamt, afttaxval: billamt, billamt, cgstval, sgstval, igstval,
      itemdtl,
    };
  };

  const cashcrTypeOptions = [
    { value: "C", label: "Cash" },
    { value: "R", label: "Credit" },
  ];

  const handleFormSubmit = async (data: DirectSaleFormSchema) => {
    try {

      const isValid = await trigger();
      if (!isValid) return;

      if (isDeleteMode) {
        const ok = await confirmDelete({
          title: "Delete Sale",
          message: "Are you sure you want to delete this Sale?",
        });

        if (!ok) return;

        await deleteMutation.mutateAsync({
          id: formDirectSaleId,
          userid: Number(userId),
          compid: Number(companyId),
        });
        onClose();
        return;
      }

      const {
        qty1, qtyrateval, discval, netval, beftaxval, taxableval, taxval, amtwithtaxval,
        afttaxval, billamt, cgstval, sgstval, igstval, itemdtl
      } = calculateTotals(data.itemdtl || []);

      const payload: DirectSaleFormType = {
        ...data,

        compid: companyId,
        branchid: toolbarBranchId,
        finid: Number(finid),

        qty1: Number(qty1),
        qtyrateval: Number(qtyrateval),
        discval: Number(discval),
        netval: Number(netval),
        beftaxval: Number(beftaxval),
        taxableval: Number(taxableval),
        taxval: Number(taxval),
        amtwithtaxval: Number(amtwithtaxval),
        afttaxval: Number(afttaxval),
        billamt: Number(billamt),
        cgstval: Number(cgstval),
        sgstval: Number(sgstval),
        igstval: Number(igstval),

        itemdtl,
      };

      // console.log("FINAL SUBMIT PAYLOAD:", JSON.stringify(payload, null, 2));

      if (isAddMode) {
        await createMutation.mutateAsync(payload);
        console.log('save called')
        reset({
          ...directSaleFormDefaults,
          itemdtl: [],
        });

        // IMPORTANT: next tick sync
        requestAnimationFrame(() => {
          replace([]);
        });
        // onClose();
        return;
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: formDirectSaleId,
          data: payload,
        });

        onUpdated?.();

        onClose();
      }

    } catch (error) {
      console.error("Submit error:", error);
    }
  };


  const selectedProductIds = watchedItems
    ?.map((item: any) => item?.productid)
    ?.filter(Boolean);

  const getButtonLabel = () => {
    if (isSubmitting) {
      if (isDeleteMode) return "Deleting...";
      if (isApproveMode) return "Approving...";
      return "Saving...";
    }

    if (isDeleteMode) return "Delete";
    if (isApproveMode) return "Approve";
    return "Save";
  };

  // Debug validation issues 
  const onError = (err: any) => {
    console.error("Validation errors:", err);
  };

  const ModelFormName = `${mode} ${isOrderBasedSale ? "Order Based Sale" : "Direct Sale"}`;

  return (
    <Popup
      visible={visible}
      onHiding={onClose}
      title={ModelFormName}
      width="90vw"
      height="90vh"
      dragEnabled
      showTitle
      showCloseButton={false}
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit(handleFormSubmit, onError)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 overflow-y-auto p-2 space-y-2">

          <section className="border rounded-md p-3 shadow-sm bg-white space-y-3">

            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50"> Sale Information </h2>

            <div className="flex flex-wrap gap-4 items-end">

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Series No.</label>
                <FormSelect
                  name="vnumid"
                  control={control}
                  options={seriesNoOptions}
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Num. Method</label>
                <FormSelect
                  name="vnummethod"
                  control={control}
                  options={numMethodOptions}
                  isDisabled={selectedSeries?.manualallow === "N"}
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Bill Date</label>
                <input
                  type="date"
                  {...register("billdt")}
                  disabled={isReadOnly}
                  className={`inputField ${errors.billdt ? "text-red-500" : "border-gray-400"}`}
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Bill No</label>
                <input
                  type="text"
                  {...register("billno")}
                  disabled={isReadOnly || selectedSeries?.manualallow === "N"}
                  className={`
                    inputField 
                    ${errors.billno ? "" : "border-gray-400"} 
                    ${selectedSeries?.manualallow === "N" ? "bg-gray-100 cursor-not-allowed" : ""}
                  `}
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Bill Type <strong className="text-red-500"> * </strong></label>
                <input
                  type="text"
                  value={BillTypeName || ''}
                  disabled={isReadOnly}
                  readOnly
                  onClick={() => setBillTypeModalOpen(true)}
                  className={`inputField w-full border border-gray-300 
                    ${errors.billtypeid && !BillTypeName ? "border-red-500" : "border-gray-400"}
                    ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`
                  }
                  placeholder="Select bill type"
                />
                {errors.billtypeid && !BillTypeName && <p className="text-red-500 mt-1 text-sm">{errors.billtypeid.message}</p>}
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Cash or Credit</label>
                <FormSelect
                  name="cashcrtype"
                  control={control}
                  options={cashcrTypeOptions}
                />
              </div>

              <div className="w-100">
                <label className="block text-gray-700 font-medium mb-1"> Customer <strong className="text-red-500"> * </strong> </label>
                <input
                  type="text"
                  value={customerName || ''}
                  disabled={isReadOnly}
                  readOnly
                  onClick={() => setCustomerModalOpen(true)}
                  className={`inputField w-full border border-gray-300 
                    ${errors.customerid && !customerName ? "border-red-500" : "border-gray-400"}
                    ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`
                  }
                  placeholder="Select Customer"
                />
                {errors.customerid && !customerName && <p className="text-red-500 mt-1 text-sm">{errors.customerid.message}</p>}
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Credit days</label>
                <input
                  type="number"
                  {...register("crdays", { valueAsNumber: true })}
                  disabled={isReadOnly}
                  className={`inputField ${errors.crdays ? "" : "border-gray-400"}`}
                />
              </div>

              {isOrderBasedSale && (
                <>
                  <div className="w-68">
                    <label className="block text-gray-700 font-medium mb-1">So No. & Date <span className="text-red-500"> * </span> </label>
                    <input
                      type="text"
                      value={orderno ? `${orderno} - ${formatDate(orderdt)}` : ""}
                      disabled={isReadOnly}
                      readOnly
                      onClick={() => setSoPendingModalOpen(true)}
                      className={`inputField w-full border border-gray-300 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`}
                      placeholder="Select SO No. & Date"
                    />
                  </div>
                </>
              )}

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Sale Ledger <strong className="text-red-500"> * </strong> </label>
                <input
                  type="text"
                  value={SaleLedgerName || ''}
                  disabled={isReadOnly}
                  readOnly
                  onClick={() => setSaleLedgerModalOpen(true)}
                  className={`inputField w-full border border-gray-300 
                    ${errors.saledgerid && !SaleLedgerName ? "border-red-500" : "border-gray-400"}
                    ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`
                  }
                  placeholder="Select sale ledger"
                />
                {errors.saledgerid && !SaleLedgerName && <p className="text-red-500 mt-1 text-sm">{errors.saledgerid.message}</p>}
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Saleman <strong className="text-red-500"> * </strong> </label>
                <input
                  type="text"
                  value={SalemanName || ''}
                  disabled={isReadOnly}
                  readOnly
                  onClick={() => setSalemanModalOpen(true)}
                  className={`inputField w-full border border-gray-300 
                    ${errors.smid && !SalemanName ? "border-red-500" : "border-gray-400"}
                    ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`
                  }
                  placeholder="Select saleman"
                />
                {errors.smid && !SalemanName && <p className="text-red-500 mt-1 text-sm">{errors.smid.message}</p>}
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Godown <strong className="text-red-500"> * </strong></label>
                <input
                  type="text"
                  value={GodownName || ''}
                  disabled={isReadOnly}
                  readOnly
                  onClick={() => setGodownModalOpen(true)}
                  className={`inputField w-full border border-gray-300 
                    ${errors.godownid && !GodownName ? "border-red-500" : "border-gray-400"}
                    ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`
                  }
                  placeholder="Select godown"
                />
                {errors.godownid && !GodownName && <p className="text-red-500 mt-1 text-sm">{errors.godownid.message}</p>}
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Transporter <strong className="text-red-500"> * </strong></label>
                <input
                  type="text"
                  value={transporterName || ''}
                  disabled={isReadOnly}
                  readOnly
                  onClick={() => setTransporterModalOpen(true)}
                  className={`inputField w-full border border-gray-300 
                    ${errors.transporterid && !transporterName ? "border-red-500" : "border-gray-400"}
                    ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}`
                  }
                  placeholder="Select transporter "
                />
                {errors.transporterid && !transporterName && <p className="text-red-500 mt-1 text-sm">{errors.transporterid.message}</p>}
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Time</label>
                <input
                  type="time"
                  {...register("billtime")}
                  disabled={isReadOnly}
                  className={`inputField ${errors.billtime ? "text-red-500" : "border-gray-400"}`}
                />
              </div>

              <div className="w-48">
                <label className="block text-gray-700 font-medium mb-1">Branch </label>
                <input
                  type="text"
                  value={formSelectedBranch}
                  readOnly
                  className={`inputField border-gray-400 bg-gray-100 cursor-not-allowed `}
                />
              </div>



              {!isOrderBasedSale && (
                <>
                  <div className="w-48">
                    <label className="block text-gray-700 font-medium mb-1"> Scan QR Code <span className="text-red-500"> *</span> </label>

                    <input
                      type="text"
                      {...register("qrcode")}
                      ref={(el) => {
                        scanInputRef.current = el;
                        register("qrcode").ref(el);
                      }}
                      className="inputField border-gray-300"
                      onKeyDown={(e: any) => {
                        if (e.key !== "Enter") return;
                        e.preventDefault();
                        handleScan(e.target.value);
                      }}
                    />
                  </div>
                </>
              )}


            </div>
          </section>

          {/* Item Details */}
          <section className="border rounded-md p-3 shadow-sm bg-white space-y-3">

            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
                Item Details
              </h2>

              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() =>
                    append({
                      ...defaultItemDtl,
                      sl: fields.length + 1,
                      dtlid: fields.length + 1,
                    })
                  }
                  className="primary-btn text-xs px-3 py-1"
                >
                  + Add Item
                </button>
              )}
            </div>

            {!isOrderBasedSale && (
              <>
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <DirectSaleItems
                      key={field.id}
                      index={index}
                      field={field}
                      control={control}
                      setValue={setValue}
                      register={register}
                      errors={errors}
                      remove={remove}
                      trigger={trigger}
                      watchedItems={watchedItems}
                      userId={userId}
                      companyId={companyId}
                      branchId={toolbarBranchId}
                      billdt={billdt || ''}
                      visible={visible}
                      isReadOnly={isReadOnly}
                      fieldsLength={fields.length}

                      excludeIds={selectedProductIds}
                      currentId={watchedItems?.[index]?.productid}
                    />
                  ))}
                </div>
              </>
            )}

            {isOrderBasedSale && (
              <>
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <OrderbasedSaleItems
                      key={field.id}
                      index={index}
                      field={field}
                      control={control}
                      setValue={setValue}
                      register={register}
                      errors={errors}
                      remove={remove}
                      trigger={trigger}
                      mode={mode}
                      watchedItems={watchedItems}
                      userId={userId}
                      companyId={companyId}
                      branchId={toolbarBranchId}
                      finid={finid}
                      orderid={orderid || 0}
                      billdt={billdt || ''}
                      visible={visible}
                      isReadOnly={isReadOnly}
                      fieldsLength={fields.length}

                      excludeIds={selectedProductIds}
                      currentId={watchedItems?.[index]?.productid}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="flex flex-wrap gap-4 items-center border-t pt-3">

              <div className="w-68" />

              <div className="w-80" />

              <div className="w-14 relative">
                <span className="absolute -left-20 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-700 whitespace-nowrap">
                  Total Qty
                </span>
                <input
                  type="number"
                  value={totalQty}
                  readOnly
                  className="inputField w-full bg-gray-100"
                />
              </div>

              {isOrderBasedSale && (
                <>
                  <div className="w-14"></div>
                </>
              )}

              <div className="w-28" />

              <div className="w-28 relative">
                <span className="absolute -left-24 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-700 whitespace-nowrap">
                  Total Value
                </span>
                <input
                  type="number"
                  value={Number(totalValue.toFixed(2))}
                  readOnly
                  className="inputField w-full bg-gray-100"
                />
              </div>

              <div className="w-12" />

            </div>

          </section>

          {/* Remarks */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Remarks
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Narration</label>
                <input
                  {...register("narration")}
                  placeholder="write narration here..."
                  disabled={isReadOnly}
                  className={`inputField ${errors.narration ? "" : "border-gray-400"}`}
                />
              </div>
            </div>
          </section>


        </div>

        {/* Footer */}
        <div className="border-t p-2 flex justify-end gap-4 bg-gray-50">
          {(mode !== "View" && mode !== "Print") && (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${isDeleteMode ? 'delete-btn' : 'primary-btn'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {getButtonLabel()}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="secondary-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Exit
          </button>
        </div>

        <LoadPanel
          shadingColor="rgba(0,0,0,0.4)"
          visible={isSubmitting || isLoadingDirectSale}
          showIndicator
        />

        <SearchModal
          open={customerModalOpen}
          onClose={() => setCustomerModalOpen(false)}
          endpoint="customer"
          baseParams={baseCustomerParams}
          columns={searchCustomerColumns}
          searchFields={searchCustomerFields}
          onSelect={handleCustomerSelect}
        />

        <SearchModal
          open={billTypeModalOpen}
          onClose={() => setBillTypeModalOpen(false)}
          endpoint="billtype"
          baseParams={baseBillTypeParams}
          columns={searchBillTypeColumns}
          searchFields={searchBillTypeFields}
          onSelect={handleBillTypeSelect}
        />

        <SearchModal
          open={salemanModalOpen}
          onClose={() => setSalemanModalOpen(false)}
          endpoint="salesman"
          baseParams={baseSalemanParams}
          columns={searchSalemanColumns}
          searchFields={searchSalemanFields}
          onSelect={handleSalemanSelect}
        />

        <SearchModal
          open={godownModalOpen}
          onClose={() => setGodownModalOpen(false)}
          endpoint="godown"
          baseParams={baseGodownParams}
          columns={searchGodownColumns}
          searchFields={searchGodownFields}
          onSelect={handleGodownSelect}
        />

        <SearchModal
          open={saleLedgerModalOpen}
          onClose={() => setSaleLedgerModalOpen(false)}
          endpoint="ledger"
          baseParams={baseSaleLedgerParams}
          columns={searchSaleLedgerColumns}
          searchFields={searchSaleLedgerFields}
          onSelect={handleSaleLedgerSelect}
        />

        <SearchModal
          open={transporterModalOpen}
          onClose={() => setTransporterModalOpen(false)}
          endpoint="transporter"
          baseParams={baseTransporterParams}
          columns={searchTransporterColumns}
          searchFields={searchTransporterFields}
          onSelect={handleTransporterSelect}
        />

        {/* Order Base Sale */}
        <SearchModal
          open={soPendingModalOpen}
          onClose={() => setSoPendingModalOpen(false)}
          endpoint="so/pendinglist"
          baseParams={baseSoPendingParams}
          columns={searchSoPendingColumns}
          searchFields={searchSoPendingFields}
          onSelect={handleSoPendingSelect}
          excludeIds={selectedProductIds}
        />

      </form >
    </Popup >
  );


}