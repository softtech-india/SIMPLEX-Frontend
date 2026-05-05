'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";
import { useQuery } from "@tanstack/react-query";
import { useCustomerById, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from "../hooks/useCustomer";
import { fetchLedgerGroupList, fetchStateList, fetchCityList } from "@/api/master/ledger-api";
import { allowNegetive, companyStatus, costcenterApplicable, deducteeTypeTags, gstregType, interestMethod, isCardeWallet, isMainLedger, isTdsApplicable, ledgerStatus, maintainBillwise, salaryDeducTtype, stockEffect, taxNature } from "@/common/utility/data";
import { Customer, OperationMode, CustomerFormData, SubLedgerType } from "../types/customer.types";
import { CustomerFormSchema } from "../schemas/customer.schema";
import { FormSelect } from "@/common/components/FormSelect";
import { customerFormDefaults } from "../constants/customerFormDefaults";
import { useCustomerForm } from "../hooks/useCustomerForm";
import { useAppStorage } from "@/hooks/useAuthStorage";
import { useConfirm } from "@/common/hooks/useConfirm";
import { customerService } from "../services/customerService";

type Option = { value: number | string; label: string };

interface CustomerFormProps {
  visible: boolean;
  onClose: () => void;
  formCustomerId: number;
  mode: OperationMode;
}

export function CustomerForm({ visible, onClose, formCustomerId, mode }: CustomerFormProps) {
  const { userId, companyId } = useAppStorage();

  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const { data: Customer, isLoading: isLoadingCustomer } = useCustomerById(formCustomerId);
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();
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
  } = useCustomerForm(customerFormDefaults);

  // Reset logic
  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("name");
    }, 1000);

    if (isAddMode) {
      reset(customerFormDefaults);
      return;
    }

    if (Customer) {
      reset({
        id: Customer.id,
        name: Customer.name ?? "",
        subledgertypeid: Customer.subledgertypeid ?? customerFormDefaults.subledgertypeid,
        ledgergroupid: Customer.ledgergroupid ?? customerFormDefaults.ledgergroupid,
        cityid: Customer.cityid,
        stateid: Customer.stateid ?? customerFormDefaults.stateid,
        addr1: Customer.addr1 ?? "",
        addr2: Customer.addr2 ?? "",
        addr3: Customer.addr3 ?? "",
        nl: Customer.nl ?? "",
        pin: Customer.pin ?? "",
        phone: Customer.phone ?? "",
        mobile: Customer.mobile ?? "",  // REMOVED the undefined override
        email: Customer.email ?? "",
        pan: Customer.pan ?? "",
        crdays: Customer.crdays ?? 0,
        crlimit: Customer.crlimit ?? 0,
        gstregtype: Customer.gstregtype ?? customerFormDefaults.gstregtype,
        gstin: Customer.gstin ?? "",
        status: Customer.status ?? customerFormDefaults.status,
      });
    }
  }, [Customer, isAddMode, reset, visible, setFocus]);

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



  // Fetch sub ledger options - FIXED: renamed to subledgertypeOptions
  const { data: subledgertypeOptions = [] } = useQuery({
    queryKey: ["subledgertype", userId, companyId],
    queryFn: () => customerService.getAllSubLedgers(),
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


  const prevStateRef = useRef<number | undefined>(0);

  useEffect(() => {
    if (prevStateRef.current !== selectedStateId) {
      setValue("cityid", 1);
      prevStateRef.current = selectedStateId;
    }
  }, [selectedStateId, setValue]);

  useEffect(() => {
    if (!visible || isAddMode) return;

    if (Customer && Customer.stateid && Customer.cityid) {
      // Ensure state is set first, then allow time for city options to load
      const timer = setTimeout(() => {
        setValue("cityid", Customer.cityid ?? 0);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [Customer, visible, isAddMode, cityOptions, setValue]);

  // Options arrays
  const ledgerStatusOption: Option[] = useMemo(
    () => ledgerStatus.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const gstregTypeOption: Option[] = useMemo(
    () => gstregType.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const handlesubLedgerTypeChange = (selectedOption: Option | null) => {
    if (!selectedOption) return;

    const selectedSubledg = subledgertypeOptions.find(
      (m: Option) => m.value === selectedOption.value
    );
    // console.log(selectedSubledg)
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
      (option: Option) => option.value === customerFormDefaults.subledgertypeid
    );

    if (defaultSubLedger) {
      handlesubLedgerTypeChange(defaultSubLedger);
    }
  }, []);

  const handleFormSubmit = async (data: CustomerFormSchema) => {
    console.log("Form data before submit:", {
      fullData: data
    });
    try {
      if (isDeleteMode) {
        const ok = await confirm({
          title: "Delete Customer",
          message: "Are you sure you want to delete this Customer?",
        });

        if (!ok) return;
        if (!data.id) throw new Error("Invalid ID for delete");
        await deleteMutation.mutateAsync(data.id);
        onClose();
        return;
      }

      const payload: CustomerFormData = {
        ...data,
        compid: Number(companyId),
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
        crdays: data.crdays ?? 0,
        crlimit: data.crlimit ?? 0,
        gstregtype: data.gstregtype ?? "N",
        gstin: data.gstin ?? "",
        status: data.status ?? "A",
      };

      if (isAddMode) {
        await createMutation.mutateAsync(payload);
        reset(customerFormDefaults);
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

  const gstRegType = watch("gstregtype");

  return (
    <Popup
      visible={visible}
      onHiding={onClose}
      title={`${mode} Customer`}
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
          {/* Customer Information */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Sub Ledger Type<span className="text-red-500">*</span></label>
                <FormSelect<CustomerFormSchema>
                  name="subledgertypeid"
                  control={control}
                  options={subledgertypeOptions}
                  placeholder="Select sub ledger type"
                  isDisabled={isReadOnly}
                  onChange={handlesubLedgerTypeChange}
                />
              </div>




              <div>
                <label className="block text-gray-700 font-medium mb-1">Ledger Group <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  disabled={true}
                  defaultValue={"Sundry Debtors"}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.ledgergroupid ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter Customer name"
                />
                {errors.ledgergroupid && <p className="text-red-500 mt-1 text-sm">{errors.ledgergroupid.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Customer Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register("name")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter Customer name"
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
                <FormSelect<CustomerFormSchema>
                  name="stateid"
                  control={control}
                  options={stateOptions}
                  isDisabled={isReadOnly}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">City</label>
                <FormSelect<CustomerFormSchema>
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
                  <FormSelect<CustomerFormSchema>
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



          {/* Statutory Details */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Statutory Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


              <div className="flex gap-4">



                <div className="w-1/2">
                  <label className="block text-gray-700 font-medium mb-1">Status</label>
                  <FormSelect<CustomerFormSchema>
                    name="status"
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

        <LoadPanel shadingColor="rgba(0,0,0,0.4)" visible={isSubmitting || isLoadingCustomer} showIndicator />
      </form>
    </Popup>
  );
}