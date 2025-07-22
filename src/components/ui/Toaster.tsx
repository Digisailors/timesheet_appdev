"use client";
import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          success: 'bg-green-500 text-white border-none',
          error: 'bg-red-500 text-white border-none',
        },
        style: {
          background: 'var(--success-bg)',
          color: 'var(--success-text)',
          border: 'none',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
