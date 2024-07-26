import { Text } from "@mantine/core";
import { ReactNode } from "react";

interface ToastMessageProps {
  label: string;
  icon?: ReactNode;
  className?: string;
}

export const ToastMessage = ({
  label,
  icon,
  className
}: ToastMessageProps) => {
  return (
    <div
      className={`fixed right-2 bottom-2 py-2 px-3 z-20 bg-white flex items-center justify-center gap-2 rounded-md ` + className}
    >
      {icon}
      <Text
        size='sm'
      >
        {label}
      </Text>
    </div>
  )
}
