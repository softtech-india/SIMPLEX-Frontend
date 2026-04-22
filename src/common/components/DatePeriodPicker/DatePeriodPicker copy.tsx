'use client';

import { useEffect, useRef, useState } from 'react';
import { DatePeriod, DateRange } from './types';
import { calculateDateRange } from './dateUtils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CustomSelectBox from '../sharedComponents/CustomSelectBox';

interface Props {
  value?: DateRange;
  onChange: (range: DateRange) => void;
}

export default function DatePeriodPicker({ value, onChange }: Props) {
  const defaultRange = calculateDateRange('this_month');

  const [period, setPeriod] = useState<DatePeriod>(
    value?.period ?? 'this_month'
  );

  const [fromDate, setFromDate] = useState<Date>(
    value?.fromDate ?? defaultRange.fromDate
  );

  const [toDate, setToDate] = useState<Date>(
    value?.toDate ?? defaultRange.toDate
  );

  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  /* Sync from parent */
  useEffect(() => {
    if (!value) return;

    setPeriod(value.period ?? 'custom');
    setFromDate(value.fromDate);
    setToDate(value.toDate);
  }, [value]);

  /* Handle outside click */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowCustomPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* Handle predefined period change */
  const handlePeriodChange = (value: DatePeriod) => {
    setPeriod(value);

    if (value !== 'custom') {
      const range = calculateDateRange(value);

      setFromDate(range.fromDate);
      setToDate(range.toDate);
      setShowCustomPicker(false);

      onChange({
        period: value,
        fromDate: range.fromDate,
        toDate: range.toDate,
      });
    } else {
      setShowCustomPicker(true);
    }
  };

  /* Apply custom range */
  const handleApplyCustom = () => {
    onChange({
      period: 'custom',
      fromDate,
      toDate,
    });

    setShowCustomPicker(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">

      {/* Period Select */}
      <CustomSelectBox
        dataSource={[
          { id: 'today', name: 'Today' },
          { id: 'this_week', name: 'This Week' },
          { id: 'this_month', name: 'This Month' },
          { id: 'this_quarter', name: 'This Quarter' },
          { id: 'last_6_months', name: 'Last 6 Months' },
          { id: 'this_year', name: 'This Year' },
          { id: 'custom', name: 'Custom' },
        ]}
        displayExpr="name"
        valueExpr="id"
        value={period}
        onValueChanged={(e: any) =>
          handlePeriodChange(e.value as DatePeriod)
        }
        placeholder="Select Period"
        className="w-full text-sm"
        showclearbutton={false}
      />

      {/* Custom Date Popup */}
      {period === 'custom' && showCustomPicker && (
        <div className="absolute right-0 top-full mt-2 z-30 bg-white border rounded-md shadow-lg p-3 w-72">

          <div className="flex flex-col gap-3">

            {/* From Date */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                From Date
              </label>
              <DatePicker
                selected={fromDate}
                onChange={(date: Date | null) =>
                  date && setFromDate(date)
                }
                className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                dateFormat="dd/MM/yyyy"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                To Date
              </label>
              <DatePicker
                selected={toDate}
                onChange={(date: Date | null) =>
                  date && setToDate(date)
                }
                minDate={fromDate}
                className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                dateFormat="dd/MM/yyyy"
              />
            </div>

            {/* Apply Button */}
            <div className="flex justify-end">
              <button
                onClick={handleApplyCustom}
                className="px-3 py-1 text-xs font-semibold text-white rounded bg-blue-600 hover:bg-blue-700"
              >
                Apply
              </button>
            </div>

          </div>
        </div>
      )}
      
    </div>
  );
}
