import React from "react";
import { SelectBox } from "devextreme-react/select-box";

export interface CustomSelectBoxProps {
  dataSource: any[];
  displayExpr: string;
  valueExpr: string;
  value: any;
  onValueChanged: (value: any) => void;
  placeholder?: string;
  label?: string;
  labelMode?: "static" | "floating" | "hidden";
  width?: number | string;
  disabled?: boolean;
  className?: string;
  showclearbutton?: boolean;
}

const CustomSelectBox: React.FC<CustomSelectBoxProps> = ({
  dataSource,
  displayExpr,
  valueExpr,
  value,
  onValueChanged,
  placeholder = "Select an option",
  label,
  labelMode = "floating",
  width = "100%",
  disabled = false,
  className = "",
  showclearbutton = false,
}) => {
  return (
    <SelectBox
      dataSource={dataSource}
      displayExpr={displayExpr}
      valueExpr={valueExpr}
      value={value}
      onValueChanged={onValueChanged}
      placeholder={placeholder}
      label={label}
      labelMode={labelMode}
      width={width}
      disabled={disabled}
      className={className}
      showClearButton={showclearbutton}
    />
  );
};

export default CustomSelectBox;
