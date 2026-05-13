// app/sales-order-register/components/GRNFilterCriteria.tsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Eye, X } from "lucide-react";
import InlineSelectField from "@/common/components/InlineSelectField";
import { useQuery } from "@tanstack/react-query";
import { grnService } from "../services/grnRegisterService.service";
import { GRNFilterState } from "../types/grnRegister.type";
import { LoadPanel, Popup, SelectBox, TagBox } from "devextreme-react";
import { useGRNBrands, useGRNClasses, useGRNStates } from "../hooks/useGrnRegister";
import SearchModal from "@/common/components/SearchModal";
import { fetchBranchList } from "@/api/master/ledger-api";
import useUserStore from "@/store/userStore";
import { storageService } from "@/common/utility/storageService";

const stateId = storageService.getItem('stateid');

const DEFAULT_GRN_FILTER: Partial<GRNFilterState> = {
    strbrand: '',
    strclass: '',
    strparty: '',
    stateid: Number(stateId) || 0,
    branchid: 0,
    startdt: new Date().toISOString().split('T')[0],
    enddt: new Date().toISOString().split('T')[0],
};

interface GRNFilterCriteriaProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: Partial<GRNFilterState>) => void;
    onClear: () => void;
    filterParams: GRNFilterState;
    localFilters: Partial<GRNFilterState>;
    setLocalFilters: React.Dispatch<React.SetStateAction<Partial<GRNFilterState>>>;
    userId: number;
    companyId: number;
}

