import React from 'react';
import NumberBox from 'devextreme-react/number-box';
import styles from './numberBox.module.css';

export interface CustomNumberBoxProps {
  value?: number;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  min?: number;
  max?: number;
  precision?: number;
  onValueChange: (value: number | undefined) => void;
  label?: string;
  className?: string;
  inputAttr?: React.InputHTMLAttributes<HTMLInputElement>;
  // format: string;
  
}

const CustomNumberBox: React.FC<CustomNumberBoxProps> = ({
  value,
  placeholder = '',
  disabled = false,
  readOnly = false,
  min,
  max,
  precision,
  onValueChange,
  label,
  className = '',
  inputAttr,
  // format,
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <NumberBox
        labelMode="floating"
        label={label}
        value={value ? Number(value) : undefined}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        min={min}
        max={max}
        // format={format}
        showSpinButtons={false}
        onValueChanged={(e) => onValueChange(e.value)}
        inputAttr={inputAttr} // <-- input attributes like numeric, maxLength
        // className={styles.numberBox}
      />
    </div>
  );
};

export default CustomNumberBox;
