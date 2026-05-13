import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Eye, X } from "lucide-react";
import InlineSelectField from "@/common/components/InlineSelectField";
import { useQuery } from "@tanstack/react-query";
import { purchaseOrderService } from "../services/purchaseOrderService.service";
import { PurchaseOrderFilterState } from "../types/purchaseOrder.type";
import { LoadPanel, Popup, SelectBox, TagBox } from "devextreme-react";
import { SORT_BY_OPTIONS, ORDER_STATUS_OPTIONS } from "../constants/purchaseOrderDefaults";
import { useBrands, useClasses, useSubClasses, useStates } from "../hooks/usePurchaseOrder";
import SearchModal from "@/common/components/SearchModal";
import { fetchBranchList } from "@/api/master/ledger-api";
import useUserStore from "@/store/userStore";
import { storageService } from "@/common/utility/storageService";

// Create a default filter
const stateId = storageService.getItem('stateid');

const DEFAULT_PURCHASE_ORDER_FILTER: Partial<PurchaseOrderFilterState> = {
    strbrand: '',
    strclass: '',
    strsubclass: '',
    sortby: 0,
    stateid: Number(stateId) | 0,
    partyid: 0,
    orderstatus: 0,
    branchid: 0,
    startdt: new Date().toISOString().split('T')[0],
    enddt: new Date().toISOString().split('T')[0],
};

interface PurchaseOrderFilterCriteriaProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: Partial<PurchaseOrderFilterState>) => void;
    onClear: () => void;
    filterParams: PurchaseOrderFilterState;
    localFilters: Partial<PurchaseOrderFilterState>;
    setLocalFilters: React.Dispatch<React.SetStateAction<Partial<PurchaseOrderFilterState>>>;
    userId: number;
    companyId: number;
}

