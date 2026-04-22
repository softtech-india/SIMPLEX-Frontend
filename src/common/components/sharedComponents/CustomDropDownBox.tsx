import React from "react";
import DropDownBox from "devextreme-react/drop-down-box";
import DataGrid, { Column, Selection } from "devextreme-react/data-grid";
import styles from "./dropDownBox.module.css";
import { DropDownBoxProps } from "./dropDownBox/dropDownBox.model";
// import type { DropDownBoxProps } from "./dropDownBox.model";

const CustomDropDownBox: React.FC<DropDownBoxProps> = ({
  label,
  dataSource,   // use dataSource instead of options
  value,
  placeholder = "Select...",
  disabled = false,
  onChange,
  width = "100%",
}) => {
  const [currentValue, setCurrentValue] = React.useState<string | number | null>(value);

  React.useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleSelectionChanged = (e: any) => {
    const selected = e.selectedRowKeys[0] ?? null;
    setCurrentValue(selected);
    onChange(selected);
  };

  const handleValueChanged = (e: any) => {
    if (e.value === null) {
      setCurrentValue(null);
      onChange(null);
    }
  };

  const contentRender = () => (
    <DataGrid
      dataSource={dataSource}   // ✅ pass CustomStore directly
      keyExpr="prodcode"
      showBorders={true}
      hoverStateEnabled={true}
      selectedRowKeys={currentValue ? [currentValue] : []}
      onSelectionChanged={handleSelectionChanged}
      height={250}
    >
      <Selection mode="single" />
      <Column dataField="prodcode" caption="Code" />
      <Column dataField="prodname" caption="Name" />
    </DataGrid>
  );

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <DropDownBox
        value={currentValue}
        valueExpr="prodcode"
        displayExpr={(item: any) =>
          item ? `${item.prodcode} - ${item.prodname}` : ""
        }
        placeholder={placeholder}
        disabled={disabled}
        width={width}
        showClearButton={true}
        contentRender={contentRender}
        onValueChanged={handleValueChanged}
        className={styles.dropdown}
      />
    </div>
  );
};

export default CustomDropDownBox;
