import { apiCall } from "@/utils/apiClient";
import notify from "devextreme/ui/notify";
import { useEffect, useRef, useState } from "react";
import Popup, { Position } from "devextreme-react/popup";
import useIsMobile from "../hooks/useIsMobile";

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

  searchFields?: SearchField[]; // 👈 optional
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
        ...(searchBy && { searchBy }) // 👈 only if dropdown exists
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
      showTitle={true}
      title="Search"
      width={isMobile ? "100%" : 900}
      height={isMobile ? "100%" : 550}
      dragEnabled={!isMobile}
      onShown={() => {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }}
    >
      <Position at="center" my="center" of={window} />

      {/* Search box */}
      <div className="flex gap-2 mb-3">
        {/* Search By Dropdown (only if provided) */}
        {searchFields && searchFields.length > 0 && (
          <select
            className="border p-2"
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

        {/* Search Input */}
        <input
          ref={inputRef}
          className="border p-2 flex-1"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchData(0)}
        />

        <button
          onClick={() => {
            setSkip(0);
            fetchData(0);
          }}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Search
        </button>
      </div>

      <div className="max-h-[400px] overflow-auto border">
        {!isMobile ? (
          // 🖥️ DESKTOP TABLE VIEW
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className="border p-2 text-left">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-blue-100 cursor-pointer"
                  onDoubleClick={() => {
                    onSelect(row);
                    onClose();
                  }}
                >
                  {columns.map((c) => (
                    <td key={c.key} className="border p-2">
                      {row[c.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // 📱 MOBILE CARD VIEW
          <div className="space-y-2 p-2">
            {list.map((row, i) => (
              <div
                key={i}
                className="border rounded-lg p-3 shadow-sm bg-white active:bg-blue-50"
                onClick={() => {
                  onSelect(row);
                  onClose();
                }}
              >
                {columns.map((c) => (
                  <div key={c.key} className="flex justify-between text-sm py-1">
                    <span className="text-gray-500">{c.label}</span>
                    <span className="font-medium text-right">
                      {row[c.key]}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      {/* <div className="max-h-[350px] overflow-auto border">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="border p-2 text-left">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((row, i) => (
              <tr
                key={i}
                className="hover:bg-blue-100 cursor-pointer"
                onDoubleClick={() => {
                  onSelect(row);
                  onClose();
                }}
              >
                {columns.map((c) => (
                  <td key={c.key} className="border p-2">
                    {row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-3">
        <button
          disabled={skip === 0}
          onClick={() => setSkip(skip - pageSize)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          ◀ Prev
        </button>

        <span>
          Showing {skip + 1} - {skip + list.length}
        </span>

        <button
          disabled={list.length < pageSize}
          onClick={() => setSkip(skip + pageSize)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next ▶
        </button>
      </div>

      {loading && <div className="text-center mt-2">Loading...</div>}
    </Popup>
  );
}