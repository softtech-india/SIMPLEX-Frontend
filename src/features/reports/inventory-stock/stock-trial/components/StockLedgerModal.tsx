'use client';

import React, { useEffect, useMemo } from 'react';
import { Popup, LoadPanel } from 'devextreme-react';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';
import { StockTrial } from '../types/stockTrial.types';
import { useStockledger } from '../hooks/useStockTrial';
import { formatDateForApi } from '../types/stockTrial.types';
import useUserStore from '@/store/userStore';

interface StockLedgersModalProps {
    visible: boolean;
    onClose: () => void;
    selectedRow: StockTrial | null;
    branchId: number;
    branchName: string;
    startDate: string | null;
    endDate: string | null;
    godownIds?: string;
}

interface StockLedgerTransaction {
    trnid: number;
    trnno: string;
    trndt: string;
    trtype: string;
    refno: string;
    recvqty: number;
    issuqty: number;
    clqty: number;
    clrate: number;
    clval: number;
    unit: string;
}

export const StockLedgersModal: React.FC<StockLedgersModalProps> = ({
    visible,
    onClose,
    selectedRow,
    branchId,
    branchName,
    startDate,
    endDate,
    godownIds = ''
}) => {
    const { userId, companyId, finid } = useUserStore();

    const {
        data: ledgerData = [],
        refetch,
        isFetching,
        isLoading
    } = useStockledger({
        userid: Number(userId),
        compid: Number(companyId),
        branchid: branchId,
        finid: Number(finid),
        startdt: startDate ? formatDateForApi(startDate) : '',
        enddt: endDate ? formatDateForApi(endDate) : '',
        productid: selectedRow?.productid || 0,
        strgodown: godownIds || ' '
    });

    useEffect(() => {
        if (visible && selectedRow && selectedRow.productid) {
            refetch();
        }
    }, [visible, selectedRow, branchId, startDate, endDate, godownIds, refetch]);
    const orderedLedgerData = React.useMemo(() => {
        return (ledgerData || []).map((item, index) => ({
            ...item,
            __uid: `${item.trnid}-${index}`, // unique always
            __order: index
        }));
    }, [ledgerData]);


    const columns = [
        {
            dataField: "trndt",
            caption: "Date",
            width: 150,
            cellRender: (data: any) => {
                if (!data.value) return '-';

                const date = new Date(data.value);
                if (isNaN(date.getTime())) return '-';

                const dd = String(date.getDate()).padStart(2, '0');
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const yyyy = date.getFullYear();

                return `${dd}/${mm}/${yyyy}`;
            }
        },
        { dataField: "trnno", caption: "Transaction No", width: 200 },
        { dataField: "refno", caption: "Reference No", width: 150 },
        { dataField: "ledgernm", caption: "Ledger Name", width: 150 },
        { dataField: "trtype", caption: "Type", width: 100 },
        {
            dataField: "recvqty",
            caption: "Received",
            width: 100,
            format: "fixedPoint",
            precision: 2
        },
        {
            dataField: "issuqty",
            caption: "Issued",
            width: 100,
            format: "fixedPoint",
            precision: 2
        },
        {
            dataField: "clqty",
            caption: "Closing Qty",
            width: 120,
            format: "fixedPoint",
            precision: 2
        },
        {
            dataField: "clrate",
            caption: "Rate",
            width: 100,
            format: "fixedPoint",
            precision: 2
        },
        {
            dataField: "clval",
            caption: "Value",
            width: 120,
            format: "fixedPoint",
            precision: 2
        },
        { dataField: "unit", caption: "Unit", width: 80 }
    ];

    const formatDisplayDate = (date: string | null) => {
        if (!date) return '-';
        return date;
    };


    // Calculate summary from ledger data
    const getSummary = () => {
        if (!ledgerData.length) return null;

        const totalReceived = ledgerData.reduce((sum, item) => sum + (item.recvqty || 0), 0);
        const totalIssued = ledgerData.reduce((sum, item) => sum + (item.issuqty || 0), 0);
        const lastEntry = ledgerData[ledgerData.length - 1];

        return {
            totalReceived,
            totalIssued,
            closingQty: lastEntry?.clqty || 0,
            closingValue: lastEntry?.clval || 0
        };
    };

    const summary = getSummary();

    return (
        <Popup
            visible={visible}
            onHiding={onClose}
            title={`Stock Ledger - ${selectedRow?.productnm || ''}`}
            width="95%"
            height="85%"
            dragEnabled
            showTitle
            showCloseButton={true}
        >
            <div className="p-4">
                {/* Header Information */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div>
                            <label className="text-xs text-gray-500 font-medium">Branch</label>
                            <p className="text-sm font-semibold text-gray-900">{branchName || '-'}</p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 font-medium">Product</label>
                            <p className="text-lg font-bold text-gray-900">{selectedRow?.productnm || '-'}</p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 font-medium">Product Code</label>
                            <p className="text-sm font-semibold text-gray-900">{selectedRow?.productcode || '-'}</p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 font-medium">Unit</label>
                            <p className="text-sm font-semibold text-gray-900">{selectedRow?.unit || '-'}</p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 font-medium">From</label>
                            <p className="text-sm font-semibold text-gray-900">
                                {formatDisplayDate(startDate)}
                            </p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 font-medium">To</label>
                            <p className="text-sm font-semibold text-gray-900">
                                {formatDisplayDate(endDate)}
                            </p>
                        </div>
                    </div>
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-2 border-t border-gray-200">

                        {godownIds && godownIds.trim() !== '' && godownIds !== ' ' && (
                            <div>
                                <label className="text-xs text-gray-500 font-medium">Godown IDs</label>
                                <p className="text-sm font-semibold text-gray-900">{godownIds}</p>
                            </div>
                        )}
                    </div> */}
                </div>

                {/* Summary Section */}
                {/* {summary && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="text-sm font-semibold text-blue-900 mb-2">Summary</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="text-xs text-blue-600 font-medium">Total Received</label>
                                <p className="text-lg font-bold text-blue-900">
                                    {summary.totalReceived.toFixed(2)} {selectedRow?.unit}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs text-blue-600 font-medium">Total Issued</label>
                                <p className="text-lg font-bold text-blue-900">
                                    {summary.totalIssued.toFixed(2)} {selectedRow?.unit}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs text-blue-600 font-medium">Closing Quantity</label>
                                <p className="text-lg font-bold text-blue-900">
                                    {summary.closingQty.toFixed(2)} {selectedRow?.unit}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs text-blue-600 font-medium">Closing Value</label>
                                <p className="text-lg font-bold text-blue-900">
                                    ₹{summary.closingValue.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                )} */}

                {/* Data Grid */}
                <CustomDataGrid
                    dataSource={orderedLedgerData}
                    columns={columns}
                    keyExpr="__uid"
                    selectionMode="none"
                    height={450}
                />

                <LoadPanel
                    shadingColor="rgba(0,0,0,0.4)"
                    visible={isFetching || isLoading}
                    showIndicator={true}
                />
            </div>
        </Popup>
    );
};