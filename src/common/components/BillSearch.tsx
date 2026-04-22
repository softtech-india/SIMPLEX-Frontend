import React, { useState, useCallback, useRef, useEffect } from "react";
import { Popup, Position } from "devextreme-react/popup";
import { TextBox } from "devextreme-react/text-box";
import DataGrid, { Column, Paging, Pager, Scrolling } from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import { apiCall } from "../../utils/apiClient";
import SelectBox from "devextreme-react/select-box";

interface Vendor {
    id: number;
    dtlid: number;
    trtype: string;
    period: string;
    billno: string;
    billdt: string;
    refno: string;
    tramt: number;
    dueamt: number;
    acctype: string;
    adjustedamt?: number;
    uniqueid: string;
}

interface BillSearchProps {
    visible: boolean;                       // show/hide popup
    onClose: () => void;                    // close popup handler
    ledgerid: number;                       // ledger id to filter bills
    endate?: Date; // optional initial search text
    totalAmount: number;
    onSelectBills: (bills: Vendor[]) => void; // 🔥 ADD THIS
    alreadySelectedIds?: string[]; // ✅ NEW
}

function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

const BillSearch: React.FC<BillSearchProps> = ({
    visible,
    onClose,
    ledgerid,
    endate,
    totalAmount,
    onSelectBills,
    alreadySelectedIds
}) => {
    const [search, setSearch] = useState("");
    const [Vendors, setVendors] = useState<Vendor[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [skip, setSkip] = useState(0);
    const [take, setTake] = useState(100);
    const [loading, setLoading] = useState(false);
    const [companyId] = useState<string | null>(localStorage.getItem('companyId'));
    const [branchId] = useState<string | null>(localStorage.getItem('branchId'));
    const [finId] = useState<string | null>(localStorage.getItem('finId'));
    const [userId] = useState<string | null>(localStorage.getItem("userId"));
    const textBoxRef = useRef<any>(null); // 🔹 Ref for TextBox
    const [selectedBills, setSelectedBills] = useState<any[]>([]);
    const grdPaymentRef = useRef(null);
    const [adjustMode, setAdjustMode] = useState<"AUTO" | "MANUAL">("MANUAL");
    const [balanceAmount, setBalanceAmount] = useState<number>(totalAmount);

    const debouncedSearch = useDebounce(search, 300);

    // Load data when search changes (min 1 character)
    // Trigger live search after 1+ character
    useEffect(() => {
        if (debouncedSearch.length >= 1 || debouncedSearch === "") {
            setSkip(0);
            loadData();
        } else {
            setVendors([]); // clear grid if no input
        }
    }, [debouncedSearch]);

    useEffect(() => {
        if (visible) {
            // If there’s an initial search, immediately load data
            loadData();

            // wait for popup to render, then focus TextBox
            const timer = setTimeout(() => {
                const instance = textBoxRef.current?.instance;
                if (instance) {
                    instance.focus();
                }
            }, 500); // 🔹 slightly longer delay ensures rendering

            return () => clearTimeout(timer);
        }
    }, [visible, endate]);

    useEffect(() => {
        if (visible) {
            setAdjustMode("MANUAL");
            setBalanceAmount(totalAmount);
            setSelectedBills([]);
        }
    }, [visible, totalAmount]);

    useEffect(() => {
        if (adjustMode === "AUTO" && Vendors.length > 0) {
            autoAdjustBills(Vendors);
        }
    }, [adjustMode, Vendors]);

    const autoAdjustBills = (rows: Vendor[]) => {
        let balance = totalAmount;

        const updated = rows.map((row) => {
            if (balance <= 0) {
                return { ...row, adjustedamt: 0 };
            }

            const adjust = Math.min(row.dueamt, balance);
            balance -= adjust;

            return {
                ...row,
                adjustedamt: adjust,
            };
        });

        setBalanceAmount(balance);
        setSelectedBills(updated.filter(r => r.adjustedamt! > 0));
        setVendors(updated);
    };

    const handleManualSelection = (e: any) => {
        let balance = totalAmount;
        const selectedIds = new Set(e.selectedRowKeys);

        const updated = Vendors.map((row) => {
            if (selectedIds.has(row.uniqueid) && balance > 0) {
                const adjust = Math.min(row.dueamt, balance);
                balance -= adjust;
                return { ...row, adjustedamt: adjust };
            }
            return { ...row, adjustedamt: 0 };
        });

        setBalanceAmount(balance);
        setSelectedBills(updated.filter(r => r.adjustedamt! > 0));
        setVendors(updated);
    };


    const fetchVendors = async () => {
        try {
            const response: any = await apiCall.get(
                process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + 'outstandingbill',
                {
                    userid: userId,
                    compid: companyId,
                    branchid: branchId,
                    finid: branchId,
                    ledgerid: ledgerid,
                    enddt: endate,
                }
            );

            let data: Vendor[] = response?.data || [];
            debugger

            // ✅ Filter already selected bills
            if (alreadySelectedIds?.length) {
                data = data.filter(v => !alreadySelectedIds!.includes(v.uniqueid));
            }

            return {
                data,
                totalCount: data.length,
            };

            // // Ensure consistent shape for DataGrid
            // return {
            //     data: response?.data || [],
            //     totalCount: response?.totalcount || 0,
            // };
        } catch (error) {
            console.error("Error fetching Vendors:", error);
            return { data: [], totalCount: 0 };
        }
    };

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const result = await fetchVendors();
            setVendors(result.data);
            setTotalCount(result.totalCount);
        } finally {
            setLoading(false);
        }
    }, [fetchVendors, search, skip, take]);

    const handleBillSelectionOk = () => {
        debugger
        onSelectBills(selectedBills);
        onClose();
    };
    return (
        <Popup
            visible={visible}
            onHiding={onClose}
            showTitle={true}
            title="Bill Search"
            width={800}
            height={500}
            dragEnabled={true}
        >
            <Position at="center" my="center" of={window} />

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                    <b>Total Amount :</b> ₹ {totalAmount.toFixed(2)} <br />
                    <b>Balance :</b> ₹ {balanceAmount.toFixed(2)}
                </div>

                <SelectBox
                    items={[
                        { id: "AUTO", name: "Auto" },
                        { id: "MANUAL", name: "Manual" },
                    ]}
                    displayExpr="name"
                    valueExpr="id"
                    value={adjustMode}
                    width={150}
                    onValueChanged={(e) => setAdjustMode(e.value)}
                />
            </div>


            <div style={{ marginTop: 10 }}>
                <DataGrid
                    ref={grdPaymentRef}
                    dataSource={Vendors}
                    keyExpr="uniqueid"
                    showBorders={true}
                    focusedRowEnabled={true}
                    wordWrapEnabled={true}
                    height={400}
                    remoteOperations={true}
                    selection={{
                        mode: "multiple",
                        showCheckBoxesMode: "always",
                    }}
                    onSelectionChanged={adjustMode === "MANUAL" ? handleManualSelection : undefined}
                // onSelectionChanged={(e) => setSelectedBills(e.selectedRowsData)}
                >
                    <Column dataField="id" caption="ID" visible={false} />
                    <Column dataField="dtlid" caption="dtlid" visible={false} />
                    <Column dataField="trtype" caption="trtype" visible={false} />
                    <Column dataField="period" caption="period" visible={false} />
                    <Column dataField="uniqueid" caption="uniqueid" visible={false} />
                    <Column dataField="billno" caption="Bill No" />
                    <Column dataField="billdt" caption="Bill Dt" width={100} />
                    <Column dataField="refno" caption="Reference No" width={140} />
                    <Column dataField="acctype" caption="Dr/Cr" width={60} />
                    <Column dataField="tramt" caption="Transaction Amt" width={100} />
                    <Column dataField="dueamt" caption="Due Amt" width={100} />
                    <Column dataField="adjustedamt" caption="Adjusted Amt" width={100} dataType="number" format="#,##0.00" />

                    <Scrolling mode="virtual" rowRenderingMode="virtual" />
                </DataGrid>
            </div>
            {/* Footer buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                <Button
                    text="OK"
                    type="success"
                    onClick={handleBillSelectionOk}
                    disabled={selectedBills.length === 0}
                />
                <Button
                    text="Cancel"
                    style={{ marginLeft: 10 }}
                    onClick={() => onClose()}
                />
            </div>
        </Popup>
    );
};

export default BillSearch;
