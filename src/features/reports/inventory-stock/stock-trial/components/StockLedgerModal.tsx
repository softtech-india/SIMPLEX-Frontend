'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Popup, LoadPanel } from 'devextreme-react';
import CustomDataGrid from '@/common/components/sharedComponents/CustomDataGrid';
import { StockTrial } from '../types/stockTrial.types';
import { useStockledger } from '../hooks/useStockTrial';
import { formatDateForApi } from '../types/stockTrial.types';
import useUserStore from '@/store/userStore';
import { GoodReceivedNoteForm } from '@/features/purchase/good-received-note/components/GoodReceivedNoteForm';
import { SaleOrderForm } from '@/features/sale/sale-order/components/SaleOrderForm';
import { DirectSaleForm } from '@/features/sale/direct-sale/components/DirectSaleForm';

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
    const [grnopenModal, setGRNOpenModal] = useState(false);
    const [saleopenModal, setSaleOpenModal] = useState(false);
    const [formGoodReceivedNoteId, setFormGoodReceivedNoteId] = useState(0);
    const [saleId, setSaleId] = useState(0);
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
            __uid: `${item.trnid}-${index}`,
            __order: index
        }));
    }, [ledgerData]);
    const handleledgerRowDblClick = useCallback((e: any) => {
        if (e.data && e.data.trtype === 'SA') {
            setSaleOpenModal(true);
            setSaleId(e.data.trnid);
        }
        if (e.data && e.data.trtype === 'GRN') {
            setGRNOpenModal(true);
            setFormGoodReceivedNoteId(e.data.trnid);
        }
    }, []);

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
            height="80%"
            dragEnabled
            showTitle
            showCloseButton={true}
        >
            <div className="p-2 h-60">
                {/* Header Information - Shrinked */}
                <div className="bg-white shadow-md rounded-xl border border-gray-200 p-1 mb-2">
                    {/* Main Content - Single Line */}
                    <div className="flex items-center gap-2">
                        {/* Product Section */}
                        <div className="flex-1 bg-gradient-to-r from-slate-50 to-blue-50 border border-blue-100 rounded-lg p-2">
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <label className="text-[9px] uppercase tracking-wide text-gray-500 font-semibold">
                                        Product Name
                                    </label>
                                    <h3 className="text-base font-bold text-gray-900 leading-snug mt-0.5">
                                        {selectedRow?.productnm || '-'}
                                    </h3>
                                </div>

                                <div className="bg-white rounded px-2 py-1 border border-gray-100 shadow-sm">
                                    <label className="text-[9px] uppercase text-gray-500 font-medium">
                                        Product Code
                                    </label>
                                    <p className="text-xs font-semibold text-gray-800 mt-0.5">
                                        {selectedRow?.productcode || '-'}
                                    </p>
                                </div>

                                <div className="bg-white rounded px-2 py-1 border border-gray-100 shadow-sm">
                                    <label className="text-[9px] uppercase text-gray-500 font-medium">
                                        Unit
                                    </label>
                                    <p className="text-xs font-semibold text-gray-800 mt-0.5">
                                        {selectedRow?.unit || '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Date Section */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 min-w-[180px]">
                            <div className="flex items-center gap-2">
                                <div className="text-center flex-1">
                                    <label className="text-[9px] uppercase tracking-wide text-gray-500 font-semibold">
                                        From Date
                                    </label>
                                    <p className="text-xs font-bold text-gray-900 mt-0.5">
                                        {formatDisplayDate(startDate)}
                                    </p>
                                </div>
                                <div className="w-px h-5 bg-gray-300"></div>
                                <div className="text-center flex-1">
                                    <label className="text-[9px] uppercase tracking-wide text-gray-500 font-semibold">
                                        To Date
                                    </label>
                                    <p className="text-xs font-bold text-gray-900 mt-0.5">
                                        {formatDisplayDate(endDate)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Branch Section */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 min-w-[120px] text-center">
                            <label className="text-[9px] uppercase tracking-wide text-blue-600 font-semibold">
                                Branch
                            </label>
                            <p className="text-sm font-bold text-blue-800 mt-0.5">
                                {branchName || 'No Branch'}
                            </p>
                        </div>
                    </div>

                    {/* Godown Section - Compact */}
                    {godownIds && godownIds.trim() !== '' && godownIds !== ' ' && (
                        <div className="mt-2 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1">
                            <label className="text-[9px] uppercase tracking-wide text-amber-700 font-semibold">
                                Godown IDs
                            </label>
                            <p className="text-[11px] text-gray-800 mt-0.5 break-words">
                                {godownIds}
                            </p>
                        </div>
                    )}
                </div>

                {/* Data Grid */}
                <CustomDataGrid
                    dataSource={orderedLedgerData}
                    columns={columns}
                    onRowDblClick={handleledgerRowDblClick}
                    keyExpr="__uid"
                    selectionMode="none"
                    height={450}
                />

                <LoadPanel
                    shadingColor="rgba(0,0,0,0.4)"
                    visible={isFetching || isLoading}
                    showIndicator={true}
                />
                {
                    grnopenModal &&
                    <GoodReceivedNoteForm
                        visible={grnopenModal}
                        onClose={() => setGRNOpenModal(false)}
                        formGoodReceivedNoteId={formGoodReceivedNoteId}
                        formSelectedBranch={branchName}
                        toolbarBranchId={Number(branchId)}
                        mode={"Edit"}
                        isRowConfirmed={false}
                        onUpdated={() => {
                            refetch();
                        }}
                    />
                }
                {
                    saleopenModal &&
                    <DirectSaleForm
                        visible={true}
                        onClose={() => setSaleOpenModal(false)}
                        formDirectSaleId={saleId}
                        formSelectedBranch={branchName}
                        toolbarBranchId={Number(branchId)}
                        mode={"Edit"}
                        onUpdated={() => {
                            refetch();
                        }}
                    />
                }
            </div>
        </Popup>
    );
};