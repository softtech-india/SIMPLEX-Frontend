import React from "react";
import { FilterBuilder } from "devextreme-react/filter-builder";

export interface FilterField {
  dataField: string;
  dataType: "string" | "number" | "date" | "boolean" | "datetime";
  caption?: string;
}

interface CustomFilterBuilderProps {
  fields: FilterField[];
  value: any;
  onValueChanged: (value: any) => void;
  height?: number | string;
  width?: number | string;
  disabled?: boolean;
}

const CustomFilterBuilder: React.FC<CustomFilterBuilderProps> = ({
  fields,
  value,
  onValueChanged,
  height = "100%",
  width = "100%",
  disabled = false,
}) => {
  return (
    <div className="flex flex-col h-full w-full bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="px-4 py-2 border-b bg-gray-50 rounded-t-lg">
        <h3 className="text-sm font-semibold text-gray-700">
          Build Filters
        </h3>
      </div>

      {/* Filter Builder Body */}
      <div className="flex-1 p-3 overflow-auto">
        <FilterBuilder
          fields={fields}
          value={value}
          onValueChanged={(e: any) => onValueChanged(e.value)}
          height={height}
          width={width}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default CustomFilterBuilder;
