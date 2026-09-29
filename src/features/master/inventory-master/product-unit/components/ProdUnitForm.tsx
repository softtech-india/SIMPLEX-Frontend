import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popup } from "devextreme-react/popup";
import { useCreateProdUnit, useUpdateProdUnit, useDeleteProdUnit, useProdUnit } from "../hooks/prodUnit";
import { OperationMode, ProdUnitFormData } from "../types/prodUnit.types";
import { prodUnitSchema, prodUnitFormSchema } from "../schemas/prodUnit.schema";
import { prodUnitDefaultValues } from "../constants/prodUnitFormDefaults"
import { useConfirm } from "@/common/hooks/useConfirm";
import { FormSelect } from "@/common/components/FormSelect";
import { useQuery } from "@tanstack/react-query";
import { prodUnitService } from "../services/prodUnit";
import Loader from "@/common/components/Loader";
import { Save, XCircle } from "lucide-react";
import { useKeyboardShortcuts } from "@/common/hooks/useKeyboardShortcuts";
import { SHORTCUTS } from "@/common/constants/shortcuts";
import useUserStore from "@/store/userStore";

interface ProdUnitFormProps {
  visible: boolean;
  onClose: () => void;
  ProdUnitId: number;
  mode: OperationMode;
}

type Option = { value: number | string; label: string };


export function ProdUnitForm({ visible, onClose, ProdUnitId, mode }: ProdUnitFormProps) {

  // Hooks
  const { userId, companyId, branchId, finid, } = useUserStore();
  const confirm = useConfirm();

  // State
  const defaultFocusRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const { data: prodUnitlist, isLoading: isLoadingProdUnit } = useProdUnit(ProdUnitId);
  const createMutation = useCreateProdUnit();
  const updateMutation = useUpdateProdUnit();
  const deleteMutation = useDeleteProdUnit();
  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const { control, register, handleSubmit, setFocus, reset, formState: { errors }, } = useForm<prodUnitFormSchema>({
    resolver: zodResolver(prodUnitSchema),
    defaultValues: prodUnitDefaultValues,
  });

  // handle Sortcuts 
  useKeyboardShortcuts(
    {
      [SHORTCUTS.SAVE]: () => { formRef.current?.requestSubmit(); },
      [SHORTCUTS.EXIT]: () => { onClose(); },
    },
    visible
  );

  const { data: gstUnits = [] } = useQuery({
    queryKey: ["gstUnits", userId],
    queryFn: () => prodUnitService.getAllGstUnits(),
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const gstUnitOptions: Option[] = useMemo(
    () =>
      gstUnits.map((s: any) => ({
        value: s.gstunit,
        label: s.gstunit,
      })),
    [gstUnits]
  );

  // Reset form 
  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("name");
    }, 1000);

    if (mode === 'Add') {
      reset(prodUnitDefaultValues);
      return;
    }

    if (prodUnitlist) {
      reset({
        ...prodUnitlist,

      });
    }

  }, [prodUnitlist, mode, visible, reset, setFocus]);

  const getButtonLabel = () => {
    if (isSubmitting) {
      if (isDeleteMode) return "Deleting...";
      return "Saving...";
    }

    if (isDeleteMode) return "Delete";
    return "Save";
  };


  // Submit handler
  const handleFormSubmit = async (data: prodUnitFormSchema) => {
    try {

      if (isDeleteMode) {
        const ok = await confirm({
          title: "Delete product unit",
          message: "Are you sure you want to delete this product unit?",
          confirmText: "Delete",
          variant: "danger",
        });

        if (!ok) return;

        await deleteMutation.mutateAsync(ProdUnitId);
        onClose();
        return;
      }

      const payload: ProdUnitFormData = {
        ...data,
      };

      if (isAddMode) {
        await createMutation.mutateAsync(payload);
        reset(prodUnitDefaultValues);
        //onClose();
        defaultFocusRef.current?.focus();
        return;
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: ProdUnitId,
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

  return (
    <Popup
      visible={visible}
      onHiding={onClose}
      title={`${mode} product Unit`}
      width="60vw"
      height="40vh"
      dragEnabled={false}
      showTitle={false}
      showCloseButton={false}
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit(handleFormSubmit, onError)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 overflow-y-auto p-1 space-y-1">

          <div className="flex-none border-b rounded border-gray-300 p-2 flex items-center justify-between text-white bg-[#0f1c7f]">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold ">Product Unit</h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">Mode:</span>
              <span className="text-xs font-semibold text-[#05045f] bg-blue-50 border border-blue-100 rounded px-2 py-1">
                {mode}
              </span>
            </div>
          </div>
          
          <section className="border rounded-md p-1 shadow-sm bg-white space-y-1">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-1">

              <div>
                <label className="block text-gray-700 font-medium mb-1">Product Unit Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register("name")}
                  disabled={isReadOnly}
                  className={`inputField w-full border ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter name"
                />
                {errors.name && <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Product Unit Description <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register("description")}
                  disabled={isReadOnly}
                  className={`inputField w-full border ${errors.description ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter product unit description"
                />
                {errors.description && <p className="text-red-500 mt-1 text-sm">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Product Unit Decimal Place </label>
                <input
                  type="number"
                  {...register("decimalplace", { valueAsNumber: true })}
                  disabled={isReadOnly}
                  className={`inputField w-full border ${errors.decimalplace ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter decimalplace"
                />
                {errors.decimalplace && <p className="text-red-500 mt-1 text-sm">{errors.decimalplace.message}</p>}
              </div>

              <div className="z-[101]">
                <label className="block text-gray-700 font-medium mb-1">GST Unit</label>
                <FormSelect<prodUnitFormSchema>
                  name="gstunit"
                  control={control}
                  options={gstUnitOptions}
                  placeholder="Select gst unit"
                  isDisabled={isReadOnly}
                />
              </div>

            </div>
          </section>


        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 p-2 flex justify-end gap-4 bg-white">
          {(mode !== "View" && mode !== "Print") && (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${isDeleteMode ? 'delete-btn' : 'primary-btn'} flex items-center gap-1.5 p-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Save size={15} /> {isSubmitting ? "Saving..." : getButtonLabel()}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="secondary-btn flex items-center gap-1.5 p-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XCircle size={15} />  Exit
          </button>

        </div>

        {(isSubmitting || isLoadingProdUnit) && <Loader />}


      </form>
    </Popup>
  );
}