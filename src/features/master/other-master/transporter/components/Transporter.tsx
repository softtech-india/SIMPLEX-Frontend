import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popup } from "devextreme-react/popup";
import { useCreateTransporter, useUpdateTransporter, useDeleteTransporter, useTransporter, } from "../hooks/transporter";
import { OperationMode, TransporterFormData, } from "../types/transporter";
import { TransporterSchema, TransporterFormSchema, } from "../schemas/transporter.schema";
import { TransporterDefaultValues } from "../constants/transporter";
import { useConfirm } from "@/common/hooks/useConfirm";
import Loader from "@/common/components/Loader";
import { useKeyboardShortcuts } from "@/common/hooks/useKeyboardShortcuts";
import { SHORTCUTS } from "@/common/constants/shortcuts";
import { Save, XCircle } from "lucide-react";

interface TransporterFormProps {
  visible: boolean;
  onClose: () => void;
  transporterId: number;
  mode: OperationMode;
  returnAfterSave?: boolean;
  onSuccess?: (product: any) => void;
}


export function TransporterForm({ visible, onClose, transporterId, mode, returnAfterSave, onSuccess }: TransporterFormProps) {

  const confirm = useConfirm();

  const defaultFocusRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const { data: transporterData, isLoading: isLoadingTransporter, } = useTransporter(transporterId);

  const createMutation = useCreateTransporter();
  const updateMutation = useUpdateTransporter();
  const deleteMutation = useDeleteTransporter();

  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const {
    register, handleSubmit, setFocus, reset, control, formState: { errors },
  } = useForm<TransporterFormSchema>({
    resolver: zodResolver(TransporterSchema),
    defaultValues: {
      ...TransporterDefaultValues,
    },
  });

  // handle Sortcuts 
  useKeyboardShortcuts(
    {
      [SHORTCUTS.SAVE]: () => { formRef.current?.requestSubmit(); },
      [SHORTCUTS.EXIT]: () => { onClose(); },
    },
    visible
  );


  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("name");
    }, 1000);

    if (mode === "Add") {
      reset({
        ...TransporterDefaultValues,
      });
      return;
    }

    if (transporterData) {
      reset({
        ...transporterData,
      });
    }
  }, [transporterData, mode, visible, setFocus, reset]);

  const getButtonLabel = () => {
    if (isSubmitting) {
      if (isDeleteMode) return "Deleting...";
      return "Saving...";
    }

    if (isDeleteMode) return "Delete";
    return "Save";
  };


  const handleFormSubmit = async (data: TransporterFormSchema) => {
    try {
      if (isDeleteMode) {
        const ok = await confirm({
          title: "Delete Transporter",
          message: "Are you sure you want to delete this Transporter?",
          confirmText: "Delete",
          variant: "danger",
        });
        if (!ok) return;
        await deleteMutation.mutateAsync(transporterId);
        onClose();
        return;
      }

      const payload: TransporterFormData = {
        ...data,
        name: data.name ?? "",
        addr1: data.addr1 ?? "",
        addr2: data.addr2 ?? "",
        addr3: data.addr3 ?? "",
        mobno: data.mobno ?? "",
        phno: data.phno ?? "",
        email: data.email ?? "",
        contperson: data.contperson ?? "",
        gstin: data.gstin ?? "",
      };

      if (isAddMode) {
        const response = await createMutation.mutateAsync(payload);
        if (response?.success) {
          reset(TransporterDefaultValues);
          defaultFocusRef.current?.focus();
        }
        if (returnAfterSave) {
          onSuccess?.(response);
          onClose();
          return;
        }
        return;
      }

      if (isEditMode) {
        const response = await updateMutation.mutateAsync({
          id: transporterId,
          data: payload,
        });
        if (response?.success) {
          onClose();
        }

      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };


  const onError = (err: any) => {
    console.error("Validation errors:", err);
  };

  return (
    <Popup
      visible={visible}
      onHiding={onClose}
      title={`Transporter`}
      width="90vw"
      height="50vh"
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
              <h1 className="text-base font-semibold ">Transporter</h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">Mode:</span>
              <span className="text-xs font-semibold text-[#05045f] bg-blue-50 border border-blue-100 rounded px-2 py-1">
                {mode}
              </span>
            </div>
          </div>

          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">

            <div className="grid grid-cols-3 gap-1">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Name <strong className="text-red-500"> * </strong>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  disabled={isReadOnly}
                  ref={(e) => {
                    register("name").ref(e);
                    if (e && visible && isAddMode) {
                      defaultFocusRef.current = e;
                    }
                  }}
                  className={`inputField w-full border ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter Name"
                />
                {errors.name && (<p className="text-red-500 mt-1 text-sm"> {errors.name.message} </p>)}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1"> Address 1  </label>
                <input
                  type="text"
                  {...register("addr1")}
                  disabled={isReadOnly}
                  className={`inputField w-full border ${errors.addr1 ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter address 1"
                />
                {errors.addr1 && (<p className="text-red-500 mt-1 text-sm"> {errors.addr1.message} </p>)}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1"> Address 2  </label>
                <input
                  type="text"
                  {...register("addr2")}
                  disabled={isReadOnly}
                  className={`inputField w-full border ${errors.addr2 ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter addr2"
                />
                {errors.addr2 && (<p className="text-red-500 mt-1 text-sm">{errors.addr2.message}</p>)}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">  Address 3   </label>
                <input
                  type="text"
                  {...register("addr3")}
                  disabled={isReadOnly}
                  className={`inputField w-full border ${errors.addr3 ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter addr3"
                />
                {errors.addr3 && (<p className="text-red-500 mt-1 text-sm"> {errors.addr3.message} </p>)}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">  GST </label>
                <input
                  type="text"
                  {...register("gstin")}
                  disabled={isReadOnly}
                  className={`inputField w-full border ${errors.contperson ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter gstin"
                />
                {errors.gstin && (<p className="text-red-500 mt-1 text-sm">  {errors.gstin.message}   </p>)}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1"> Mobile No  </label>
                <input
                  type="text"
                  {...register("mobno")}
                  disabled={isReadOnly}
                  className={`inputField w-full border ${errors.mobno ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter mobno"
                />
                {errors.mobno && (<p className="text-red-500 mt-1 text-sm">  {errors.mobno.message}  </p>)}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1"> Phone No.  </label>
                <input
                  type="text"
                  {...register("phno")}
                  disabled={isReadOnly}
                  className={`inputField w-full border ${errors.phno ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter phno"
                />
                {errors.phno && (<p className="text-red-500 mt-1 text-sm">  {errors.phno.message}  </p>)}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1"> Email </label>
                <input
                  type="text"
                  {...register("email")}
                  disabled={isReadOnly}
                  className={`inputField w-full border ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter email"
                />
                {errors.email && (<p className="text-red-500 mt-1 text-sm">  {errors.email.message}  </p>)}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1"> Contact Person</label>
                <input
                  type="text"
                  {...register("contperson")}
                  disabled={isReadOnly}
                  className={`inputField w-full border ${errors.gstin ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter contperson"
                />
                {errors.contperson && (<p className="text-red-500 mt-1 text-sm">  {errors.contperson.message}  </p>)}
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

        {isSubmitting || isLoadingTransporter && <Loader />}

      </form>
    </Popup>
  );
}