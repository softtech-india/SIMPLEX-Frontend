"use client";

import React, {useEffect, useMemo, useRef, useState } from "react";
import Popup from "devextreme-react/popup";
import DataGrid, { Column, Paging, Selection } from "devextreme-react/data-grid";
import CustomStore from "devextreme/data/custom_store";
import { apiCall } from "../../utils/apiClient";
import useIsMobile from "../hooks/useIsMobile";
import { Circle, CircleCheckBig } from "lucide-react";

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
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [totalCount, setTotalCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [selectAllChecked, setSelectAllChecked] = useState(false);

	useEffect(() => {
		if (visible) {
			setSelectedIds(new Set(excludedIds));
			setSelectedRows([]);
			setSearchText("");
			setDebouncedSearch("");
			setPage(0);
			setMobileData([]);
			setSelectAllChecked(false);
		} else {
			setSearchText("");
			setDebouncedSearch("");
			setPage(0);
			setMobileData([]);
			setSelectAllChecked(false);
		}
	}, [visible, excludedIds]); 

	// Debounce search 
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchText);
			setPage(0);
		}, 400);
		return () => clearTimeout(timer);
	}, [searchText]);

	const excludedIdSet = useMemo(() => new Set(excludedIds), [excludedIds]);

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
								(item: any) => !excludedIdSetRef.current.has(item.id)
							),
							totalCount: response?.totalcount || 0,
						};
					} catch (error) {
						console.error("Error fetching Barcodes:", error);
						return { data: [], totalCount: 0 };
					}
				},
			}),
		[userId, debouncedSearch]
	);

	/* -------------------- MOBILE FETCH -------------------- */
	useEffect(() => {
		if (!isMobile || !visible) return;

		const fetchMobileBarcodes = async () => {
			setLoading(true);
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
				setMobileData(prev => {
					const newData = page === 0 ? filtered : [...prev, ...filtered];
					return newData;
				});
			} catch (err) {
				console.error("Error fetching mobile barcodes:", err);
				setMobileData([]);
			} finally {
				setLoading(false);
			}
		};

		fetchMobileBarcodes();
	}, [isMobile, visible, userId, debouncedSearch, page, excludedIdSet]);

	useEffect(() => {
		if (isMobile && visible) {
			setMobileData([]);
			setPage(0);
		}
	}, [visible, excludedIds, isMobile]);

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

	const toggleSelectAll = (allRows: any[]) => {
		if (selectAllChecked) {
			setSelectedIds(new Set());
			setSelectAllChecked(false);
		} else {
			const newIds = new Set(allRows.map((item: any) => item.id));
			setSelectedIds(newIds);
			setSelectAllChecked(true);
		}
	};

	useEffect(() => {
		if (!isMobile) return;

		const currentSelectedRows = mobileData.filter(item => selectedIds.has(item.id));
		setSelectedRows(currentSelectedRows);
		setSelectAllChecked(
			mobileData.length > 0 && currentSelectedRows.length === mobileData.length
		);
	}, [selectedIds, mobileData, isMobile]);

	const loadMore = () => setPage(prev => prev + 1);

	const selectedRowKeys = useMemo(() => Array.from(selectedIds), [selectedIds]);

	return (
		<Popup
			visible={visible}
			title="Select Barcodes"
			onHiding={onClose}
			width={isMobile ? "95%" : 1000}
			height={isMobile ? "90%" : 500}
			showCloseButton
		>

			<div className="flex flex-col h-full bg-white rounded-lg shadow-md p-2 sm:p-4">

				{/* ── Search Bar ── */}
				<div className="mb-3 flex-shrink-0">
					<input
						type="text"
						placeholder="Search barcode / serial / model..."
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400"
						autoFocus
						aria-label="Search barcodes"
					/>
				</div>

				{/* ── Select All Button (Mobile) ── */}
				{isMobile && mobileData.length > 0 && (
					<button
						onClick={() => toggleSelectAll(mobileData)}
						className={
							`w-full px-4 py-2 mb-2 rounded-lg border-2 font-medium transition-all duration-150 ${selectAllChecked
								? "border-blue-600 bg-blue-50 text-blue-600 shadow-md"
								: "border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-gray-50"
							}`
						}
						aria-label={selectAllChecked ? "Deselect all items" : "Select all items"}
					>
						{selectAllChecked ? "✓ Deselect All" : "Select All"}
					</button>
				)}

				{/* ── Desktop Grid ── */}
				{!isMobile && (
					<div className="flex-1 overflow-y-auto rounded-md border border-gray-200 bg-gray-50">
						<DataGrid
							dataSource={barcodeStore}
							keyExpr="id"
							remoteOperations
							showBorders
							height={300}
							selectedRowKeys={selectedRowKeys}
							onSelectionChanged={(e) => {
								setSelectedIds(new Set(e.selectedRowKeys));
								setSelectedRows(e.selectedRowsData);
							}}
						>
							<Selection
								mode="multiple"
								showCheckBoxesMode="always"
								selectAllMode="page"
							/>
							<Paging defaultPageSize={20} />
							<Column dataField="barcodeno" caption="Barcode No" width={110} />
							<Column dataField="serialno" caption="Serial No" width={150} />
							<Column dataField="modelno" caption="Model" />
						</DataGrid>
					</div>
				)}

				{/* ── Mobile Card View ── */}
				{isMobile && (
					<div className="flex-1 overflow-y-auto flex flex-col gap-2 pb-2 bg-gray-200">
						{loading && page === 0 ? (
							<div className="flex flex-col items-center justify-center py-8 text-gray-500">
								<svg className="animate-spin h-8 w-8 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								<span>Loading barcodes...</span>
							</div>
						) : mobileData.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-8 text-gray-400">
								<svg className="w-12 h-12 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<span>No barcodes found</span>
								{searchText && (
									<button
										onClick={() => setSearchText("")}
										className="mt-2 text-sm text-blue-600 underline"
									>
										Clear search
									</button>
								)}
							</div>
						) : (
							<>
								{mobileData.map((row) => {
									const isSelected = selectedIds.has(row.id);
									return (
										<div
											key={row.id}
											onClick={() => toggleSelect(row)}
											className={
												`p-3 rounded-xl border flex-shrink-0 cursor-pointer transition-all duration-150 ` +
												(isSelected
													? "border-blue-700 bg-blue-50 ring-2 ring-blue-200 shadow-sm"
													: "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm")
											}
											role="button"
											tabIndex={0}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													toggleSelect(row);
												}
											}}
											aria-pressed={isSelected}
											aria-label={`${row.barcodeno} - ${isSelected ? "selected" : "not selected"}`}
										>
											<div className="flex justify-between items-center">
												<div className="space-y-0.5 text-[12px] flex-1">
													<div className="flex items-center gap-2">
														<span className="font-semibold text-gray-700">Barcode:</span>
														<span className="text-gray-900">{row.barcodeno}</span>
													</div>
													<div className="flex items-center gap-2">
														<span className="font-semibold text-gray-700">Serial:</span>
														<span className="text-gray-600">{row.serialno || '—'}</span>
													</div>
													<div className="flex items-center gap-2">
														<span className="font-semibold text-gray-700">Model:</span>
														<span className="text-gray-600">{row.modelno || '—'}</span>
													</div>
												</div>
												<div className="ml-3">
													{isSelected ? (
														<span className="text-blue-700 font-bold text-xl bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center"><CircleCheckBig size={18} /></span>
													) : (
														<span className="text-gray-300 text-xl flex items-center justify-center"><Circle size={18} /></span>
													)}
												</div>
											</div>
										</div>
									);
								})}

								{/* Load More button */}
								{mobileData.length < totalCount && (
									<button
										onClick={loadMore}
										disabled={loading}
										className={
											`px-4 py-2 rounded-lg border border-blue-600 text-blue-600 bg-white transition mt-2 self-center font-medium shadow-sm 
											${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-50 active:bg-blue-100 cursor-pointer"}
											focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`
										}
										aria-label="Load more items"
									>
										{loading ? (
											<span className="flex items-center gap-2">
												<svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
													<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
													<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
												</svg>
												Loading...
											</span>
										) : (
											<span>Load More ({mobileData.length} of {totalCount})</span>
										)}
									</button>
								)}
							</>
						)}
					</div>
				)}

				{/* ── Footer ── */}
				<div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-300 flex-shrink-0 bg-white ">

					<span className="text-sm text-gray-700">
						{selectedRows.length > 0
							? `${selectedRows.length} item${selectedRows.length > 1 ? "s" : ""} selected`
							: "No items selected"}
					</span>

					<div className="flex gap-2">
						<button
							type="button"
							onClick={onClose}
							className="secondary-btn"
						>
							Cancel
						</button>

						<button
							type="button"
							className="primary-btn"
							disabled={selectedRows.length === 0}
							onClick={() => { onConfirm(selectedRows);}}
						>
							Save
						</button>
					</div>
				</div>
			</div>
		</Popup>
	);
};

export default BarcodePopup;