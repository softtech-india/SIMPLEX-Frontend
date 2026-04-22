import React from 'react';
import TextBox from 'devextreme-react/text-box';
import styles from './textBox.module.css';
import { CustomTextBoxProps } from './textbox.model';

const CustomTextBox: React.FC<CustomTextBoxProps> = ({
  value = '',
  placeholder = '',
  disabled = false,
  readOnly = false,
  onValueChange,
  label,
  className = '',
  inputAttr = {},
  mode,
  inputRef,  
  type,  

}) => {

  // helper to read numeric settings from inputAttr safely
  const getInputAttr = <T extends keyof any>(key: string) => {
    try {
      // inputAttr could be DOM attributes object or something else - coerce safely
      return (inputAttr as any)[key];
    } catch {
      return undefined;
    }
  };

  const isNumericMode = () => {
    const im = getInputAttr('inputMode') || getInputAttr('inputmode');
    const pattern = getInputAttr('pattern');
    return im === 'numeric' || (typeof pattern === 'string' && /\d/.test(pattern));
  };

  const maxLen = (() => {
    const m = getInputAttr('maxLength') ?? getInputAttr('maxlength');
    // may come as string from props
    return m ? Number(m) : undefined;
  })();

  const sanitize = (raw: any) => {
    const s = raw == null ? '' : String(raw);
    if (!isNumericMode()) {
      // if not numeric mode just enforce maxLength if present
      return maxLen ? s.slice(0, maxLen) : s;
    }
    // remove non-digits and enforce max length
    const onlyDigits = s.replace(/\D/g, '');
    return maxLen ? onlyDigits.slice(0, maxLen) : onlyDigits;
  };

  const handleValueChanged = (e: any) => {
    // DevExtreme TextBox passes event; e.value is the new value
    const raw = e?.value ?? e;
    const cleaned = sanitize(raw);
    // If consumer expects undefined for empty string, keep that behavior
    onValueChange?.(cleaned === '' ? undefined : cleaned);
  };

  const handleKeyDown = (e: any) => {
    // DevExtreme provides the native event under e.event
    const nativeEvent = e?.event ?? e;
    if (!isNumericMode() || !nativeEvent) return;

    const key = nativeEvent.key;
    // allow navigation and editing keys
    const allowed = [
      'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'
    ];
    // allow copy/paste (Ctrl/Cmd + C/V/X/A)
    if (nativeEvent.ctrlKey || nativeEvent.metaKey) return;

    if (!/^[0-9]$/.test(key) && !allowed.includes(key)) {
      nativeEvent.preventDefault();
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <TextBox
        ref={inputRef}
        labelMode="floating"
        label={label}
        value={value ?? ''}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        mode={mode}
        inputAttr={inputAttr}
        onValueChanged={handleValueChanged}
        onKeyDown={handleKeyDown}
        className={styles.textBox}

      />
    </div>
  );
};

export default CustomTextBox;
