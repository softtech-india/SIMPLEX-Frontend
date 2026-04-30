// StockTrialFilterCriteria.tsx - Updated with comma-separated values

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Eye, X } from "lucide-react";
import InlineSelectField from "@/common/components/InlineSelectField";
import CustomSelectBox from "@/common/components/sharedComponents/CustomSelectBox";
import { useQuery } from "@tanstack/react-query";
import { stockTrialService } from "../services/stockTrialService";
import { StockTrialFilterState } from "../types/stockTrial.types";
import { LoadPanel, Popup, TagBox } from "devextreme-react";

interface StockTrialFilterCriteriaProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: Partial<StockTrialFilterState>) => void;
    onClear: () => void;
    filterParams: StockTrialFilterState;
}

const printrtvalOptions = [
    { id: 0, name: "No" },
    { id: 1, name: "Yes" },
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
    filterParams
}) => {
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
        queryKey: ["godownOptions", filterParams.branchid],
        queryFn: () => stockTrialService.getAllGodown(String(filterParams.branchid)),
        enabled: !!filterParams.branchid,
        staleTime: 0,
        retry: 1,
        refetchOnWindowFocus: true
    });

    // Local state for form values before applying
    const [localFilters, setLocalFilters] = useState<Partial<StockTrialFilterState>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Initialize local filters when popup opens
    useEffect(() => {
        if (visible) {
            setLocalFilters({
                printrtval: filterParams.printrtval,
                strbrand: filterParams.strbrand,
                strclass: filterParams.strclass,
                strsubclass: filterParams.strsubclass,
                balancetag: filterParams.balancetag,
                strgodown: filterParams.strgodown,
            });
        }
    }, [visible]);

    const handleApply = useCallback(async () => {
        setIsLoading(true);
        try {
            await onApply(localFilters);
            onClose();
        } finally {
            setIsLoading(false);
        }
    }, [localFilters, onApply, onClose]);

    const handleClear = useCallback(() => {
        const clearedFilters = {
            printrtval: 0,
            strbrand: '',  // Empty string for comma-separated
            strclass: '',   // Empty string for comma-separated
            strsubclass: '', // Empty string for comma-separated
            balancetag: 1,
            strgodown: '',   // Empty string for comma-separated
        };
        setLocalFilters(clearedFilters);
        onClear();
    }, [onClear]);

    // Helper to convert array of selected IDs to comma-separated string
    const handleTagBoxChange = useCallback((value: any[], fieldName: keyof StockTrialFilterState) => {
        // Join with comma instead of space
        const commaSeparatedValue = value.length > 0 ? value.join(',') : '';
        setLocalFilters(prev => ({
            ...prev,
            [fieldName]: commaSeparatedValue
        }));
    }, []);

    // Helper to convert comma-separated string to array for TagBox
    const getTagBoxValue = useCallback((value: string | undefined): any[] => {
        if (!value || value === '') return [];
        // Split by comma instead of space
        return value.split(',').filter(v => v.trim() !== '');
    }, []);

    // Memoized handlers for select boxes to prevent re-renders
    const handlePrintrtvalChange = useCallback((e: any) => {
        setLocalFilters(prev => ({ ...prev, printrtval: e.value }));
    }, []);

    const handleBalancetagChange = useCallback((e: any) => {
        setLocalFilters(prev => ({ ...prev, balancetag: e.value }));
    }, []);

    // Memoized values to prevent unnecessary re-renders
    const printrtvalValue = useMemo(() => localFilters.printrtval ?? filterParams.printrtval, [localFilters.printrtval, filterParams.printrtval]);
    const balancetagValue = useMemo(() => localFilters.balancetag ?? filterParams.balancetag, [localFilters.balancetag, filterParams.balancetag]);
    const strbrandValue = useMemo(() => getTagBoxValue(localFilters.strbrand ?? filterParams.strbrand), [localFilters.strbrand, filterParams.strbrand, getTagBoxValue]);
    const strclassValue = useMemo(() => getTagBoxValue(localFilters.strclass ?? filterParams.strclass), [localFilters.strclass, filterParams.strclass, getTagBoxValue]);
    const strsubclassValue = useMemo(() => getTagBoxValue(localFilters.strsubclass ?? filterParams.strsubclass), [localFilters.strsubclass, filterParams.strsubclass, getTagBoxValue]);
    const strgodownValue = useMemo(() => getTagBoxValue(localFilters.strgodown ?? filterParams.strgodown), [localFilters.strgodown, filterParams.strgodown, getTagBoxValue]);

    return (
        <Popup
            visible={visible}
            onHiding={onClose}
            title="Filter Criteria"
            width="500px"
            height="auto"
            dragEnabled
            showTitle
            showCloseButton={true}
        >
            <div className="p-4">
                <div className="space-y-4">
                    {/* Print Rate Value */}
                    <InlineSelectField label="Print Rate Value">
                        <div className="ml-10">
                            <CustomSelectBox
                                dataSource={printrtvalOptions}
                                displayExpr="name"
                                valueExpr="id"
                                value={printrtvalValue}
                                onValueChanged={handlePrintrtvalChange}
                                placeholder="Select"
                                className="w-full text-sm bg-transparent"
                            />
                        </div>
                    </InlineSelectField>

                    {/* Balance tag */}
                    <InlineSelectField label="Balance Tag">
                        <div className="ml-10">
                            <CustomSelectBox
                                dataSource={balancetagOptions}
                                displayExpr="name"
                                valueExpr="id"
                                value={balancetagValue}
                                onValueChanged={handleBalancetagChange}
                                placeholder="Select"
                                className="w-full text-sm bg-transparent"
                            />
                        </div>
                    </InlineSelectField>

                    {/* Brand */}
                    <div className="dx-field">
                        <div className="dx-field-label">Brand</div>
                        <div className="dx-field-value">
                            <TagBox
                                dataSource={brandsOptions}
                                valueExpr="id"
                                displayExpr="name"
                                placeholder="Select Brand..."
                                showSelectionControls={true}
                                applyValueMode="useButtons"
                                searchEnabled={true}
                                value={strbrandValue}
                                onValueChanged={(e) => handleTagBoxChange(e.value, 'strbrand')}
                            />
                        </div>
                    </div>

                    {/* Class */}
                    <div className="dx-field">
                        <div className="dx-field-label">Class</div>
                        <div className="dx-field-value">
                            <TagBox
                                dataSource={classOptions}
                                valueExpr="id"
                                displayExpr="name"
                                placeholder="Select Class..."
                                showSelectionControls={true}
                                applyValueMode="useButtons"
                                searchEnabled={true}
                                value={strclassValue}
                                onValueChanged={(e) => handleTagBoxChange(e.value, 'strclass')}
                            />
                        </div>
                    </div>

                    {/* Sub Class */}
                    <div className="dx-field">
                        <div className="dx-field-label">Sub Class</div>
                        <div className="dx-field-value">
                            <TagBox
                                dataSource={subClassOptions}
                                valueExpr="id"
                                displayExpr="name"
                                placeholder="Select sub class..."
                                showSelectionControls={true}
                                applyValueMode="useButtons"
                                searchEnabled={true}
                                value={strsubclassValue}
                                onValueChanged={(e) => handleTagBoxChange(e.value, 'strsubclass')}
                            />
                        </div>
                    </div>

                    {/* Godown */}
                    <div className="dx-field">
                        <div className="dx-field-label">Godown</div>
                        <div className="dx-field-value">
                            <TagBox
                                dataSource={godownOptions}
                                valueExpr="id"
                                displayExpr="name"
                                placeholder="Select Godown..."
                                showSelectionControls={true}
                                applyValueMode="useButtons"
                                searchEnabled={true}
                                value={strgodownValue}
                                onValueChanged={(e) => handleTagBoxChange(e.value, 'strgodown')}
                            />
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