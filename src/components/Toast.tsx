import { useEffect } from "react";
import { CheckCircle2, X, AlertCircle } from "lucide-react";

interface ToastProps {
  message: string;
  description?: string;
  tone?: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  description,
  tone = "success",
  onClose,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={"toast toast-" + tone} role="status">
      <span className="toast-icon">
        {tone === "success" ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />}
      </span>
      <div className="toast-body">
        <strong>{message}</strong>
        {description && <p>{description}</p>}
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Yopish">
        <X size={16} />
      </button>
    </div>
  );
}
