import React from "react";

interface MenuItemProps {
  icon?: React.ElementType;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon: Icon,
  children,
  onClick,
  disabled = false,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={handleClick}
      className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-left transition
        ${disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-gray-100"
        }`}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
};
