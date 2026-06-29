import { apiCall } from "@/utils/apiClient";
import notify from "devextreme/ui/notify";
import { useEffect, useRef, useState } from "react";
import Popup, { Position } from "devextreme-react/popup";
import useIsMobile from "@/common/hooks/useIsMobile";
import { StepBack, StepForward } from "lucide-react";
import Loader from "./Loader";

interface Column {
  key: string;
  label: string;
}

interface SearchField {
  value: string;
  label: string;
}

interface MultipleSearchModalProps {
  open: boolean;
  onClose: () => void;
  endpoint: string;
  baseParams: Record<string, any>;
  columns: Column[];
  onSelect: (row: any) => void;
  pageSize?: number;

  searchFields?: SearchField[];

  excludeIds?: number[];
  currentId?: number;

  multiple?: boolean;
  onMultiSelect?: (rows: any[]) => void;
  selectedRows?: any[];
}

export default function MultipleSearchModal({
  open,
  onClose,
  endpoint,
  baseParams,
  columns,
  onSelect,
  pageSize = 20,
  searchFields,
  excludeIds,
  currentId,

  multiple = true,
  onMultiSelect,
  selectedRows: selectedRowsProp = [], // NEW

}: MultipleSearchModalProps) {

  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchBy, setSearchBy] = useState<string>("");

  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const isMobile = useIsMobile();

  useEffect(() => {
    if (open) {
      setSelectedRows(selectedRowsProp ?? []);
      fetchData(0);
    }
  }, [open]);

  const toggleSelection = (row: any) => {
    setSelectedRows((prev) => {
      const exists = prev.some((r) => r.id === row.id);

      if (exists) {
        return prev.filter((r) => r.id !== row.id);
      }

      return [...prev, row];
    });
  };

  useEffect(() => {
    if (open) {
      setSearch("");
      setSkip(0);
      setSelectedRows(selectedRowsProp);

      if (searchFields && searchFields.length > 0) {
        setSearchBy(searchFields[0].value);
      }

      fetchData(0);
    }
  }, [open]);

  useEffect(() => {
    if (open) fetchData(skip);
  }, [skip]);

  useEffect(() => {
    if (!open) return;

    const delayDebounce = setTimeout(() => {
      setSkip(0);
      fetchData(0);
    }, 500); // 500ms delay after typing stops

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const fetchData = (skipVal: number) => {
    setLoading(true);

    apiCall
      .get(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + endpoint, {
        ...baseParams,
        skip: skipVal,
        take: pageSize,
        Searchtext: search,
        ...(searchBy && { searchBy })
      })
      .then((response: any) => {
        if (response?.error) {
          notify(response.error, "error", 3000);
          setLoading(false);
          return;
        }
        setList(response.data || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        notify(String(e), "error", 3000);
        setLoading(false);
      });
  };

  const selectedIds = new Set(selectedRows.map(r => r.id));

  return (
    <Popup
      visible={open}
      onHiding={onClose}
      showTitle
      showCloseButton
      title={multiple ? "Select Records" : "Search"}
      width={isMobile ? "100%" : 900}
      height={isMobile ? "100%" : 500}
      dragEnabled={!isMobile}
      className="rounded-xl overflow-hidden"
      onShown={() => setTimeout(() => inputRef.current?.focus(), 0)}
    >
      <Position at="center" my="center" of={window} />

      <div className="relative h-full flex flex-col bg-white">

        {/* ================= HEADER ================= */}
        <div className="sticky top-0 z-20 border-b bg-white px-4 py-3">
          <div className="flex flex-wrap gap-2 items-center">

            <input
              ref={inputRef}
              value={search}
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchData(0)}
              className="flex-1 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />

            <button
              className="primary-btn"
              onClick={() => {
                setSkip(0);
                fetchData(0);
              }}
            >
              Search
            </button>
          </div>
        </div>

        {/* ================= BODY ================= */}
        <div className="flex-1 overflow-auto bg-gray-50">

          {!loading && list.length === 0 && (
            <div className="flex h-full items-center justify-center text-gray-500">
              No records found.
            </div>
          )}

          {!isMobile ? (
            <table className="w-full border-separate border-spacing-0 text-sm">
              <thead className="sticky top-0 z-10 bg-gray-100">
                <tr>
                  {multiple && (  <th className="w-14 border-b px-3 py-2 text-left">  Select  </th> )}
                  {columns.map(col => (
                    <th key={col.key} className="border-b px-3 py-2 text-left font-semibold" > {col.label}  </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {list.map((row, i) => {
                  const selected = selectedRows.some(
                    x => x.id === row.id
                  );

                  return (
                    <tr
                      key={i}
                      onDoubleClick={() => {
                        if (!multiple) {
                          onSelect(row);
                          onClose();
                        }
                      }}
                      className={`  border-b cursor-pointer transition  ${selected ? "bg-blue-100" : "bg-white hover:bg-blue-50"}   `}
                    >
                      {multiple && (
                        <td className="px-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(row.id)}
                            onChange={() => toggleSelection(row)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                      )}

                      {columns.map(col => (
                        <td key={col.key} className="px-3 py-2"  >  {row[col.key]}  </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="space-y-2 p-2">
              {list.map((row, i) => {
                const selected = selectedRows.some(
                  x => x.id === row.id
                );

                return (
                  <div
                    key={i}
                    onClick={() => multiple ? toggleSelection(row) : (onSelect(row), onClose())}
                    className={` rounded-lg border p-3 shadow-sm transition ${selected ? "border-blue-500 bg-blue-50" : "bg-white"} `}
                  >
                    {multiple && (
                      <div className="flex justify-end mb-2">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleSelection(row)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}

                    {columns.map(col => (
                      <div key={col.key} className="flex justify-between py-1 text-sm" >
                        <span className="text-gray-500">  {col.label}  </span>
                        <span className="font-medium text-right">  {row[col.key]}   </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= FOOTER ================= */}

        <div className="sticky bottom-0 flex items-center justify-between border-t bg-white px-4 py-3">

          <button
            disabled={skip === 0}
            onClick={() => setSkip(Math.max(0, skip - pageSize))}
            className="flex items-center gap-1 rounded border px-3 py-2 disabled:opacity-40"
          >
            <StepBack size={16} />
            Prev
          </button>

          <div className="flex items-center gap-4">

            <span className="text-sm text-gray-600">
              {skip + 1} - {skip + list.length}
            </span>

            {multiple && (
              <button
                disabled={!selectedRows.length}
                className="primary-btn"
                onClick={() => {
                  onMultiSelect?.(selectedRows);
                  onClose();
                }}
              >
                Add Selected ({selectedRows.length})
              </button>
            )}

          </div>

          <button
            disabled={list.length < pageSize}
            onClick={() => setSkip(skip + pageSize)}
            className="flex items-center gap-1 rounded border px-3 py-2 disabled:opacity-40"
          >
            Next
            <StepForward size={16} />
          </button>
        </div>

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <div className="rounded-lg bg-white px-6 py-3 shadow">
              <Loader />
            </div>
          </div>
        )}
      </div>
    </Popup>
  );

}