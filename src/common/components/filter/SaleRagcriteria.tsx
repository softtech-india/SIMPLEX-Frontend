import React, { useState, useRef, useEffect, useCallback } from "react";
import LoadPanel from "devextreme-react/load-panel";
import { isEmpty, filter } from "lodash";
import { useRouter } from "next/router";
import useReportStore from "../../../store/useReportStore";
import DatePeriodPicker from "@/common/components/DatePeriodPicker/DatePeriodPicker";
import { DateRange } from "@/common/components/DatePeriodPicker/types";
import InlineSelectField from "@/common/components/InlineSelectField";
import CustomSelectBox from "../sharedComponents/CustomSelectBox";
import { filterorderType } from "@/common/utility/data";

interface GpReportCriteriaProps {
  onShow?: () => void;
  onCancel: () => void;
}

const DealerLedgerCriteria: React.FC<GpReportCriteriaProps> = ({ onShow, onCancel }) => {
  const {
    saleRegCriteria,
    setSaleRegCriteria,
    resetSaleRegCriteria,
  } = useReportStore();

  // Local state to prevent immediate store updates
  const [localCriteria, setLocalCriteria] = useState({
    period: saleRegCriteria.period,
    startdt: saleRegCriteria.startdt,
    enddt: saleRegCriteria.enddt,
    status: saleRegCriteria.status,
  });
  
  const [loader, setLoader] = useState(false);
  const [privilege, setPrivilege] = useState<any>({});
  const router = useRouter();
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rawPrivilege = localStorage.getItem("userPriviledge");
    if (!rawPrivilege) return;

    const userPrivilege = JSON.parse(rawPrivilege);
    const itemPrivilege = filter(userPrivilege.rawPriviledges, (e) => e.path === router.asPath);

    if (!isEmpty(itemPrivilege)) {
      setPrivilege(itemPrivilege[0]);
    }
  }, [router.asPath]);

  // Initialize local criteria when popup opens
  useEffect(() => {
    setLocalCriteria({
      period: saleRegCriteria.period,
      startdt: saleRegCriteria.startdt,
      enddt: saleRegCriteria.enddt,
      status: saleRegCriteria.status,
    });
  }, [saleRegCriteria]);

  const handleClear = useCallback(() => {
    resetSaleRegCriteria();
    // Update local criteria after reset
    setLocalCriteria({
      period: saleRegCriteria.period,
      startdt: saleRegCriteria.startdt,
      enddt: saleRegCriteria.enddt,
      status: saleRegCriteria.status,
    });
  }, [resetSaleRegCriteria, saleRegCriteria]);

  const handleShow = useCallback(() => {
    // Update store with local criteria when Show is clicked
    setSaleRegCriteria({
      ...saleRegCriteria,
      period: localCriteria.period,
      startdt: localCriteria.startdt,
      enddt: localCriteria.enddt,
      status: localCriteria.status,
    });
    
    setLoader(true);
    // Small delay to show loader
    setTimeout(() => {
      setLoader(false);
      if (onShow) onShow();
    }, 300);
  }, [onShow, setSaleRegCriteria, saleRegCriteria, localCriteria]);

  const handleDateChange = useCallback(
    (range: DateRange) => {
      // Update local state only
      setLocalCriteria({
        ...localCriteria,
        period: range.period,
        startdt: range.fromDate,
        enddt: range.toDate,
      });
    },
    [localCriteria]
  );

  const handleStatusChange = useCallback(
    (e: any) => {
      // Update local state only
      setLocalCriteria({
        ...localCriteria,
        status: e.value,
      });
    },
    [localCriteria]
  );

  return (
    <div
      ref={componentRef}
      className="p-4 space-y-4 bg-white rounded shadow-md max-h-screen overflow-y-auto"
    >
      <InlineSelectField label="Date Range">
        <DatePeriodPicker
          value={{
            period: localCriteria.period,
            fromDate: localCriteria.startdt,
            toDate: localCriteria.enddt,
          }}
          onChange={handleDateChange}
        />
      </InlineSelectField>

      <InlineSelectField label="Order Status">
        <CustomSelectBox
          dataSource={filterorderType}
          displayExpr="name"
          valueExpr="id"
          value={localCriteria.status}
          onValueChanged={handleStatusChange}
          placeholder="Select"
          className="w-full text-sm bg-transparent"
        />
      </InlineSelectField>

      <div className="flex flex-wrap gap-3 justify-center mt-1">
        <button
          type="button"
          onClick={handleShow}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded transition"
        >
          <span>Show</span>
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          <span>Clear</span>
        </button>
      </div>

      {/* Loader */}
      <LoadPanel shadingColor="rgba(0,0,0,0.4)" visible={loader} showIndicator />
    </div>
  );
};

export default DealerLedgerCriteria;