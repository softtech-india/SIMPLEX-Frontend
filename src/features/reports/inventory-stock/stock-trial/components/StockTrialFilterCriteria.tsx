import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Eye } from "lucide-react";
import InlineSelectField from "@/common/components/InlineSelectField";
import { useQuery } from "@tanstack/react-query";
import { stockTrialService } from "../services/stockTrialService";
import { StockTrialFilterState } from "../types/stockTrial.types";
import { LoadPanel, Popup, SelectBox, TagBox } from "devextreme-react";
import { DEFAULT_STOCK_TRIAL_FILTER } from "../constants/stockTrialDefaults";
import { fetchBranchList } from "@/api/master/ledger-api";
import useUserStore from "@/store/userStore";

interface StockTrialFilterCriteriaProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: Partial<StockTrialFilterState>) => void;
    onClear: () => void;
    filterParams: StockTrialFilterState;
    localFilters: Partial<StockTrialFilterState>;
    setLocalFilters: React.Dispatch<React.SetStateAction<Partial<StockTrialFilterState>>>;
}

const printrtvalOptions = [
    { id: 1, name: "No" },
    { id: 0, name: "Yes" },
];

const balancetagOptions = [
    { id: 0, name: "Only Balance" },
    { id: 1, name: "All" },
];

const StockTrialFilterCriteria: React.FC<StockTrialFilterCriteriaProps> = ({
    visible,
    onClose,
    onApply,
    onClear,
    filterParams,
    localFilters,
    setLocalFilters
}) => {
    const { userId, companyId, branchId } = useUserStore();
    const today = new Date().toISOString().split('T')[0];

    // API calls for dropdown options
    const { data: branchOptions = [] } = useQuery({
        queryKey: ["branchOptions"],
        queryFn: () => fetchBranchList(userId, companyId),
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

    const { data: brandsOptions = [] } = useQuery({
        queryKey: ["brandsOptions"],
        queryFn: () => stockTrialService.getAllBrands(),
        staleTime: 0,
        enabled: true,
        retry: 1,
        refetchOnWindowFocus: true
    });

    const { data: classOptions = [] } = useQuery({
        queryKey: ["classOptions"],
        queryFn: () => stockTrialService.getAllClasses(),
        staleTime: 0,
        enabled: true,
        retry: 1,
        refetchOnWindowFocus: true
    });

    const { data: subClassOptions = [] } = useQuery({
        queryKey: ["subClassOptions"],
        queryFn: () => stockTrialService.getAllSubClasses(),
        staleTime: 0,
        enabled: true,
        retry: 1,
        refetchOnWindowFocus: true
    });

    const { data: godownOptions = [] } = useQuery({
        queryKey: ["godownOptions", localFilters.branchid ?? filterParams.branchid],
        queryFn: () => stockTrialService.getAllGodown(String(localFilters.branchid ?? filterParams.branchid)),
        enabled: !!(localFilters.branchid ?? filterParams.branchid),
        staleTime: 0,
        retry: 1,
        refetchOnWindowFocus: true
    });

    const [isLoading, setIsLoading] = useState(false);

    // Initialize local filters ONLY when popup first opens and localFilters is empty
    useEffect(() => {
        if (visible && Object.keys(localFilters).length === 0) {
            setLocalFilters({
                ...DEFAULT_STOCK_TRIAL_FILTER,
                branchid: Number(branchId), // Set default branch from localStorage
                startdt: today, // Set default to today
                enddt: today, // Set default to today
            });
        }
    }, [visible, setLocalFilters, localFilters, branchId, today]);

    const handleClear = useCallback(() => {
        setLocalFilters({
            ...DEFAULT_STOCK_TRIAL_FILTER,
            branchid: Number(branchId), // Keep default branch from localStorage on clear
            startdt: today, // Reset to today
            enddt: today, // Reset to today
        });
        onClear();
    }, [onClear, setLocalFilters, branchId, today]);

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
            startdt: e.target.value || today
        }));
    }, [setLocalFilters, today]);

    const handleEndDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalFilters(prev => ({
            ...prev,
            enddt: e.target.value || today
        }));
    }, [setLocalFilters, today]);

    const handlePrintrtvalChange = useCallback((e: any) => {
        setLocalFilters(prev => ({
            ...prev,
            printrtval: e.value
        }));
    }, [setLocalFilters]);

    const handleBalancetagChange = useCallback((e: any) => {
        setLocalFilters(prev => ({
            ...prev,
            balancetag: e.value
        }));
    }, [setLocalFilters]);

    const handleBranchChange = useCallback((e: any) => {
        setLocalFilters(prev => ({
            ...prev,
            branchid: e.value
        }));
    }, [setLocalFilters]);

    const handleTagBoxChange = useCallback(
        (value: number[], fieldName: keyof StockTrialFilterState) => {
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
        return value
            .split(',')
            .map(v => Number(v))
            .filter(v => !isNaN(v));
    }, []);

    // Use localFilters directly without falling back to filterParams
    const startdtValue = localFilters.startdt ?? today;
    const enddtValue = localFilters.enddt ?? today;
    const printrtvalValue = localFilters.printrtval ?? 1;
    const balancetagValue = localFilters.balancetag ?? 1;
    const branchidValue = localFilters.branchid ?? Number(branchId);
    const strbrandValue = useMemo(() => getTagBoxValue(localFilters.strbrand), [localFilters.strbrand, getTagBoxValue]);
    const strclassValue = useMemo(() => getTagBoxValue(localFilters.strclass), [localFilters.strclass, getTagBoxValue]);
    const strsubclassValue = useMemo(() => getTagBoxValue(localFilters.strsubclass), [localFilters.strsubclass, getTagBoxValue]);
    const strgodownValue = useMemo(() => getTagBoxValue(localFilters.strgodown), [localFilters.strgodown, getTagBoxValue]);

    return (
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
                    {/* Branch */}
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

                    {/* Date Range */}
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <InlineSelectField label="From Date">
                                <div className="ml-8">
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
                            <InlineSelectField label="To Date">
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

                    {/* Brand */}
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

                    {/* Class */}
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

                    {/* Sub Class */}
                    <InlineSelectField label="Sub Class">
                        <div className="ml-8">
                            <TagBox
                                dataSource={subClassOptions}
                                valueExpr="id"
                                displayExpr="name"
                                searchEnabled={true}
                                showSelectionControls={true}
                                applyValueMode="instantly"
                                value={strsubclassValue}
                                onValueChanged={(e) => handleTagBoxChange(e.value, 'strsubclass')}
                            />
                        </div>
                    </InlineSelectField>

                    {/* Godown */}
                    <InlineSelectField label="Godown">
                        <div className="ml-8">
                            <TagBox
                                dataSource={godownOptions}
                                valueExpr="id"
                                displayExpr="name"
                                searchEnabled={true}
                                showSelectionControls={true}
                                applyValueMode="instantly"
                                value={strgodownValue}
                                onValueChanged={(e) => handleTagBoxChange(e.value, 'strgodown')}
                            />
                        </div>
                    </InlineSelectField>

                    <div className="flex gap-4">
                        {/* Print Rate Value */}
                        <div className="w-1/2">
                            <InlineSelectField label="Print Rate Value">
                                <div className="ml-0">
                                    <SelectBox
                                        dataSource={printrtvalOptions}
                                        valueExpr="id"
                                        displayExpr="name"
                                        value={printrtvalValue}
                                        onValueChanged={handlePrintrtvalChange}
                                        placeholder="Select"
                                        searchEnabled={false}
                                        className="w-full"
                                    />
                                </div>
                            </InlineSelectField>
                        </div>

                        {/* Balance tag */}
                        <div className="w-1/2">
                            <InlineSelectField label="Balance Tag">
                                <div className="ml-8">
                                    <SelectBox
                                        dataSource={balancetagOptions}
                                        displayExpr="name"
                                        valueExpr="id"
                                        value={balancetagValue}
                                        onValueChanged={handleBalancetagChange}
                                        placeholder="Select"
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

export default StockTrialFilterCriteria;