"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Popup from "devextreme-react/popup";
import DataGrid, { Column, Paging, Selection, SearchPanel } from "devextreme-react/data-grid";
import CustomStore from "devextreme/data/custom_store";
import Button from "devextreme-react/button";
import { apiCall } from "../../utils/apiClient";
import useIsMobile from "../hooks/useIsMobile";

interface Props {
    visible: boolean;
    onClose: () => void;
    onConfirm: (data: any[]) => void;
    excludedIds: number[];
}

const BarcodePopup: React.FC<Props> = ({ visible, onClose, onConfirm, excludedIds }) => {
    const [userId] = useState<string | null>(localStorage.getItem("userId"));
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const isMobile = useIsMobile();
    const [mobileData, setMobileData] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [searchText, setSearchText] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(""); // ✅ debounced value
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);

    // ✅ Reset state when popup closes
    useEffect(() => {
        if (!visible) {
            setSelectedIds(new Set());
            setSelectedRows([]);
            setSearchText("");
            setDebouncedSearch("");
            setPage(0);
            setMobileData([]);
        }
    }, [visible]);

    // ✅ Debounce search input — waits 400ms after user stops typing
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchText);
            setPage(0); // reset page on new search
        }, 400);
        return () => clearTimeout(timer);
    }, [searchText]);

    const excludedIdSet = useMemo(() => new Set(excludedIds), [excludedIds]);

    // ✅ Stable store — only recreates when search changes, NOT on excludedIdSet change
    //    excludedIdSet filtering is done in load() via closure ref to avoid selection loss
    const excludedIdSetRef = useRef(excludedIdSet);
    useEffect(() => {
        excludedIdSetRef.current = excludedIdSet;
    }, [excludedIdSet]);

    const barcodeStore = useMemo(
        () =>
            new CustomStore<any, number>({
                key: "id",
                load: async (loadOptions) => {
                    try {
                        const response: any = await apiCall.get(
                            process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + "secondarysalependingbarcode",
                            {
                                userid: userId,
                                skip: loadOptions.skip ?? 0,
                                take: loadOptions.take ?? 20,
                                search: debouncedSearch,
                            }
                        );
                        return {
                            data: (response?.data || []).filter(
                                (item: any) => !excludedIdSetRef.current.has(item.id) // ✅ use ref so store isn't recreated
                            ),
                            totalCount: response?.totalcount || 0,
                        };
                    } catch (error) {
                        console.error("Error fetching Barcodes:", error);
                        return { data: [], totalCount: 0 };
                    }
                },
            }),
        [userId, debouncedSearch] // ✅ excludedIds removed from deps
    );

    /* -------------------- MOBILE FETCH -------------------- */
    useEffect(() => {
        if (!isMobile || !visible) return;

        const fetchMobileBarcodes = async () => {
            setLoading(true); // ✅ loading state now properly set
            try {
                const res: any = await apiCall.get(
                    process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + "secondarysalependingbarcode",
                    {
                        userid: userId,
                        skip: page * 20,
                        take: 20,
                        search: debouncedSearch,
                    }
                );
                const filtered = (res?.data || []).filter(
                    (item: any) => !excludedIdSet.has(item.id)
                );
                setTotalCount(res?.totalcount || 0);
                setMobileData(prev => (page === 0 ? filtered : [...prev, ...filtered]));
            } catch (err) {
                console.error(err);
                setMobileData([]);
            } finally {
                setLoading(false); // ✅ always clears loading
            }
        };

        fetchMobileBarcodes();
    }, [isMobile, visible, userId, debouncedSearch, page]); // ✅ use debouncedSearch

    /* -------------------- MOBILE CARD SELECT -------------------- */
    const toggleSelect = (row: any) => {
        setSelectedIds(prevIds => {
            const nextIds = new Set(prevIds);
            if (nextIds.has(row.id)) {
                nextIds.delete(row.id);
            } else {
                nextIds.add(row.id);
            }
            return nextIds;
        });
    };

    useEffect(() => {
        if (!isMobile) return;
        setSelectedRows(mobileData.filter(item => selectedIds.has(item.id)));
    }, [selectedIds, mobileData, isMobile]);

    const loadMore = () => setPage(prev => prev + 1);

    // ✅ Popup height breakdown: ~500px total
    //    search: 46px, footer: 50px, grid/cards: remaining ~360px
    const GRID_HEIGHT = isMobile ? "calc(90vh - 160px)" : 340;

    return (
        <Popup
            visible={visible}
            title="Select Barcodes"
            onHiding={onClose}
            width={isMobile ? "95%" : 1000}
            height={isMobile ? "90%" : 500}
            showCloseButton
        >
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

                {/* ── Search Bar ── */}
                <div style={{ marginBottom: 10, flexShrink: 0 }}>
                    <input
                        type="text"
                        placeholder="Search barcode / serial / model..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "8px 10px",
                            borderRadius: 6,
                            border: "1px solid #ccc",
                            fontSize: 14,
                            boxSizing: "border-box",
                        }}
                    />
                </div>

                {/* ── Desktop Grid ── */}
                {!isMobile && (
                    <div style={{ flex: 1, overflow: "hidden" }}>
                        <DataGrid
                            dataSource={barcodeStore}
                            keyExpr="id"
                            remoteOperations
                            showBorders
                            height={GRID_HEIGHT} // ✅ fixed height so it doesn't overflow
                            onSelectionChanged={(e) => setSelectedRows(e.selectedRowsData)}
                        >
                            <Selection mode="multiple" showCheckBoxesMode="always" />
                            <Paging defaultPageSize={20} />
                            <Column dataField="barcodeno" caption="Barcode No" />
                            <Column dataField="serialno" caption="Serial No" />
                            <Column dataField="modelno" caption="Model" />
                        </DataGrid>
                    </div>
                )}

                {/* ── Mobile Card View ── */}
                {isMobile && (
                    <div // ✅ scrollable container with fixed height
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                            paddingBottom: 8,
                        }}
                    >
                        {loading && page === 0 ? (
                            <div style={{ textAlign: "center", padding: 20, color: "#888" }}>
                                Loading...
                            </div>
                        ) : mobileData.length === 0 ? (
                            <div style={{ textAlign: "center", padding: 20, color: "#aaa" }}>
                                No barcodes found.
                            </div>
                        ) : (
                            mobileData.map((row) => {
                                const isSelected = selectedIds.has(row.id);
                                return (
                                    <div
                                        key={row.id}
                                        onClick={() => toggleSelect(row)}
                                        style={{
                                            padding: 12,
                                            borderRadius: 8,
                                            border: isSelected ? "2px solid #1976d2" : "1px solid #ddd",
                                            backgroundColor: isSelected ? "#e3f2fd" : "#fff",
                                            cursor: "pointer",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {/* ✅ Checkmark indicator */}
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div>
                                                <div><b>Barcode:</b> {row.barcodeno}</div>
                                                <div><b>Serial:</b> {row.serialno}</div>
                                                <div><b>Model:</b> {row.modelno}</div>
                                            </div>
                                            {isSelected && (
                                                <span style={{ color: "#1976d2", fontWeight: "bold", fontSize: 18 }}>✓</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}

                        {/* ✅ Load More inside scroll area */}
                        {isMobile && mobileData.length < totalCount && (
                            <button
                                onClick={loadMore}
                                disabled={loading}
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: 6,
                                    border: "1px solid #1976d2",
                                    color: "#1976d2",
                                    background: "#fff",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    alignSelf: "center",
                                    marginTop: 4,
                                }}
                            >
                                {loading ? "Loading..." : "Load More"}
                            </button>
                        )}
                    </div>
                )}

                {/* ── Footer ── */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 10,
                        paddingTop: 8,
                        borderTop: "1px solid #eee",
                        flexShrink: 0,
                    }}
                >
                    {/* ✅ Selection count */}
                    <span style={{ fontSize: 13, color: "#555" }}>
                        {selectedRows.length > 0
                            ? `${selectedRows.length} item${selectedRows.length > 1 ? "s" : ""} selected`
                            : "No items selected"}
                    </span>

                    <div style={{ display: "flex", gap: 8 }}>
                        <Button text="Cancel" onClick={onClose} />
                        <Button
                            text="OK"
                            type="success"
                            disabled={selectedRows.length === 0} // ✅ prevent empty confirm
                            onClick={() => onConfirm(selectedRows)}
                        />
                    </div>
                </div>
            </div>
        </Popup>
    );
};

export default BarcodePopup;