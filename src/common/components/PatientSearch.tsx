import React, { useState, useCallback, useRef, useEffect } from "react";
import { Popup, Position } from "devextreme-react/popup";
import { TextBox } from "devextreme-react/text-box";
import DataGrid, { Column, Paging, Pager, Scrolling } from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import CustomStore from "devextreme/data/custom_store";
import { apiCall } from "../../utils/apiClient";

interface Patient {
    id: number;
    name: string;
    age: number;
    gender: string;
    mobile: string;
}

interface PatientSearchProps {
    visible: boolean;                       // show/hide popup
    onClose: () => void;                    // close popup handler
    onSelect: (patient: Patient) => void;   // return selected patient
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

const PatientSearch: React.FC<PatientSearchProps> = ({
    visible,
    onClose,
    onSelect,
    initialSearch,
}) => {
    const [search, setSearch] = useState("");
    const [patients, setPatients] = useState<Patient[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [skip, setSkip] = useState(0);
    const [take, setTake] = useState(100);
    const [loading, setLoading] = useState(false);
    const [companyId] = useState<string | null>(localStorage.getItem('companyId'));
    const [userId] = useState<string | null>(localStorage.getItem("userId"));
    const textBoxRef = useRef<any>(null); // 🔹 Ref for TextBox

    const debouncedSearch = useDebounce(search, 300);

    // Load data when search changes (min 1 character)
    // 🔹 Trigger live search after 1+ character
    useEffect(() => {
        if (debouncedSearch.length >= 1 || debouncedSearch === "") {
            setSkip(0);
            loadData(debouncedSearch, 0, take);
        } else {
            setPatients([]); // clear grid if no input
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
                setPatients([]);
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

    const fetchPatients = async (search: string, skip: number, take: number) => {
        debugger
        try {
            const response: any = await apiCall.get(
                process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'patient',
                {
                    userid: userId,
                    compid: companyId,
                    skip,
                    take,
                    search,
                }
            );

            // Ensure consistent shape for DataGrid
            return {
                data: response?.data || [],
                totalCount: response?.totalcount || 0,
            };
        } catch (error) {
            console.error("Error fetching patients:", error);
            return { data: [], totalCount: 0 };
        }
    };

    const loadData = useCallback(async (searchText = search, newSkip = skip, newTake = take) => {
        setLoading(true);
        try {
            const result = await fetchPatients(searchText, newSkip, newTake);
            setPatients(result.data);
            setTotalCount(result.totalCount);
        } finally {
            setLoading(false);
        }
    }, [fetchPatients, search, skip, take]);

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

    //         const result = await fetchPatients(searchText, skip, take);

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
            title="Patient Search"
            width={800}
            height={500}
            dragEnabled={true}
        >
            <Position at="center" my="center" of={window} />

            <div style={{ padding: 10, display: "flex", gap: 10, alignItems: "center" }}>
                <TextBox
                    ref={textBoxRef} // 🔹 attach ref
                    value={search}
                    onValueChanged={(e) => setSearch(e.value)}
                    placeholder="Search by patient name or mobile"
                    width={300}
                    valueChangeEvent="keyup"
                />
                <Button text="Search" type="default" onClick={handleSearch} />
            </div>

            <div style={{ marginTop: 10 }}>
                <DataGrid
                    dataSource={patients}
                    keyExpr="id"
                    showBorders={true}
                    focusedRowEnabled={true}
                    onRowDblClick={handleRowClick}
                    wordWrapEnabled={true}
                    height={380}
                    remoteOperations={true}
                //   loading={loading}
                >
                    <Column dataField="id" caption="ID" width={80} visible={false} />
                    <Column dataField="name" caption="Patient Name" />
                    <Column dataField="regno" caption="Reg No" width={80} />
                    <Column dataField="mobile" caption="Mobile No" width={90} />
                    <Column dataField="phone" caption="Phone No" width={90} />
                    <Column dataField="add1" caption="Address" width={160} />
                    <Column dataField="doc" caption="Under Doctor" width={130} />

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

export default PatientSearch;
