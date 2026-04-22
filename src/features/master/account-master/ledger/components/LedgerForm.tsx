'use client';

import React, { useEffect, useMemo, useRef } from "react";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";
import { useQuery } from "@tanstack/react-query";
import { useLedgerById, useCreateLedger, useUpdateLedger, useDeleteLedger } from "../hooks/useLedger";
import { fetchLedgerGroupList, fetchStateList } from "@/api/master/ledger-api";
import { allowNegetive, companyStatus, costcenterApplicable, interestMethod, isCardeWallet, ledgerStatus, salaryDeducTtype, stockEffect, taxNature } from "@/common/utility/data";
import { LedgerAPI, LedgerFormType, OperationMode } from "../types/ledger.types";
import { LedgerFormSchema } from "../schemas/ledger.schema";
import { FormSelect } from "@/common/components/FormSelect";
import { ledgerFormDefaults } from "../constants/ledgerFormDefaults";
import { useLedgerForm } from "../hooks/useLedgerForm";
import { useAppStorage } from "@/hooks/useAuthStorage";

type Option = { value: number | string; label: string };

interface CompanyFormProps {
  visible: boolean;
  onClose: () => void;
  formLedgerId: number;
  mode: OperationMode;
}

export function LedgerForm({ visible, onClose, formLedgerId, mode }: CompanyFormProps) {

  const { userId, companyId } = useAppStorage();

  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const { data: Ledger, isLoading: isLoadingCompany } = useLedgerById(formLedgerId);
  const createMutation = useCreateLedger();
  const updateMutation = useUpdateLedger();
  const deleteMutation = useDeleteLedger();

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
  } = useLedgerForm(ledgerFormDefaults);


  const mapApiToForm = (data: LedgerAPI): LedgerFormSchema => ({
    ledgercode: data.ledgercode,
    ledgername: data.ledgername,
    ledgergroupid: data.ledgergroupid,

    ledgeraddr1: data.ledgeraddr1,
    ledgeraddr2: data.ledgeraddr2,
    ledgeraddr3: data.ledgeraddr3,

    ledgerphone: data.ledgerphone,
    ledgeremail: data.ledgeremail,
    ledgerwebsite: data.ledgerwebsite,
    ledgerpan: data.ledgerpan,

    intmethod: data.intmethod,
    intpct: data.intpct,

    closedtag: data.closedtag,
    bankbranch: data.bankbranch,

    taxnature: data.taxnature,

    stockeffect: data.stockeffect,
    costcenterapplicable: data.costcenterapplicable,
    allownegetive: data.allownegetive,
    iscardewallet: data.iscardewallet,

    salarydeducttype: data.salarydeducttype,
    salarynarration: data.salarynarration,

    // optional
    intmethoddesc: data.intmethoddesc,
    taxnaturedesc: data.taxnaturedesc,
    stockeffectdesc: data.stockeffectdesc,
    costcenterapplicabledesc: data.costcenterapplicabledesc,
    allownegetivedesc: data.allownegetivedesc,
    iscardewalletdesc: data.iscardewalletdesc,
    salarydeducttypedesc: data.salarydeducttypedesc,
    grouptype: data.grouptype,
  });
  // Reset form 
  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("ledgername");
    }, 1000);

    if (isAddMode) {
      reset(ledgerFormDefaults);
      return;
    }

    if (Ledger) {
      reset(mapApiToForm(Ledger));
    }
  }, [Ledger, isAddMode, reset, visible, setFocus]);


  // Fetch dropdown options
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


  const ledgerStatusOption: Option[] = useMemo(
    () => ledgerStatus.map((s) => ({ value: s.id, label: s.name })),
    []
  );
  const intMethodOption: Option[] = useMemo(
    () => interestMethod.map((s) => ({ value: s.id, label: s.name })),
    []
  );
  const stockeffectOption: Option[] = useMemo(
    () => stockEffect.map((s) => ({ value: s.id, label: s.name })),
    []
  );
  const costcenterapplicableOption: Option[] = useMemo(
    () => costcenterApplicable.map((s) => ({ value: s.id, label: s.name })),
    []
  );
  const allowNegetiveOption: Option[] = useMemo(
    () => allowNegetive.map((s) => ({ value: s.id, label: s.name })),
    []
  );
  const isCardeWalletOption: Option[] = useMemo(
    () => isCardeWallet.map((s) => ({ value: s.id, label: s.name })),
    []
  );
  const salaryDeductTypeOption: Option[] = useMemo(
    () => salaryDeducTtype.map((s) => ({ value: s.id, label: s.name })),
    []
  );
  const taxNatureOption: Option[] = useMemo(
    () => taxNature.map((s) => ({ value: s.id, label: s.name })),
    []
  );

  const handleInterestChange = (selectedOption: Option | null) => {
    if (!selectedOption) return;

    const selectedInt = interestMethod.find((m) => m.id === selectedOption.value);

    if (selectedInt) {
      // ✅ update form values properly
      setValue("intmethod", selectedInt.id);
      setValue("intpct", 0);
    }
  };
  const mapFormToPayload = (data: LedgerFormSchema): LedgerFormType => ({
    ledgername: data.ledgername,
    ledgergroupid: data.ledgergroupid,

    ledgeraddr1: data.ledgeraddr1 || "",
    ledgeraddr2: data.ledgeraddr2 || "",
    ledgeraddr3: data.ledgeraddr3 || "",

    ledgerphone: data.ledgerphone || "",
    ledgeremail: data.ledgeremail || "",
    ledgerwebsite: data.ledgerwebsite || "",
    ledgerpan: data.ledgerpan || "",

    intmethod: data.intmethod || "N",
    intpct: data.intpct ?? 0,

    closedtag: data.closedtag || "A",

    bankbranch: data.bankbranch || "",

    taxnature: data.taxnature || "NA",

    stockeffect: data.stockeffect || "N",
    costcenterapplicable: data.costcenterapplicable || "N",
    allownegetive: data.allownegetive || "N",
    iscardewallet: data.iscardewallet || "N",

    salarydeducttype: data.salarydeducttype || "NS",
    salarynarration: data.salarynarration || "",
  });
  // Submit handler
  const handleFormSubmit = async (data: LedgerFormSchema) => {
    try {
      if (isDeleteMode) {
        if (!window.confirm("Delete this Ledger?")) return;
        await deleteMutation.mutateAsync(formLedgerId);
        onClose();
        return;
      }

      const payload = mapFormToPayload(data);

      if (isAddMode) {
        await createMutation.mutateAsync(payload);
        reset({});
        onClose();
        // defaultFocusRef.current?.focus();
        return;
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: formLedgerId,
          data: payload,
        });
        onClose();
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  // Debug validation issues 
  const onError = (err: any) => {
    console.error("Validation errors:", err);
  };

  const intmethod = watch("intmethod");


  return (
    <Popup
      visible={visible}
      onHiding={onClose}
      title={`${mode} Ledger`}
      width="90vw"
      height="90vh"
      dragEnabled
      showTitle
      showCloseButton={false}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit, onError)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 overflow-y-auto p-2 space-y-2">

          {/* Ledger Information */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Ledger Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Ledger Code <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register("ledgercode")}
                  disabled={true}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.ledgercode ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter Ledger code"
                />
                {errors.ledgercode && <p className="text-red-500 mt-1 text-sm">{errors.ledgercode.message}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Ledger Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register("ledgername")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.ledgername ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter Ledger ledgercode"
                />
                {errors.ledgername && <p className="text-red-500 mt-1 text-sm">{errors.ledgername.message}</p>}
              </div>


              <div>
                <label className="block text-gray-700 font-medium mb-1">Ledger Group <span className="text-red-500">*</span></label>
                <FormSelect<LedgerFormSchema>
                  name="ledgergroupid"
                  control={control}
                  options={ledgergroupOptions}
                  placeholder="Select ledger group"
                  isDisabled={isReadOnly}
                />
                {/* {errors.cityId && <p className="text-red-500 mt-1 text-sm">{errors.cityId.message}</p>} */}
              </div>

            </div>
          </section>

          {/* Address & Contact */}
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Address & Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

              <div>
                <label className="block text-gray-700 font-medium mb-1">Address Line 1 </label>
                <input
                  type="text"
                  {...register("ledgeraddr1")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.ledgeraddr1 ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter address line 1"
                />
                {errors.ledgeraddr1 && <p className="text-red-500 mt-1 text-sm">{errors.ledgeraddr1.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Address Line 2</label>
                <input
                  type="text"
                  {...register("ledgeraddr2")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.ledgeraddr2 ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter address line 2"
                />
                {errors.ledgeraddr2 && <p className="text-red-500 mt-1 text-sm">{errors.ledgeraddr2.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Address Line 3</label>
                <input
                  type="text"
                  {...register("ledgeraddr3")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.ledgeraddr3 ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter address line 3"
                />
                {errors.ledgeraddr3 && <p className="text-red-500 mt-1 text-sm">{errors.ledgeraddr3.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Mobile</label>
                <input
                  type="text"
                  {...register("ledgerphone")}
                  maxLength={10} // prevents typing more than 10 chars
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""); // remove non-digits
                  }}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.ledgerphone ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter mobile number"
                />
                {errors.ledgerphone && <p className="text-red-500 mt-1 text-sm">{errors.ledgerphone.message}</p>}
              </div>

              <div className="">
                <label className="block text-gray-700 font-medium mb-1">Email</label>
                <input
                  type="email"
                  {...register("ledgeremail")}
                  disabled={isReadOnly}
                  className="w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition border-gray-300"
                  placeholder="Enter ledgeremail..."
                />
                {errors.ledgeremail && <p className="text-red-500 mt-1 text-sm">{errors.ledgeremail.message}</p>}
              </div>

              <div className="">
                <label className="block text-gray-700 font-medium mb-1">Website</label>
                <input
                  type="text"
                  {...register("ledgerwebsite")}
                  disabled={isReadOnly}
                  className="w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition border-gray-300"
                  placeholder="Enter ledgerwebsite..."
                />
                {errors.ledgerwebsite && <p className="text-red-500 mt-1 text-sm">{errors.ledgerwebsite.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Ledger Pan</label>
                <input
                  type="text"
                  {...register("ledgerpan")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.ledgerpan ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter ledgerpancode"
                />
                {errors.ledgerpan && <p className="text-red-500 mt-1 text-sm">{errors.ledgerpan.message}</p>}
              </div>


              {/* intmethod */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-gray-700 font-medium mb-1">Interest Method</label>
                  <FormSelect
                    name="intmethod"
                    control={control}
                    options={intMethodOption}
                    onChange={handleInterestChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Interest Percentage</label>
                  <input
                    type="text"
                    {...register("intpct", { valueAsNumber: true })}
                    disabled={isReadOnly || intmethod == "N"}
                    className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.intpct ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Enter interest percentage"
                  />
                  {errors.intpct && <p className="text-red-500 mt-1 text-sm">{errors.intpct.message}</p>}
                </div>
              </div>

              {/* Status */}
              <div className="">
                <label className="block text-gray-700 font-medium mb-1">Status</label>
                <FormSelect
                  name="closedtag"
                  control={control}
                  options={ledgerStatusOption}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Bank Branch</label>
                <input
                  type="text"
                  {...register("bankbranch")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.bankbranch ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter bankbranch"
                />
                {errors.bankbranch && <p className="text-red-500 mt-1 text-sm">{errors.bankbranch.message}</p>}
              </div>
              {/* Tax Nature */}
              <div className="">
                <label className="block text-gray-700 font-medium mb-1">Tax Nature</label>
                <FormSelect
                  name="taxnature"
                  control={control}
                  options={taxNatureOption}
                />
              </div>

              {/* stockeffect */}
              <div className="">
                <label className="block text-gray-700 font-medium mb-1">Stock Effect</label>
                <FormSelect
                  name="stockeffect"
                  control={control}
                  options={stockeffectOption}
                />
              </div>

              {/* costcenterapplicable */}
              <div className="">
                <label className="block text-gray-700 font-medium mb-1">Cost Center Applicable</label>
                <FormSelect
                  name="costcenterapplicable"
                  control={control}
                  options={costcenterapplicableOption}
                />
              </div>

              {/* allownegetive */}
              <div className="">
                <label className="block text-gray-700 font-medium mb-1">Allow Negative</label>
                <FormSelect
                  name="allownegetive"
                  control={control}
                  options={allowNegetiveOption}
                />
              </div>

              {/* iscardewallet */}
              <div className="">
                <label className="block text-gray-700 font-medium mb-1">Is card eWallet</label>
                <FormSelect
                  name="iscardewallet"
                  control={control}
                  options={isCardeWalletOption}
                />
              </div>

              {/* salarydeducttype */}
              <div className="">
                <label className="block text-gray-700 font-medium mb-1">Salary Deduction Type</label>
                <FormSelect
                  name="salarydeducttype"
                  control={control}
                  options={salaryDeductTypeOption}
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

        <LoadPanel shadingColor="rgba(0,0,0,0.4)" visible={isSubmitting || isLoadingCompany} showIndicator />
      </form>
    </Popup>
  );
}