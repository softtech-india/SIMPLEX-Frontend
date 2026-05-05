'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";
import { useQuery } from "@tanstack/react-query";
import { useVendorById, useCreateVendor, useUpdateVendor, useDeleteVendor } from "../hooks/useVendor";
import { fetchLedgerGroupList, fetchStateList, fetchCityList } from "@/api/master/ledger-api";
import { deducteeTypeTags, gstregType, interestMethod, isCardeWallet, isMainLedger, isTdsApplicable, ledgerStatus, maintainBillwise, salaryDeducTtype, stockEffect, taxNature } from "@/common/utility/data";
import { Vendor, OperationMode, VendorFormData, SubLedgerType, TDS } from "../types/vendor.types";
import { VendorFormSchema } from "../schemas/vendor.schema";
import { FormSelect } from "@/common/components/FormSelect";
import { vendorFormDefaults } from "../constants/vendorFormDefaults";
import { useVendorForm } from "../hooks/useVendorForm";
import { useAppStorage } from "@/hooks/useAuthStorage";
import { useConfirm } from "@/common/hooks/useConfirm";
import { vendorService } from "../services/vendorService";

type Option = { value: number | string; label: string };

interface VendorFormProps {
  visible: boolean;
  onClose: () => void;
  formVendorId: number;
  mode: OperationMode;
}