const PurchaseOrderFilterCriteria: React.FC<PurchaseOrderFilterCriteriaProps> = ({
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
    const { data: brandsOptions = [] } = useBrands();
    const { data: classOptions = [] } = useClasses();
    const { data: subClassOptions = [] } = useSubClasses();
    const { data: stateOptions = [] } = useStates();
    const { branchId } = useUserStore();

    // Fetch branch options
    const { data: branchOptions = [] } = useQuery({
        queryKey: ["branchOptions", userId, companyId],
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
    const [partyModalOpen, setPartyModalOpen] = useState(false);
    const [selectedPartyName, setSelectedPartyName] = useState<string>("");

    // Initialize local filters when popup opens
    useEffect(() => {
        if (visible && Object.keys(localFilters).length === 0) {
            setLocalFilters({
                ...DEFAULT_PURCHASE_ORDER_FILTER,
                branchid: Number(branchId)
            });
        }
    }, [visible, setLocalFilters, localFilters, branchId]);

    // Set party name when partyid changes
    useEffect(() => {
        if (localFilters.partyid && localFilters.partyid !== 0) {
            if (!selectedPartyName) {
                const fetchPartyName = async () => {
                    try {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}/vendor/${localFilters.partyid}?userid=${userId}&compid=${companyId}`);
                        const data = await response.json();
                        if (data.success && data.data) {
                            setSelectedPartyName(data.data.name);
                        }
                    } catch (error) {
                        console.error("Error fetching party name:", error);
                    }
                };
                fetchPartyName();
            }
        } else {
            setSelectedPartyName("");
        }
    }, [localFilters.partyid, userId, companyId, selectedPartyName]);

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
            ...DEFAULT_PURCHASE_ORDER_FILTER,
            branchid: Number(branchId)
        });
        setSelectedPartyName("");
        onClear();
    }, [onClear, setLocalFilters, branchId]);

    const handleTagBoxChange = useCallback(
        (value: number[], fieldName: keyof PurchaseOrderFilterState) => {
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

    const handleSortByChange = useCallback((e: any) => {
        setLocalFilters(prev => ({
            ...prev,
            sortby: e.value
        }));
    }, [setLocalFilters]);

    const handleOrderStatusChange = useCallback((e: any) => {
        setLocalFilters(prev => ({
            ...prev,
            orderstatus: e.value
        }));
    }, [setLocalFilters]);

    const handleBranchChange = useCallback((e: any) => {
        console.log("Branch selected:", e.value);
        setLocalFilters(prev => ({
            ...prev,
            branchid: e.value
        }));
    }, [setLocalFilters]);

    const handleStateChange = useCallback((e: any) => {
        console.log("State selected:", e.value);
        setLocalFilters(prev => ({
            ...prev,
            stateid: e.value
        }));
    }, [setLocalFilters]);

    // Handle party clear/deselect
    const handlePartyClear = useCallback(() => {
        setLocalFilters(prev => ({
            ...prev,
            partyid: 0
        }));
        setSelectedPartyName("");
    }, [setLocalFilters]);

    // Party search configuration (using vendor endpoint)
    const basePartyParams = {
        userid: userId,
        compid: companyId,
    };

    const searchPartyColumns = [
        { key: "name", label: "Vendor Name" },
        { key: "code", label: "Vendor Code" },
        { key: "mobile", label: "Mobile No" },
        { key: "subledgertypenm", label: "Vendor Type" },
        { key: "ledgergroupnm", label: "Group" },
        { key: "gstin", label: "GSTIN" },
        { key: "email", label: "Email" },
    ];

    const searchPartyFields = [
        { value: "name", label: "Name" },
        { value: "code", label: "Code" },
        { value: "mobile", label: "Mobile" },
        { value: "gstin", label: "GSTIN" },
        { value: "email", label: "Email" },
    ];

    const handlePartySelect = (row: any) => {
        setLocalFilters(prev => ({
            ...prev,
            partyid: row.id
        }));
        setSelectedPartyName(row.name);
        setPartyModalOpen(false);
    };
    const stateId = storageService.getItem('stateid');

    const strbrandValue = useMemo(() => getTagBoxValue(localFilters.strbrand ?? ''), [localFilters.strbrand, getTagBoxValue]);
    const strclassValue = useMemo(() => getTagBoxValue(localFilters.strclass ?? ''), [localFilters.strclass, getTagBoxValue]);
    const strsubclassValue = useMemo(() => getTagBoxValue(localFilters.strsubclass ?? ''), [localFilters.strsubclass, getTagBoxValue]);

    const startdtValue = localFilters.startdt ?? "";
    const enddtValue = localFilters.enddt ?? "";
    const sortbyValue = localFilters.sortby ?? 0;
    const orderstatusValue = localFilters.orderstatus ?? 0;
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
                        {/* Branch Selection */}

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

                        <div className="flex gap-4">


                            {/* Party with Search Modal and Deselect Button */}
                            <div className="w-full">
                                <InlineSelectField label="Party">
                                    <div className="ml-15">
                                        <div className="relative flex gap-2">
                                            <div className="relative flex-1">
                                                <input
                                                    type="text"
                                                    value={selectedPartyName || ''}
                                                    readOnly
                                                    onClick={() => setPartyModalOpen(true)}
                                                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer bg-white pr-8"
                                                    placeholder="Select Party"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setPartyModalOpen(true)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    🔍
                                                </button>
                                            </div>
                                            {selectedPartyName && (
                                                <button
                                                    type="button"
                                                    onClick={handlePartyClear}
                                                    className="px-2 py-1.5 text-red-600 hover:text-red-800 border border-gray-300 rounded-md hover:bg-red-50 transition-colors"
                                                    title="Clear Party"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </InlineSelectField>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {/* Sort By */}
                            <div className="w-1/2">
                                <InlineSelectField label="Sort By">
                                    <div className="ml-12">
                                        <SelectBox
                                            dataSource={SORT_BY_OPTIONS}
                                            valueExpr="id"
                                            displayExpr="name"
                                            value={sortbyValue}
                                            onValueChanged={handleSortByChange}
                                            placeholder="Select Sort Option"
                                        />
                                    </div>
                                </InlineSelectField>
                            </div>

                            {/* Order Status */}
                            <div className="w-1/2">
                                <InlineSelectField label="Order Status">
                                    <div className="ml-2">
                                        <SelectBox
                                            dataSource={ORDER_STATUS_OPTIONS}
                                            valueExpr="id"
                                            displayExpr="name"
                                            value={orderstatusValue}
                                            onValueChanged={handleOrderStatusChange}
                                            placeholder="Select Status"
                                        />
                                    </div>
                                </InlineSelectField>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
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

            {/* Party Search Modal - using vendor endpoint */}
            <SearchModal
                open={partyModalOpen}
                onClose={() => setPartyModalOpen(false)}
                endpoint="vendor"
                baseParams={basePartyParams}
                columns={searchPartyColumns}
                searchFields={searchPartyFields}
                onSelect={handlePartySelect}
            />
        </>
    );
};

export default PurchaseOrderFilterCriteria;