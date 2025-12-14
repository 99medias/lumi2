import { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ type, message, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: AlertCircle
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: AlertCircle
    }
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div className={`fixed top-24 right-4 z-50 max-w-md w-full animate-slide-in`}>
      <div className={`${style.bg} border ${style.border} rounded-lg shadow-lg p-4 flex items-start gap-3`}>
        <Icon className={`w-5 h-5 ${style.text} flex-shrink-0 mt-0.5`} />
        <p className={`flex-1 text-sm font-medium ${style.text}`}>{message}</p>
        <button
          onClick={onClose}
          className={`${style.text} hover:opacity-70 transition-opacity`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
