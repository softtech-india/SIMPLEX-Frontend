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

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!value) return;

    setPeriod(value.period ?? 'custom');
    setFromDate(value.fromDate);
    setToDate(value.toDate);
  }, [value]);

  useEffect(() => {
    if (isMobile) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsPickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile]);

  const handlePeriodChange = (value: DatePeriod) => {
    if (value === 'custom') {
      const defaultRange = calculateDateRange('this_month');

      setFromDate(defaultRange.fromDate);
      setToDate(defaultRange.toDate);

      setPeriod('custom');
      setIsPickerOpen(true);

      return;
    }

    const range = calculateDateRange(value);

    setPeriod(value);
    setFromDate(range.fromDate);
    setToDate(range.toDate);
    setIsPickerOpen(false);

    onChange({
      period: value,
      fromDate: range.fromDate,
      toDate: range.toDate,
    });
  };


  const handleApplyCustom = () => {
    onChange({
      period: 'custom',
      fromDate,
      toDate,
    });

    setIsPickerOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">

      <CustomSelectBox
        dataSource={[
          { id: 'today', name: 'Today' },
          { id: 'this_week', name: 'This Week' },
          { id: 'this_month', name: 'This Month' },
          { id: 'this_quarter', name: 'This Quarter' },
          { id: 'last_6_months', name: 'Last 6 Months' },
          { id: 'this_year', name: 'This Year' },
          { id: 'financial_year', name: 'This Financial Year' },    
          { id: 'custom', name: 'Custom' },
        ]}
        displayExpr="name"
        valueExpr="id"
        value={period}
        onValueChanged={(e: any) =>
          handlePeriodChange(e.value as DatePeriod)
        }
        onOpened={() => {
          if (period === "custom") {
            setIsPickerOpen(true);
          }
        }}
        placeholder="Select Period"
        className="w-full text-sm"
        showclearbutton={false}
      />

      {!isMobile && isPickerOpen && (
        <div className="absolute left-0 top-full mt-2 z-30 bg-white border rounded-lg shadow-xl p-4 w-[550px]">

          <div className="flex gap-6">

            <div>
              <label className="block text-xs font-medium mb-2">
                From Date
              </label>
              <DatePicker
                selected={fromDate}
                onChange={(date: Date | null) =>
                  date && setFromDate(date)
                }
                inline
                monthsShown={1}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-2">
                To Date
              </label>
              <DatePicker
                selected={toDate}
                onChange={(date: Date | null) =>
                  date && setToDate(date)
                }
                minDate={fromDate}
                inline
                monthsShown={1}
              />
            </div>

          </div>

          <div className="flex justify-end mt-3">
            <button
              onClick={handleApplyCustom}
              className="px-4 py-2 text-sm font-semibold text-white rounded bg-blue-600 hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {isMobile && isPickerOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center px-1">

          <div className="bg-white w-full max-w-xs rounded-lg p-1 shadow overflow-y-scroll">

            <div className="text-center font-semibold text-base mb-1">Select Date Range</div>

            <div className="flex flex-col gap-1">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1"> From</label>
                <input
                  type="date"
                  value={fromDate ? fromDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const newDate = e.target.value ? new Date(e.target.value) : null;
                    if (newDate) setFromDate(newDate);
                  }}
                  className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
 

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1"> To</label>
                <input
                  type="date"
                  value={toDate ? toDate.toISOString().split('T')[0] : ''}
                  min={fromDate ? fromDate.toISOString().split('T')[0] : undefined}
                  onChange={(e) => {
                    const newDate = e.target.value ? new Date(e.target.value) : null;
                    if (newDate) setToDate(newDate);
                  }}
                  className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={handleApplyCustom}
                  className="px-1 py-1 text-sm font-semibold text-white rounded bg-blue-600 hover:bg-blue-700 active:scale-[0.97] transition"
                >
                  Apply
                </button>
                <button
                  onClick={() => setIsPickerOpen(false)}
                  className="px-1 py-1 text-sm font-semibold text-gray-600 rounded border border-gray-300 hover:bg-gray-100 active:scale-[0.97] transition"
                >
                  Cancel
                </button>
              </div>
              

            </div>
          </div>
        </div>
      )}


    </div>
  );
}
