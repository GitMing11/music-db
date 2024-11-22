// app/components/Toast.tsx
import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  duration?: number; // 알림 표시 시간 (기본 3000ms)
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        fontSize: "16px",
      }}
    >
      {message}
    </div>
  );
};

export default Toast;
