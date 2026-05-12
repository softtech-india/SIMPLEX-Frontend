import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Eye, X } from "lucide-react";
import InlineSelectField from "@/common/components/InlineSelectField";
import { useQuery } from "@tanstack/react-query";
import { saleRegisterService } from "../services/saleRegister.service";
import { SaleRegisterFilterState } from "../types/saleRegister.type";
import { LoadPanel, Popup, SelectBox, TagBox } from "devextreme-react";
import { DEFAULT_SALE_REGISTER_FILTER } from "../constants/saleRegisterTrialDefaults";

interface SaleRegisterFilterCriteriaProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: Partial<SaleRegisterFilterState>) => void;
    onClear: () => void;
    filterParams: SaleRegisterFilterState;
    localFilters: Partial<SaleRegisterFilterState>;
    setLocalFilters: React.Dispatch<React.SetStateAction<Partial<SaleRegisterFilterState>>>;
}

const sortByOptions = [
    { id: 0, name: "Bill Date" },
    { id: 1, name: "Bill No" },
];
const withProductOptions = [
    { id: 0, name: "No" },
    { id: 1, name: "Yes" },
];

const SaleRegisterFilterCriteria: React.FC<SaleRegisterFilterCriteriaProps> = ({
    visible,
    onClose,
    onApply,
    onClear,
    filterParams,
    localFilters,
    setLocalFilters
}) => {

    // API calls for dropdown options
    const { data: branchOptions = [] } = useQuery({
        queryKey: ["branchOptions"],
        queryFn: () => saleRegisterService.getAllBranches(),
        staleTime: 0,
        enabled: true,
        retry: 1,
        refetchOnWindowFocus: true,
        select: (data) =>
            (data ?? []).map((s: any) => ({
                value: s.id,
                name: s.name,
            })),
    });

    const { data: stateOptions = [] } = useQuery({
        queryKey: ["stateOptions"],
        queryFn: () => saleRegisterService.getAllStates(),
        staleTime: 0,
        enabled: true,
        retry: 1,
        refetchOnWindowFocus: true,
        select: (data) =>
            (data ?? []).map((s: any) => ({
                value: s.id,
                name: s.state,
            })),
    });

    const [isLoading, setIsLoading] = useState(false);

    // Initialize local filters ONLY when popup first opens and localFilters is empty
    useEffect(() => {
        if (visible && Object.keys(localFilters).length === 0) {
            setLocalFilters(DEFAULT_SALE_REGISTER_FILTER);
        }
    }, [visible, setLocalFilters]);

    const handleClear = useCallback(() => {
        setLocalFilters(DEFAULT_SALE_REGISTER_FILTER);
        onClear();
    }, [onClear, setLocalFilters]);

    const handleApply = useCallback(async () => {
        setIsLoading(true);
        try {
            // Create a copy of filters without the core fields
            const { userid, compid, finid, ...filterData } = localFilters;

            // Filter out undefined values
            const cleanedFilters = Object.fromEntries(
                Object.entries(filterData).filter(([_, value]) => value !== undefined && value !== null && value !== '')
            );

            await onApply(cleanedFilters);
            onClose();
        } finally {
            setIsLoading(false);
        }
    }, [localFilters, onApply, onClose]);



    // Handlers for individual field changes - directly update localFilters
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

    const handleSortByChange = useCallback((e: any) => {
        setLocalFilters(prev => ({
            ...prev,
            sortby: e.value
        }));
    }, [setLocalFilters]);

    const handleWithProductChange = useCallback((e: any) => {
        setLocalFilters(prev => ({
            ...prev,
            withProduct: e.value
        }));
    }, [setLocalFilters]);

    const handleBranchChange = useCallback((e: any) => {
        console.log("Branch selected:", e.value); // Debug log
        setLocalFilters(prev => {
            const updated = {
                ...prev,
                branchid: e.value
            };
            console.log("Updated localFilters:", updated); // Debug log
            return updated;
        });
    }, [setLocalFilters]);

    const handleStateChange = useCallback((e: any) => {
        console.log("State selected:", e.value); // Debug log
        setLocalFilters(prev => {
            const updated = {
                ...prev,
                stateid: e.value
            };
            console.log("Updated localFilters:", updated); // Debug log
            return updated;
        });
    }, [setLocalFilters]);

    // Use localFilters directly without falling back to filterParams
    const startdtValue = localFilters.startdt ?? "";
    const enddtValue = localFilters.enddt ?? "";
    const sortbyValue = localFilters.sortby ?? 1;
    const withProductValue = localFilters.withProduct ?? 0;
    const branchidValue = localFilters.branchid;
    const stateidValue = localFilters.stateid ?? 0;

    return (
        <Popup
            visible={visible}
            onHiding={onClose}
            title="Filter Criteria"
            width="600px"
            height="auto"
            dragEnabled
            showTitle
            showCloseButton={true}
        >
            <div className="p-4">
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <div className="w-full">
                            {/* State */}
                            <InlineSelectField label="State">
                                <div className="ml-14">
                                    <SelectBox
                                        dataSource={stateOptions}
                                        valueExpr="value"
                                        displayExpr="name"
                                        value={stateidValue}
                                        onValueChanged={handleStateChange}
                                        placeholder="Select State"
                                        searchEnabled={true}
                                        showClearButton={true}
                                        className="w-full"
                                    />
                                </div>
                            </InlineSelectField>
                        </div>
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


                    <div className="flex gap-2">
                        <div className="w-1/2">
                            {/* From Date */}
                            <InlineSelectField label="From">
                                <div className="ml-14">
                                    <input
                                        type="date"
                                        name="startdt"
                                        value={startdtValue}
                                        onChange={handleStartDateChange}
                                        className="w-full border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                            </InlineSelectField>

                        </div>
                        <div className="w-1/2">
                            {/* To Date */}
                            <InlineSelectField label="To">
                                <div className="ml-10">
                                    <input
                                        type="date"
                                        name="enddt"
                                        value={enddtValue}
                                        onChange={handleEndDateChange}
                                        className="w-full border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                            </InlineSelectField>


                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="w-1/2">
                            {/* With Product */}
                            <InlineSelectField label="With Product">
                                <div className="ml-2">
                                    <SelectBox
                                        dataSource={withProductOptions}
                                        valueExpr="id"
                                        displayExpr="name"
                                        value={withProductValue}  // ✅ Use the value variable
                                        onValueChanged={handleWithProductChange}  // ✅ Use proper handler
                                        placeholder="Select with product"
                                        searchEnabled={false}
                                        className="w-full"
                                    />
                                </div>
                            </InlineSelectField>

                        </div>
                        <div className="w-1/2">
                            {/* Sort By */}
                            <InlineSelectField label="Sort By">
                                <div className="ml-2">
                                    <SelectBox
                                        dataSource={sortByOptions}
                                        valueExpr="id"
                                        displayExpr="name"
                                        value={sortbyValue}
                                        onValueChanged={handleSortByChange}
                                        placeholder="Select Sort Option"
                                        searchEnabled={false}
                                        className="w-full"
                                    />
                                </div>
                            </InlineSelectField>
                        </div>
                    </div>


                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 mt-6 pt-3 border-t">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="secondary-btn px-4 py-2"
                    >
                        Clear
                    </button>
                    <button
                        type="button"
                        onClick={handleApply}
                        className="primary-btn px-4 py-2"
                    >
                        <Eye size={16} className="inline mr-2" />
                        Run Report
                    </button>
                </div>

                <LoadPanel
                    shadingColor="rgba(0,0,0,0.4)"
                    visible={isLoading}
                    showIndicator={true}
                />
            </div>
        </Popup>
    );
};

export default SaleRegisterFilterCriteria;