import React, { ReactNode } from 'react';

interface InlineSelectFieldProps {
  label: string;
  children: ReactNode;
}

const InlineSelectField: React.FC<InlineSelectFieldProps> = ({ label, children }) => (
  <div className="flex items-center gap-3 px-1 py-1 rounded-md border bg-gray-100">
    <span
      className="text-sm font-medium whitespace-nowrap"
      style={{ color: "var(--secondary-button-text)" }}
    >
      {label}
    </span>
    <div className="relative flex-1">
      {children}
    </div>
  </div>
);

export default InlineSelectField;
