import React, { useState, useCallback, useRef, useEffect } from "react";
import { Popup, Position } from "devextreme-react/popup";
import { TextBox } from "devextreme-react/text-box";
import DataGrid, { Column, Paging, Pager, Scrolling } from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import CustomStore from "devextreme/data/custom_store";
import { apiCall } from "../../utils/apiClient";

interface Vendor {
    id: number;
    name: string;
    mobile: string;
    postingledgerid: number;
    postingledgernm: string;
}

interface VendorSearchProps {
    visible: boolean;                       // show/hide popup
    onClose: () => void;                    // close popup handler
    onSelect: (Vendor: Vendor) => void;   // return selected Vendor
    initialSearch?: string; // optional initial search text
}

function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

const VendorSearch: React.FC<VendorSearchProps> = ({
    visible,
    onClose,
    onSelect,
    initialSearch,
}) => {
    const [search, setSearch] = useState("");
    const [Vendors, setVendors] = useState<Vendor[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [skip, setSkip] = useState(0);
    const [take, setTake] = useState(100);
    const [loading, setLoading] = useState(false);
    const [companyId] = useState<string | null>(localStorage.getItem('companyId'));
    const [userId] = useState<string | null>(localStorage.getItem("userId"));
    const textBoxRef = useRef<any>(null); // 🔹 Ref for TextBox

    const debouncedSearch = useDebounce(search, 300);

    // Load data when search changes (min 1 character)
    // Trigger live search after 1+ character
    useEffect(() => {
        if (debouncedSearch.length >= 1 || debouncedSearch === "") {
            setSkip(0);
            loadData(debouncedSearch, 0, take);
        } else {
            setVendors([]); // clear grid if no input
        }
    }, [debouncedSearch]);

    useEffect(() => {
        if (visible) {
            const searchText = initialSearch || ""; // use passed value or empty

            // 🔹 Reset all states when popup opens
            setSearch(searchText);
            setSkip(0);
            setTake(100);
            setTotalCount(0);
            // If there’s an initial search, immediately load data
            if (searchText) {
                loadData(searchText, 0, take);
            } else {
                setVendors([]);
            }

            // wait for popup to render, then focus TextBox
            const timer = setTimeout(() => {
                const instance = textBoxRef.current?.instance;
                if (instance) {
                    instance.focus();
                }
            }, 500); // 🔹 slightly longer delay ensures rendering

            return () => clearTimeout(timer);
        }
    }, [visible, initialSearch]);

    const fetchVendors = async (search: string, skip: number, take: number) => {
        try {
            const response: any = await apiCall.get(
                process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'Vendor',
                {
                    userid: userId,
                    compid: companyId,
                    skip: 0,
                    take: 100,
                    search: search,
                }
            );
            // Ensure consistent shape for DataGrid
            return {
                data: response?.data || [],
                totalCount: response?.totalcount || 0,
            };
        } catch (error) {
            console.error("Error fetching Vendors:", error);
            return { data: [], totalCount: 0 };
        }
    };

    const loadData = useCallback(async (searchText = search, newSkip = skip, newTake = take) => {
        setLoading(true);
        try {
            const result = await fetchVendors(searchText, newSkip, newTake);
            setVendors(result.data);
            setTotalCount(result.totalCount);
        } finally {
            setLoading(false);
        }
    }, [fetchVendors, search, skip, take]);

    const handleSearch = () => {
        setSkip(0);
        loadData(search, 0, 100);
    };

    const handleRowClick = (e: any) => {
        onSelect(e.data);
        onClose();
    };

    // const dataSource = new CustomStore({
    //     key: "id",
    //     load: async (loadOptions: any) => {
    //         const skip = loadOptions.skip ?? 0;
    //         const take = loadOptions.take ?? 10;
    //         const searchText = search;

    //         const result = await fetchVendors(searchText, skip, take);

    //         return {
    //             data: result.data,
    //             totalCount: result.totalCount,
    //         };
    //     },
    // });

    return (
        <Popup
            visible={visible}
            onHiding={onClose}
            showTitle={true}
            title="Vendor Search"
            width={800}
            height={500}
            dragEnabled={true}
        >
            <Position at="center" my="center" of={window} />

            <div style={{ padding: 10, display: "flex", gap: 10, alignItems: "center" }}>
                <TextBox
                    ref={textBoxRef}
                    value={search}
                    onValueChanged={(e) => setSearch(e.value)}
                    placeholder="Search by Vendor Name or Mobile No."
                    width={300}
                    valueChangeEvent="keyup"
                />
                <Button text="Search" type="default" onClick={handleSearch} />
            </div>

            <div style={{ marginTop: 10 }}>
                <DataGrid
                    dataSource={Vendors}
                    keyExpr="id"
                    showBorders={true}
                    focusedRowEnabled={true}
                    onRowDblClick={handleRowClick}
                    wordWrapEnabled={true}
                    height={500}
                    remoteOperations={true}
                //   loading={loading}
                >
                    <Column dataField="id" caption="ID" width={80} visible={false} />
                    <Column dataField="name" caption="Vendor Name" />
                    <Column dataField="code" caption="Code" width={90} />
                    <Column dataField="ledgergroupnm" caption="Ledger Group" width={90} />
                    <Column dataField="phone" caption="Phone No" width={80} />
                    <Column dataField="addr" caption="Address" width={160} />
                    <Column dataField="gstin" caption="GSTIN" width={120} />

                    {/* <Paging pageSize={take} />
                    <Pager
                        // showPageSizeSelector={true}
                        allowedPageSizes={[10, 20, 50]}
                        showInfo={true}
                        visible={true}
                        showNavigationButtons={true}
                    /> */}
                    <Scrolling mode="virtual" rowRenderingMode="virtual" />
                </DataGrid>
            </div>
        </Popup>
    );
};

export default VendorSearch;