const GRNFilterCriteria: React.FC<GRNFilterCriteriaProps> = ({
    visible,
    onClose,
    onApply,
    onClear,
    filterParams,
    localFilters,
    setLocalFilters,
    userId,
    companyId
}) => {
    const { data: brandsOptions = [] } = useGRNBrands();
    const { data: classOptions = [] } = useGRNClasses();
    const { data: stateOptions = [] } = useGRNStates();
    const { branchId } = useUserStore();

    const { data: branchOptions = [] } = useQuery({
        queryKey: ["grn-branchOptions", userId, companyId],
        queryFn: () => fetchBranchList(userId, companyId),
        staleTime: 0,
        enabled: !!companyId && !!userId,
        retry: 1,
        refetchOnWindowFocus: true,
        select: (data) =>
            (data ?? []).map((s: any) => ({
                value: s.id,
                name: s.name,
            })),
    });

    const [isLoading, setIsLoading] = useState(false);
    const [vendorModalOpen, setVendorModalOpen] = useState(false);
    const [selectedVendorName, setSelectedVendorName] = useState<string>("");

    useEffect(() => {
        if (visible && Object.keys(localFilters).length === 0) {
            setLocalFilters({
                ...DEFAULT_GRN_FILTER,
                branchid: Number(branchId)
            });
        }
    }, [visible, setLocalFilters, localFilters, branchId]);

    useEffect(() => {
        if (localFilters.strparty && localFilters.strparty !== '') {
            if (!selectedVendorName && localFilters.strparty !== '0') {
                const fetchVendorName = async () => {
                    try {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}/vendor/${localFilters.strparty}?userid=${userId}&compid=${companyId}`);
                        const data = await response.json();
                        if (data.success && data.data) {
                            setSelectedVendorName(data.data.name);
                        }
                    } catch (error) {
                        console.error("Error fetching vendor name:", error);
                    }
                };
                fetchVendorName();
            }
        } else {
            setSelectedVendorName("");
        }
    }, [localFilters.strparty, userId, companyId, selectedVendorName]);

    const handleApply = useCallback(async () => {
        setIsLoading(true);
        try {
            const { userid, compid, finid, ...filterData } = localFilters as any;

            const cleanedFilters = Object.fromEntries(
                Object.entries(filterData).filter(([_, value]) => value !== undefined && value !== null && value !== '')
            );

            await onApply(cleanedFilters);
            onClose();
        } finally {
            setIsLoading(false);
        }
    }, [localFilters, onApply, onClose]);

    const handleClear = useCallback(() => {
        setLocalFilters({
            ...DEFAULT_GRN_FILTER,
            branchid: Number(branchId)
        });
        setSelectedVendorName("");
        onClear();
    }, [onClear, setLocalFilters, branchId]);

    const handleTagBoxChange = useCallback(
        (value: number[], fieldName: keyof GRNFilterState) => {
            const commaSeparatedValue = value.length > 0 ? value.join(',') : '';
            setLocalFilters(prev => ({
                ...prev,
                [fieldName]: commaSeparatedValue
            }));
        },
        [setLocalFilters]
    );

    const getTagBoxValue = useCallback((value: string | undefined): number[] => {
        if (!value || value === '') return [];
        return value.split(',').map(v => Number(v)).filter(v => !isNaN(v));
    }, []);

    const handleStartDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalFilters(prev => ({
            ...prev,
            startdt: e.target.value || undefined
        }));
    }, [setLocalFilters]);

    const handleEndDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalFilters(prev => ({
            ...prev,
            enddt: e.target.value || undefined
        }));
    }, [setLocalFilters]);

    const handleBranchChange = useCallback((e: any) => {
        setLocalFilters(prev => ({
            ...prev,
            branchid: e.value
        }));
    }, [setLocalFilters]);

    const handleStateChange = useCallback((e: any) => {
        setLocalFilters(prev => ({
            ...prev,
            stateid: e.value
        }));
    }, [setLocalFilters]);

    const handleVendorClear = useCallback(() => {
        setLocalFilters(prev => ({
            ...prev,
            strparty: ''
        }));
        setSelectedVendorName("");
    }, [setLocalFilters]);

    const baseVendorParams = {
        userid: userId,
        compid: companyId,
    };

    const searchVendorColumns = [
        { key: "name", label: "Vendor Name" },
        { key: "code", label: "Vendor Code" },
        { key: "mobile", label: "Mobile No" },
        { key: "subledgertypenm", label: "Vendor Type" },
        { key: "ledgergroupnm", label: "Group" },
        { key: "gstin", label: "GSTIN" },
        { key: "email", label: "Email" },
    ];

    const searchVendorFields = [
        { value: "name", label: "Name" },
        { value: "code", label: "Code" },
        { value: "mobile", label: "Mobile" },
        { value: "gstin", label: "GSTIN" },
        { value: "email", label: "Email" },
    ];

    const handleVendorSelect = (row: any) => {
        setLocalFilters(prev => ({
            ...prev,
            strparty: String(row.id)
        }));
        setSelectedVendorName(row.name);
        setVendorModalOpen(false);
    };

    const strbrandValue = useMemo(() => getTagBoxValue(localFilters.strbrand ?? ''), [localFilters.strbrand, getTagBoxValue]);
    const strclassValue = useMemo(() => getTagBoxValue(localFilters.strclass ?? ''), [localFilters.strclass, getTagBoxValue]);
    const startdtValue = localFilters.startdt ?? "";
    const enddtValue = localFilters.enddt ?? "";
    const branchidValue = localFilters.branchid ?? branchId;
    const stateidValue = Number(stateId) | 0;

    return (
        <>
            <Popup
                visible={visible}
                onHiding={onClose}
                title="Filter Criteria"
                width="650px"
                height="auto"
                dragEnabled
                showTitle
                showCloseButton={true}
            >
                <div className="p-4">
                    <div className="space-y-4">
                        <div className="">
                            <InlineSelectField label="State">
                                <div className="ml-14">
                                    <SelectBox
                                        dataSource={stateOptions}
                                        valueExpr="id"
                                        displayExpr="state"
                                        value={stateidValue}
                                        onValueChanged={handleStateChange}
                                        placeholder="Select State"
                                        searchEnabled={true}
                                        showClearButton={true}
                                    />
                                </div>
                            </InlineSelectField>
                        </div>

                        <div className="w-full">
                            <InlineSelectField label="Branch">
                                <div className="ml-11">
                                    <SelectBox
                                        dataSource={branchOptions}
                                        valueExpr="value"
                                        displayExpr="name"
                                        value={branchidValue}
                                        onValueChanged={handleBranchChange}
                                        placeholder="Select Branch"
                                        searchEnabled={true}
                                        showClearButton={true}
                                        className="w-full"
                                    />
                                </div>
                            </InlineSelectField>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <InlineSelectField label="From">
                                    <div className="ml-14">
                                        <input
                                            type="date"
                                            value={startdtValue}
                                            onChange={handleStartDateChange}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>
                                </InlineSelectField>
                            </div>
                            <div className="w-1/2">
                                <InlineSelectField label="To">
                                    <div className="ml-10">
                                        <input
                                            type="date"
                                            value={enddtValue}
                                            onChange={handleEndDateChange}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>
                                </InlineSelectField>
                            </div>
                        </div>

                        <InlineSelectField label="Brand">
                            <div className="ml-13">
                                <TagBox
                                    dataSource={brandsOptions}
                                    valueExpr="id"
                                    displayExpr="name"
                                    searchEnabled={true}
                                    showSelectionControls={true}
                                    applyValueMode="instantly"
                                    value={strbrandValue}
                                    onValueChanged={(e) => handleTagBoxChange(e.value, 'strbrand')}
                                />
                            </div>
                        </InlineSelectField>

                        <InlineSelectField label="Class">
                            <div className="ml-15">
                                <TagBox
                                    dataSource={classOptions}
                                    valueExpr="id"
                                    displayExpr="name"
                                    searchEnabled={true}
                                    showSelectionControls={true}
                                    applyValueMode="instantly"
                                    value={strclassValue}
                                    onValueChanged={(e) => handleTagBoxChange(e.value, 'strclass')}
                                />
                            </div>
                        </InlineSelectField>

                        <div className="flex gap-4">
                            <div className="w-full">
                                <InlineSelectField label="Vendor">
                                    <div className="ml-12">
                                        <div className="relative flex gap-2">
                                            <div className="relative flex-1">
                                                <input
                                                    type="text"
                                                    value={selectedVendorName || ''}
                                                    readOnly
                                                    onClick={() => setVendorModalOpen(true)}
                                                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer bg-white pr-8"
                                                    placeholder="Select Vendor"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setVendorModalOpen(true)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    🔍
                                                </button>
                                            </div>
                                            {selectedVendorName && (
                                                <button
                                                    type="button"
                                                    onClick={handleVendorClear}
                                                    className="px-2 py-1.5 text-red-600 hover:text-red-800 border border-gray-300 rounded-md hover:bg-red-50 transition-colors"
                                                    title="Clear Vendor"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </InlineSelectField>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-3 border-t">
                        <button type="button" onClick={handleClear} className="secondary-btn px-4 py-2">
                            Clear
                        </button>
                        <button type="button" onClick={handleApply} className="primary-btn px-4 py-2">
                            <Eye size={16} className="inline mr-2" />
                            Run Report
                        </button>
                    </div>

                    <LoadPanel shadingColor="rgba(0,0,0,0.4)" visible={isLoading} showIndicator={true} />
                </div>
            </Popup>

            <SearchModal
                open={vendorModalOpen}
                onClose={() => setVendorModalOpen(false)}
                endpoint="vendor"
                baseParams={baseVendorParams}
                columns={searchVendorColumns}
                searchFields={searchVendorFields}
                onSelect={handleVendorSelect}
            />
        </>
    );
};

export default GRNFilterCriteria;