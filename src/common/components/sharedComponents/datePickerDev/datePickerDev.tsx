import React from "react";
import DateBox from "devextreme-react/date-box";
import styles from "./datePickerDev.module.css";
import type { DatePickerDevProps } from "./datePickerDev.model";

const DatePickerDev: React.FC<DatePickerDevProps> = ({
  label,
  value,
  onValueChange,
  placeholder = "Select Date",
  disabled = false,
  width = "100%",
  min,
  max,
  displayFormat = "dd/MM/yyyy",
  type = "date",

}) => {
  return (
    <div className={styles.datePickerContainer}>
      {/* {label && <label className={styles.label}>{label}</label>} */}

      <DateBox
        // type="date"
        type={type}
        labelMode={"floating"}
        label={label}
        value={value ?? undefined}              //  ensures type safety
        // onValueChanged={(e) => onValueChange(e.value as Date | undefined)} 
        onValueChanged={(e) => onValueChange(e.value as Date)}
        placeholder={placeholder}
        disabled={disabled}
        width={width}
        min={min}
        max={max}
        displayFormat={displayFormat}
        className={styles.dateBox}
        useMaskBehavior={true}
        openOnFieldClick={true}        
      />
    </div>
  );
};

export default DatePickerDev;
