"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      richColors
      closeButton
      position="top-right"
      style={{ zIndex: 99999 }}
      toastOptions={{
        style: {
          fontSize: "14px",
          borderRadius: "8px",
          padding: "12px 16px",
          boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)",
        },
      }}
      {...props}
    />
  );
}

export { toast } from "sonner";
