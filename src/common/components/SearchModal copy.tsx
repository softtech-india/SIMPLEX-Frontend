import { apiCall } from "@/utils/apiClient";
import notify from "devextreme/ui/notify";
import { useEffect, useRef, useState } from "react";
import Popup, { Position } from "devextreme-react/popup";
import useIsMobile from "@/common/hooks/useIsMobile";

interface Column {
  key: string;
  label: string;
}

interface SearchField {
  value: string;
  label: string;
}

interface SearchModalProps {
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
}

export default function SearchModal({
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
}: SearchModalProps) {
  
  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchBy, setSearchBy] = useState<string>("");

  const isMobile = useIsMobile();

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

  return (
    <Popup
      visible={open}
      onHiding={onClose}
      showTitle
      showCloseButton
      title="Search"
      width={isMobile ? "100%" : 900}
      height={isMobile ? "100%" : 550}
      dragEnabled={!isMobile}
      className="rounded-xl overflow-hidden"
      onShown={() => setTimeout(() => inputRef.current?.focus(), 0)}
    >
      <Position at="center" my="center" of={window} />

      <div className="h-full flex flex-col bg-white">
        {/* HEADER - Search */}
        <div className="sticky top-0 z-10 bg-white border-b px-3 py-3">
          <div className="flex gap-2 items-center">
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
        {/* BODY - Results */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {!isMobile ? (
            /* DESKTOP TABLE */
            <table className="w-full text-sm border-separate border-spacing-0">
              <thead className="sticky top-0 bg-gray-100 z-10">
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
                    key={i}
                    onDoubleClick={() => {
                      onSelect(row);
                      onClose();
                    }}
                    className="bg-white hover:bg-blue-50 cursor-pointer transition border-b"
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
            /* MOBILE CARDS */
            <div className="p-1 space-y-1">
              {list.map((row, i) => (
                <div
                  key={i}
                  onClick={() => {
                    onSelect(row);
                    onClose();
                  }}
                  className="bg-white border border-gray-500 rounded shadow-sm p-1 transition"
                >
                  {columns.map((c, idx) => (
                    <div
                      key={c.key}
                      className={`flex justify-between text-[12px] py-1 ${idx !== columns.length - 1
                        ? "border-b border-gray-100"
                        : ""
                        }`}
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
        {/* FOOTER - Pagination */}
        <div className="shrink-0 flex items-center justify-between px-4 py-3 border-t bg-white text-sm">
          <button
            disabled={skip === 0}
            onClick={() => setSkip(skip - pageSize)}
            className="px-3 py-1 rounded-md border bg-gray-50 hover:bg-gray-100 disabled:opacity-40"
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
            className="px-3 py-1 rounded-md border bg-gray-50 hover:bg-gray-100 disabled:opacity-40"
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