export function VendorForm({ visible, onClose, formVendorId, mode }: VendorFormProps) {
  const { userId, companyId } = useAppStorage();

  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const { data: Vendor, isLoading: isLoadingVendor } = useVendorById(formVendorId);
  const createMutation = useCreateVendor();
  const updateMutation = useUpdateVendor();
  const deleteMutation = useDeleteVendor();
  const confirm = useConfirm();
  const [ledgerGrouName, setLedgerGroupName] = useState("Sundry Creditors")

  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const {
    control,
    register,
    handleSubmit,
    setFocus,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useVendorForm(vendorFormDefaults);

  // Reset logic
  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("name");
    }, 1000);

    if (isAddMode) {
      reset(vendorFormDefaults);
      return;
    }

    if (Vendor) {
      reset({
        id: Vendor.id,
        name: Vendor.name ?? "",
        subledgertypeid: Vendor.subledgertypeid ?? vendorFormDefaults.subledgertypeid,
        ledgergroupid: Vendor.ledgergroupid ?? vendorFormDefaults.ledgergroupid,
        cityid: Vendor.cityid ?? vendorFormDefaults.cityid,
        stateid: Vendor.stateid ?? vendorFormDefaults.stateid,
        addr1: Vendor.addr1 ?? "",
        addr2: Vendor.addr2 ?? "",
        addr3: Vendor.addr3 ?? "",
        nl: Vendor.nl ?? "",
        pin: Vendor.pin ?? "",
        phone: Vendor.phone ?? "",
        mobile: Vendor.mobile ?? "",
        email: Vendor.email ?? "",
        pan: Vendor.pan ?? "",
        bankbranch: Vendor.bankbranch ?? "",
        bankifsc: Vendor.bankifsc ?? "",
        banknm: Vendor.banknm ?? "",
        bankaccno: String(Vendor.bankaccno) ?? "",
        crdays: Vendor.crdays ?? 0,
        crlimit: Vendor.crlimit ?? 0,
        gstregtype: Vendor.gstregtype ?? vendorFormDefaults.gstregtype,
        gstin: Vendor.gstin ?? "",
        closedtag: Vendor.closedtag ?? vendorFormDefaults.closedtag,
        corpgrpid: Vendor.corpgrpid ?? vendorFormDefaults.corpgrpid,
        intmethod: Vendor.intmethod ?? vendorFormDefaults.intmethod,
        intpct: Vendor.intpct ?? vendorFormDefaults.intpct,
        tdsapplicable: Vendor.tdsapplicable ?? vendorFormDefaults.tdsapplicable,
        deducteetype: Vendor.deducteetype ?? vendorFormDefaults.deducteetype,
        tdssecid: Vendor.tdssecid ?? vendorFormDefaults.tdssecid,
        maintainbillwise: Vendor.maintainbillwise ?? vendorFormDefaults.maintainbillwise,
        ismainledger: Vendor.ismainledger ?? vendorFormDefaults.ismainledger,
        accpostledgerid: Vendor.accpostledgerid ?? vendorFormDefaults.accpostledgerid,
      });
    }
  }, [Vendor, isAddMode, reset, visible, setFocus]);

  // Fetch dropdown options for ledger group
  const { data: ledgergroupOptions = [] } = useQuery({
    queryKey: ["ledgerGroupList", userId, companyId],
    queryFn: () => fetchLedgerGroupList(userId, companyId),
    staleTime: 0,
    enabled: !!companyId,
    retry: 1,
    refetchOnWindowFocus: false,
    select: (data) =>
      (data ?? []).map((s: any) => ({
        value: s.id,
        label: s.ledgergroup,
      })),
  });

  // Fetch dropdown options for state
  const { data: stateOptions = [] } = useQuery({
    queryKey: ["stateList", userId],
    queryFn: () => fetchStateList(userId),
    staleTime: 0,
    enabled: !!companyId,
    retry: 1,
    refetchOnWindowFocus: false,
    select: (data) =>
      (data ?? []).map((s: any) => ({
        value: s.id,
        label: s.state,
      })),
  });

  const selectedStateId = watch("stateid");
  const stateId = Number(selectedStateId);

  // Fetch city options based on selected state
  const { data: cityOptions = [] } = useQuery({
    queryKey: ["cities", userId, stateId],
    queryFn: () => fetchCityList(userId, stateId),
    enabled: !!stateId && stateId > 0,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    select: (data) =>
      (data ?? []).map((s: any) => ({
        value: s.id,
        label: s.city,
      })),
  });

  // Fetch corporate group options
  const { data: corpGroupOptions = [] } = useQuery({
    queryKey: ["corpgroup", userId, companyId],
    queryFn: () => vendorService.getAllCorpGroups(),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    select: (data) =>
      (data ?? []).map((c: any) => ({
        value: c.id,
        label: c.name,
      })),
  });

  // Fetch acc post ledger options
  const { data: accpostledgerOptions = [] } = useQuery({
    queryKey: ["accpostledger", userId, companyId],
    queryFn: () => vendorService.getAllVendors(),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    select: (data) =>
      (data ?? []).map((c: any) => ({
        value: c.id,
        label: c.name,
      })),
  });

  // Fetch sub ledger options - FIXED: renamed to subledgertypeOptions
  const { data: subledgertypeOptions = [] } = useQuery({
    queryKey: ["subledgertype", userId, companyId],
    queryFn: () => vendorService.getAllSubLedgers(),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    select: (data) =>
      (data ?? []).map((c: SubLedgerType) => ({
        value: c.id,
        label: c.subledgertype,
        ledgergroupid: c.ledgergroupid,
        ledgergroup: c.ledgergroup,
      })),
  });

  // Fetch sub ledger options - FIXED: renamed to subledgertypeOptions
  const { data: tdsList = [] } = useQuery({
    queryKey: ["tdssecid", userId, companyId],
    queryFn: () => vendorService.getAlltdsSections(),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    select: (data) =>
      (data ?? []).map((c: TDS) => ({
        value: c.id,
        label: c.name,

      })),
  });

  const prevStateRef = useRef<number | undefined>(0);

  useEffect(() => {
    if (prevStateRef.current !== selectedStateId) {
      setValue("cityid", 1);
      prevStateRef.current = selectedStateId;
    }
  }, [selectedStateId, setValue]);

  // Options arrays
  const ledgerStatusOption: Option[] = useMemo(
    () => ledgerStatus.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const intMethodOption: Option[] = useMemo(
    () => interestMethod.map((s) => ({ value: s.id, label: s.name })),
    []
  );


  const tdsApplicableOption: Option[] = useMemo(
    () => isTdsApplicable.map((s) => ({ value: s.id, label: s.name })),
    []
  );


  const maintainBillwiseOption: Option[] = useMemo(
    () => maintainBillwise.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const isMainLedgerOption: Option[] = useMemo(
    () => isMainLedger.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const gstregTypeOption: Option[] = useMemo(
    () => gstregType.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const deducteeTypeOption: Option[] = useMemo(
    () => deducteeTypeTags.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const handleInterestChange = (selectedOption: Option | null) => {
    if (!selectedOption) return;
    const selectedInt = interestMethod.find((m) => m.id === selectedOption.value);
    if (selectedInt) {
      setValue("intmethod", selectedInt.id);
      setValue("intpct", 0);
    }
  };

  const handlesubLedgerTypeChange = (selectedOption: Option | null) => {
    if (!selectedOption) return;

    const selectedSubledg = subledgertypeOptions.find(
      (m: Option) => m.value === selectedOption.value
    );
    if (selectedSubledg) {
      setValue("subledgertypeid", Number(selectedSubledg.value));
      setValue("ledgergroupid", selectedSubledg.ledgergroupid);
      if (selectedSubledg.ledgergroupid) {
        setLedgerGroupName(selectedSubledg.ledgergroup)

      }
    }
  };
  useEffect(() => {
    const defaultSubLedger = subledgertypeOptions.find(
      (option: Option) => option.value === vendorFormDefaults.subledgertypeid
    );

    if (defaultSubLedger) {
      handlesubLedgerTypeChange(defaultSubLedger);
    }
  }, []);

  const handleFormSubmit = async (data: VendorFormSchema) => {
    console.log("Form data before submit:", {
      corpgrpid: data.corpgrpid,
      type: typeof data.corpgrpid,
      fullData: data
    });
    try {
      if (isDeleteMode) {
        const ok = await confirm({
          title: "Delete Vendor",
          message: "Are you sure you want to delete this vendor?",
        });

        if (!ok) return;
        if (!data.id) throw new Error("Invalid ID for delete");
        await deleteMutation.mutateAsync(data.id);
        onClose();
        return;
      }

      const payload: VendorFormData = {
        ...data,
        pin: data.pin ?? "",
        addr1: data.addr1 ?? "",
        addr2: data.addr2 ?? "",
        addr3: data.addr3 ?? "",
        nl: data.nl ?? "",
        stateid: data.stateid ?? 0,
        phone: data.phone ?? "",
        mobile: data.mobile ?? "",
        email: data.email ?? "",
        pan: data.pan ?? "",
        bankbranch: data.bankbranch ?? "",
        bankifsc: data.bankifsc ?? "",
        banknm: data.banknm ?? "",
        bankaccno: data.bankaccno ?? "",
        crdays: data.crdays ?? 0,
        crlimit: data.crlimit ?? 0,
        gstregtype: data.gstregtype ?? "N",
        gstin: data.gstin ?? "",
        closedtag: data.closedtag ?? "A",
        corpgrpid: data.corpgrpid ?? 0,
        intmethod: data.intmethod ?? "N",
        intpct: data.intpct ?? 0,
        tdsapplicable: data.tdsapplicable ?? "Y",
        deducteetype: data.deducteetype ?? "01",
        tdssecid: data.tdssecid ?? 0,
        maintainbillwise: data.maintainbillwise ?? "Y",
        ismainledger: data.ismainledger ?? "Y",
        accpostledgerid: data.accpostledgerid ?? 0,
      };

      if (isAddMode) {
        await createMutation.mutateAsync(payload);
        reset(vendorFormDefaults);
        onClose();
        return;
      }

      if (isEditMode) {
        if (!data.id) throw new Error("Invalid ID for update");
        await updateMutation.mutateAsync({
          id: data.id,
          data: payload,
        });
        onClose();
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const onError = (err: any) => {
    console.error("Validation errors:", err);
  };

  const intmethod = watch("intmethod");
  const gstRegType = watch("gstregtype");
  const mainLedger = watch("ismainledger");
  const selectedTdsapplicable = watch("tdsapplicable")

  return (
    <Popup
      visible={visible}
      onHiding={onClose}
      title={`${mode} Vendor`}
      width="99vw"
      height="98vh"
      dragEnabled
      showTitle
      showCloseButton={false}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit, onError)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {/* Vendor Information */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Vendor Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Sub Ledger Type<span className="text-red-500">*</span></label>
                <FormSelect<VendorFormSchema>
                  name="subledgertypeid"
                  control={control}
                  options={subledgertypeOptions}
                  placeholder="Select sub ledger type"
                  isDisabled={isReadOnly}
                  onChange={handlesubLedgerTypeChange}
                />
              </div>

              {Vendor && (
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Code<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    defaultValue={Vendor?.code}
                    disabled={true}
                    className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition border-gray-300`}
                    placeholder="Enter company id"
                  />
                </div>
              )}


              <div>
                <label className="block text-gray-700 font-medium mb-1">Ledger Group <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  disabled={true}
                  defaultValue={"Sundry Creditors"}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.ledgergroupid ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter Vendor name"
                />
                {errors.ledgergroupid && <p className="text-red-500 mt-1 text-sm">{errors.ledgergroupid.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Vendor Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register("name")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter Vendor name"
                />
                {errors.name && <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>}
              </div>

            </div>
          </section>

          {/* Address & Contact */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Address & Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Address Line 1<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register("addr1")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.addr1 ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter address line 1"
                />
                {errors.addr1 && <p className="text-red-500 mt-1 text-sm">{errors.addr1.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Address Line 2</label>
                <input
                  type="text"
                  {...register("addr2")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.addr2 ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter address line 2"
                />
                {errors.addr2 && <p className="text-red-500 mt-1 text-sm">{errors.addr2.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Address Line 3</label>
                <input
                  type="text"
                  {...register("addr3")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.addr3 ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter address line 3"
                />
                {errors.addr3 && <p className="text-red-500 mt-1 text-sm">{errors.addr3.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Nearby Location</label>
                <input
                  type="text"
                  {...register("nl")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.nl ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter nearby location"
                />
                {errors.nl && <p className="text-red-500 mt-1 text-sm">{errors.nl.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">State</label>
                <FormSelect<VendorFormSchema>
                  name="stateid"
                  control={control}
                  options={stateOptions}
                  isDisabled={isReadOnly}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">City</label>
                <FormSelect<VendorFormSchema>
                  name="cityid"
                  control={control}
                  options={cityOptions}
                  isDisabled={isReadOnly || !selectedStateId}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Pin</label>
                <input
                  type="text"
                  {...register("pin")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.pin ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter pin"
                />
                {errors.pin && <p className="text-red-500 mt-1 text-sm">{errors.pin.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Phone</label>
                <input
                  type="text"
                  {...register("phone")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="text-red-500 mt-1 text-sm">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Mobile</label>
                <input
                  type="text"
                  {...register("mobile")}
                  maxLength={10}
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
                  }}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.mobile ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter mobile number"
                />
                {errors.mobile && <p className="text-red-500 mt-1 text-sm">{errors.mobile.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Email</label>
                <input
                  type="text"
                  {...register("email")}
                  disabled={isReadOnly}
                  className="w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition border-gray-300"
                  placeholder="Enter email..."
                />
                {errors.email && <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>}
              </div>
            </div>
          </section>

          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Statutory Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-gray-700 font-medium mb-1">GST Registration Type</label>
                  <FormSelect<VendorFormSchema>
                    name="gstregtype"
                    control={control}
                    options={gstregTypeOption}
                    isDisabled={isReadOnly}
                  />
                </div>

                {gstRegType !== 'U' && (
                  <div className="w-1/2">
                    <label className="block text-gray-700 font-medium mb-1">GSTIN</label>
                    <input
                      type="text"
                      {...register("gstin")}
                      disabled={isReadOnly}
                      className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.gstin ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Enter GSTIN"
                    />
                    {errors.gstin && <p className="text-red-500 mt-1 text-sm">{errors.gstin.message}</p>}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Pan</label>
                <input
                  type="text"
                  {...register("pan")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.pan ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter PAN"
                />
                {errors.pan && <p className="text-red-500 mt-1 text-sm">{errors.pan.message}</p>}
              </div>





            </div>
          </section>

          {/* Bank Details */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Bank Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Bank Branch</label>
                <input
                  type="text"
                  {...register("bankbranch")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.bankbranch ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter bank branch"
                />
                {errors.bankbranch && <p className="text-red-500 mt-1 text-sm">{errors.bankbranch.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Bank IFSC</label>
                <input
                  type="text"
                  {...register("bankifsc")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.bankifsc ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter bank IFSC"
                />
                {errors.bankifsc && <p className="text-red-500 mt-1 text-sm">{errors.bankifsc.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Bank Name</label>
                <input
                  type="text"
                  {...register("banknm")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.banknm ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter bank name"
                />
                {errors.banknm && <p className="text-red-500 mt-1 text-sm">{errors.banknm.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Bank Account Number</label>
                <input
                  type="text"
                  {...register("bankaccno")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.bankaccno ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter bank account number"
                />
                {errors.bankaccno && <p className="text-red-500 mt-1 text-sm">{errors.bankaccno.message}</p>}
              </div>
            </div>
          </section>

          {/* Statutory Details */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Statutory Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-4">

                <div className="w-1/4">
                  <label className="block text-gray-700 font-medium mb-1">TDS Applicable</label>
                  <FormSelect<VendorFormSchema>
                    name="tdsapplicable"
                    control={control}
                    options={tdsApplicableOption}
                    isDisabled={isReadOnly}
                  />
                </div>

                <div className="w-1/4">
                  <label className="block text-gray-700 font-medium mb-1">Deductee Type</label>
                  <FormSelect<VendorFormSchema>
                    name="deducteetype"
                    control={control}
                    options={deducteeTypeOption}
                    isDisabled={isReadOnly || selectedTdsapplicable === "N"}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700 font-medium mb-1">TDS Section ID</label>
                  <FormSelect<VendorFormSchema>
                    name="tdssecid"
                    control={control}
                    options={tdsList}
                    isDisabled={isReadOnly || selectedTdsapplicable === "N"}
                  />
                </div>
              </div>

              <div className="flex gap-4">




                <div className="w-1/2">
                  <label className="block text-gray-700 font-medium mb-1">Is Main Ledger</label>
                  <FormSelect<VendorFormSchema>
                    name="ismainledger"
                    control={control}
                    options={isMainLedgerOption}
                    isDisabled={isReadOnly}
                  />
                </div>

                {mainLedger === 'N' && (
                  <div className="w-1/2">
                    <label className="block text-gray-700 font-medium mb-1">Acc Post Ledger</label>
                    <FormSelect<VendorFormSchema>
                      name="accpostledgerid"
                      control={control}
                      options={accpostledgerOptions}
                      isDisabled={isReadOnly}
                    />
                  </div>
                )}
              </div>



              <div className="flex gap-4">
                <div className="w-1/4">
                  <label className="block text-gray-700 font-medium mb-1">Maintain Bill Wise</label>
                  <FormSelect<VendorFormSchema>
                    name="maintainbillwise"
                    control={control}
                    options={maintainBillwiseOption}
                    isDisabled={isReadOnly}
                  />
                </div>
                <div className="w-1/4">
                  <label className="block text-gray-700 font-medium mb-1">Credit Days</label>
                  <input
                    type="number"
                    {...register("crdays", { valueAsNumber: true })}
                    disabled={isReadOnly}
                    className="w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition border-gray-300"
                    placeholder="Enter credit days"
                  />
                  {errors.crdays && <p className="text-red-500 mt-1 text-sm">{errors.crdays.message}</p>}
                </div>

                <div className="w-1/2">
                  <label className="block text-gray-700 font-medium mb-1">Credit Limit</label>
                  <input
                    type="number"
                    {...register("crlimit", { valueAsNumber: true })}
                    disabled={isReadOnly}
                    className="w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition border-gray-300"
                    placeholder="Enter credit limit"
                  />
                  {errors.crlimit && <p className="text-red-500 mt-1 text-sm">{errors.crlimit.message}</p>}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-gray-700 font-medium mb-1">Interest Method</label>
                  <FormSelect<VendorFormSchema>
                    name="intmethod"
                    control={control}
                    options={intMethodOption}
                    onChange={handleInterestChange}
                    isDisabled={isReadOnly}
                  />
                </div>

                <div className="w-1/2">
                  <label className="block text-gray-700 font-medium mb-1">Interest Percentage</label>
                  <input
                    type="number"
                    {...register("intpct", { valueAsNumber: true })}
                    disabled={isReadOnly || intmethod === "N"}
                    className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.intpct ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter interest percentage"
                  />
                  {errors.intpct && <p className="text-red-500 mt-1 text-sm">{errors.intpct.message}</p>}
                </div>
              </div>

              <div className="flex gap-4">


                <div className="w-1/2 ">
                  <label className="block text-gray-700 font-medium mb-1">Corporate Group</label>
                  <FormSelect<VendorFormSchema>
                    name="corpgrpid"
                    control={control}
                    options={corpGroupOptions}
                    isDisabled={isReadOnly}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700 font-medium mb-1">Status</label>
                  <FormSelect<VendorFormSchema>
                    name="closedtag"
                    control={control}
                    options={ledgerStatusOption}
                    isDisabled={isReadOnly}
                  />
                </div>
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
              className="primary-btn disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? isDeleteMode ? "Deleting..." : "Saving..."
                : isDeleteMode ? "Delete" : "Save"
              }
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

        <LoadPanel shadingColor="rgba(0,0,0,0.4)" visible={isSubmitting || isLoadingVendor} showIndicator />
      </form>
    </Popup>
  );
}