import React, { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popup } from "devextreme-react/popup";
import LoadPanel from "devextreme-react/load-panel";

import {
  useCreateTransporter,
  useUpdateTransporter,
  useDeleteTransporter,
  useTransporter,
} from "../hooks/transporter";

import {
  Transporter,
  OperationMode,
  TransporterFormData,
} from "../types/transporter";

import {
  TransporterSchema,
  TransporterFormSchema,
} from "../schemas/transporter.schema";

import { TransporterDefaultValues } from "../constants/transporter";
import { useConfirm } from "@/common/hooks/useConfirm";
import { useQuery } from "@tanstack/react-query";
import { getStorageItem } from "@/common/utility/storage";
import { FormSelect } from "@/common/components/FormSelect";
import { transporterService } from "../services/transporter";

interface TransporterFormProps {
  visible: boolean;
  onClose: () => void;
  transporterId: number;
  mode: OperationMode;
}

type Option = { value: number | string; label: string };



export function TransporterForm({
  visible,
  onClose,
  transporterId,
  mode,
}: TransporterFormProps) {
  const confirm = useConfirm();
  const userId = getStorageItem("userId");
  const defaultFocusRef = useRef<HTMLInputElement>(null);
  const isEditMode = mode === "Edit";
  const isAddMode = mode === "Add";
  const isDeleteMode = mode === "Delete";
  const isReadOnly = mode === "View" || mode === "Print";

  const {
    data: transporterData,
    isLoading: isLoadingTransporter,
  } = useTransporter(transporterId);

  const createMutation = useCreateTransporter();
  const updateMutation = useUpdateTransporter();
  const deleteMutation = useDeleteTransporter();

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    control,
    formState: { errors },
  } = useForm<TransporterFormSchema>({
    resolver: zodResolver(TransporterSchema),
    defaultValues: {
      ...TransporterDefaultValues,
    },
  });

  useEffect(() => {
    if (!visible) return;

    setTimeout(() => {
      setFocus("name");
    }, 500);

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

  const handleFormSubmit = async (data: TransporterFormSchema) => {
    try {
      if (isDeleteMode) {
        const ok = await confirm({
          title: "Delete Transporter",
          message: "Are you sure you want to delete this Transporter?",
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

        // Check if creation was successful
        if (response?.success) {
          // Success: Reset form and keep it open for another entry
          reset(TransporterDefaultValues);
          defaultFocusRef.current?.focus();
          // Optional: You can also refresh any dropdowns or lists here
        }
        // If not successful, form stays as is (user can correct and retry)
        return;
      }

      if (isEditMode) {
        const response = await updateMutation.mutateAsync({
          id: transporterId,
          data: payload,
        });

        // Only close if update was successful
        if (response?.success) {
          onClose();
        }
        // If not successful, form stays open for user to correct
      }
    } catch (error) {
      console.error("Submit error:", error);
      // Error is already handled by toast in the mutation
      // Form stays as is so user can try again
    }
  };



  const onError = (err: any) => {
    console.error("Validation errors:", err);
  };

  return (
    <Popup
      visible={visible}
      onHiding={onClose}
      title={`${mode} Transporter`}
      width="50vw"
      height="75vh"
      dragEnabled
      showTitle
      showCloseButton={false}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit, onError)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          <section className="border rounded-md p-2 shadow-sm bg-white space-y-2">
            <h2 className="text-sm font-semibold text-color border-l-4 border-[#05045f] pl-3 py-1 bg-blue-50">
              Transporter Information
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Name
                  <span className="text-red-500">*</span>
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
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter Name"
                />

                {errors.name && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>

            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Address 1 */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Address 1
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  {...register("addr1")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.addr1 ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter addr1"
                />

                {errors.addr1 && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.addr1.message}
                  </p>
                )}
              </div>

              {/* Address 2 */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Address 2
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  {...register("addr2")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.addr2 ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter addr2"
                />

                {errors.addr2 && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.addr2.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">

              {/* Address 3 */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Address 3
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  {...register("addr3")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.addr3 ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter addr3"
                />

                {errors.addr3 && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.addr3.message}
                  </p>
                )}
              </div>

              {/* GST */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  GST
                </label>

                <input
                  type="text"
                  {...register("gstin")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.contperson ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter gstin"
                />

                {errors.gstin && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.gstin.message}
                  </p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Mobile No
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  {...register("mobno")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.mobno ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter mobno"
                />

                {errors.mobno && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.mobno.message}
                  </p>
                )}
              </div>


            </div>

            <div className="grid grid-cols-1 gap-3">

              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Phone No.
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  {...register("phno")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.phno ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter phno"
                />

                {errors.phno && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.phno.message}
                  </p>
                )}
              </div>
              {/* email */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Email
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  {...register("email")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter email"
                />

                {errors.email && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              {/* Contact Person */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Contact Person
                </label>

                <input
                  type="text"
                  {...register("contperson")}
                  disabled={isReadOnly}
                  className={`w-full border rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors.gstin ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter contperson"
                />

                {errors.contperson && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.contperson.message}
                  </p>
                )}
              </div>

            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t p-2 flex justify-end gap-4 bg-gray-50">
          {mode !== "View" && mode !== "Print" && (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${isDeleteMode ? "delete-btn" : "primary-btn"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting
                ? isDeleteMode
                  ? "Deleting..."
                  : "Saving..."
                : isDeleteMode
                  ? "Delete"
                  : "Save"}
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
          visible={isSubmitting || isLoadingTransporter}
          showIndicator
        />
      </form>
    </Popup>
  );
}