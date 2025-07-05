import React from "react";

interface ActionButtonProps {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  title,
  children,
  className = "",
}) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-md transition-colors duration-200 border ${className}`}
    title={title}
    type="button"
  >
    {children}
  </button>
);

export default ActionButton;