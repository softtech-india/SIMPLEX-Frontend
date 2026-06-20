import { apiCall } from "@/utils/apiClient";
import notify from "devextreme/ui/notify";
import { useEffect, useRef, useState } from "react";
import Popup, { Position } from "devextreme-react/popup";
import useIsMobile from "@/common/hooks/useIsMobile";
import { useRouter } from "next/router";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { SHORTCUTS } from "../constants/shortcuts";

interface Column {
  key: string;
  label: string;
}

interface SearchField {
  value: string;
  label: string;
}

interface CreateNewConfig {
  enabled?: boolean;
  label?: string;
  onCreateNew?: () => void;
}

interface SearchModalProps {
  title?: string;
  open: boolean;
  onClose: () => void;
  endpoint: string;
  baseParams: Record<string, any>;
  columns: Column[];
  onSelect: (row: any) => void;
  pageSize?: number;

  searchFields?: SearchField[];
  createNewConfig?: CreateNewConfig;

  excludeIds?: number[];
  currentId?: number;
}

export default function SearchModal({
  title,
  open,
  onClose,
  endpoint,
  baseParams,
  columns,
  onSelect,
  pageSize = 50,
  searchFields,
  createNewConfig,
  excludeIds,
  currentId,
}: SearchModalProps) {

  const router = useRouter();
  const isMobile = useIsMobile();

  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchBy, setSearchBy] = useState<string>("");

  const tableRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  useEffect(() => {
    rowRefs.current[selectedIndex]?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [selectedIndex]);

  // Auto format ISO date strings
  const formatDatesInObject = (obj: any) => {
    const formatted: any = {};

    Object.keys(obj).forEach((key) => {
      const value = obj[key];

      // Detect ISO date strings like 2026-05-21T00:00:00
      if (
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
      ) {
        formatted[key] = value.split("T")[0];
      } else {
        formatted[key] = value;
      }
    });

    return formatted;
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [list]);

  // useEffect(() => {
  //   rowRefs.current[selectedIndex]?.scrollIntoView({
  //     block: "nearest",
  //   });
  // }, [selectedIndex]);

  useEffect(() => {
    if (open) {
      setSearch("");
      setSkip(0);

      if (searchFields && searchFields.length > 0) {
        setSearchBy(searchFields[0].value);
      }

      fetchData(0);
    }
  }, [open]);


  useEffect(() => {
    if (!open) return;

    const delayDebounce = setTimeout(() => {
      setSkip(0);
      fetchData(0);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const fetchData = (skipVal: number) => {
    setLoading(true);

    apiCall
      .get(process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT + endpoint, {
        take: pageSize,
        skip: skipVal,
        ...baseParams,
        Searchtext: search,
        ...(searchBy && { searchBy })
      })
      .then((response: any) => {
        if (response?.error) {
          notify(response.error, "error", 3000);
          setLoading(false);
          return;
        }

        // Format all ISO date fields automatically
        const rawData = (response.data || []).map((row: any) =>
          formatDatesInObject(row)
        );

        const filteredData = rawData.filter((row: any) => {
          const rowId = row.id ?? row.productid;

          if (excludeIds?.includes(rowId)) {
            return false;
          }

          return true;
        });

        setList(filteredData);

        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        notify(String(e), "error", 3000);
        setLoading(false);
      });
  };

  const titleName = `Search ${title || ''}`

  return (
    <Popup
      visible={open}
      onHiding={onClose}
      showTitle
      showCloseButton
      title={titleName}
      width={isMobile ? "100%" : 900}
      height={isMobile ? "100%" : 550}
      dragEnabled={!isMobile}
      className="rounded-xl overflow-hidden"
      // onShown={() => {
      //   setTimeout(() => {
      //     containerRef.current?.focus();
      //   }, 0);
      // }}
      onShown={() => setTimeout(() => tableRef.current?.focus(), 50)}
    >
      <Position at="center" my="center" of={window} />

      {/* KEYBOARD WRAPPER  */}
      <div
        ref={tableRef}
        tabIndex={0}
        className="h-full flex flex-col bg-white outline-none overflow-hidden"
        onKeyDown={(e) => {
          if (!list.length) return;

          switch (e.key) {
            case "ArrowDown":
              e.preventDefault();
              setSelectedIndex((prev) =>
                Math.min(prev + 1, list.length - 1)
              );
              break;

            case "ArrowUp":
              e.preventDefault();
              setSelectedIndex((prev) =>
                Math.max(prev - 1, 0)
              );
              break;

            case "PageDown":
              e.preventDefault();
              if (list.length === pageSize) {
                setSkip((prev) => prev + pageSize);
              }
              break;

            case "PageUp":
              e.preventDefault();
              if (skip > 0) {
                setSkip((prev) => Math.max(0, prev - pageSize));
              }
              break;

            case "Enter":
              e.preventDefault();
              const row = list[selectedIndex];
              if (row) {
                onSelect(row);
                onClose();
              }
              break;

            case "Escape":
              onClose();
              break;
          }
        }}
      >
        {/* HEADER */}
        <div className="shrink-0 border-b px-3 py-3 bg-white">
          <div className="flex gap-2 items-center">

            {createNewConfig?.enabled && (
              <button
                className="primary-btn"
                onClick={() => {
                  // onClose();
                  createNewConfig?.onCreateNew?.();
                }}
              >
                {createNewConfig.label || "Create New"}
              </button>
            )}

            {searchFields && searchFields.length > 0 && (
              <select
                className="border border-gray-300 rounded-md px-2 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-400"
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
              >
                {searchFields.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            )}

            <input
              ref={inputRef}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Search records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchData(0)}
            />

            <button
              onClick={() => {
                setSkip(0);
                fetchData(0);
              }}
              className="primary-btn"
            >
              Search
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {!isMobile ? (
            <table className="w-full text-sm border-separate border-spacing-0">
              <thead className="sticky top-0 z-10 bg-gray-100">
                <tr>
                  {columns.map((c) => (
                    <th
                      key={c.key}
                      className="text-left px-3 py-2 text-gray-600 font-medium border-b"
                    >
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {list.map((row, i) => (
                  <tr
                    ref={(el) => {
                      rowRefs.current[i] = el;
                    }}
                    key={i}
                    onClick={() => setSelectedIndex(i)}
                    onDoubleClick={() => {
                      onSelect(row);
                      onClose();
                    }}
                    className={
                      i === selectedIndex ? "bg-blue-100 cursor-pointer border-b" : "bg-white hover:bg-blue-50 cursor-pointer border-b"
                    }
                  >
                    {columns.map((c) => (
                      <td key={c.key} className="px-3 py-2 text-gray-700">
                        {row[c.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-1 space-y-1">
              {list.map((row, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedIndex(i);
                    onSelect(row);
                    onClose();
                  }}
                  className={`
                    border rounded shadow-sm p-1 cursor-pointer transition
                    ${i === selectedIndex ? "bg-blue-100 border-blue-400" : "bg-white border-gray-500 hover:bg-blue-50"}
                  `}
                >
                  {columns.map((c, idx) => (
                    <div
                      key={c.key}
                      className={`flex justify-between text-[12px] py-1 
                        ${idx !== columns.length - 1 ? "border-b border-gray-100" : ""}
                      `}
                    >
                      <span className="text-gray-500">{c.label}</span>
                      <span className="text-color max-w-[60%] text-right">
                        {row[c.key]}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="shrink-0 flex items-center justify-between px-4 py-3 border-t bg-white text-sm">
          <button
            disabled={skip === 0}
            onClick={() => setSkip(skip - pageSize)}
            className="px-3 py-1 rounded-md border bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
          >
            ◀ Prev
          </button>

          <span className="text-gray-600">
            Showing{" "}
            <span className="font-medium">{skip + 1}</span> -{" "}
            <span className="font-medium">{skip + list.length}</span>
          </span>

          <button
            disabled={list.length < pageSize}
            onClick={() => setSkip(skip + pageSize)}
            className="px-3 py-1 rounded-md border bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
          >
            Next ▶
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="absolute bottom-2 left-0 right-0 text-center text-sm text-gray-500">
          Loading...
        </div>
      )}
    </Popup>
  );


}