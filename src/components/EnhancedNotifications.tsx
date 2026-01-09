import React from "react";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
  X,
} from "lucide-react";
import { toast as sonnerToast } from "sonner";

export type NotificationType = "success" | "error" | "warning" | "info" | "loading";

interface EnhancedToastOptions {
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const getToastConfig = (type: NotificationType) => {
  const configs = {
    success: {
      icon: <CheckCircle2 className="text-green-500" />,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      textColor: "text-green-800 dark:text-green-200",
    },
    error: {
      icon: <AlertCircle className="text-red-500" />,
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      textColor: "text-red-800 dark:text-red-200",
    },
    warning: {
      icon: <AlertTriangle className="text-yellow-500" />,
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      textColor: "text-yellow-800 dark:text-yellow-200",
    },
    info: {
      icon: <Info className="text-blue-500" />,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      textColor: "text-blue-800 dark:text-blue-200",
    },
    loading: {
      icon: <Loader2 className="text-blue-500 animate-spin" />,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      textColor: "text-blue-800 dark:text-blue-200",
    },
  };
  return configs[type];
};

export const notifySuccess = (message: string, title?: string, duration?: number) => {
  const config = getToastConfig("success");
  sonnerToast.custom(
    () => (
      <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 flex items-start gap-3 max-w-md`}>
        {config.icon}
        <div className="flex-1">
          {title && <p className="font-semibold text-sm">{title}</p>}
          <p className={`text-sm ${title ? "mt-1" : ""}`}>{message}</p>
        </div>
      </div>
    ),
    { duration: duration || 4000 }
  );
};

export const notifyError = (message: string, title?: string, duration?: number) => {
  const config = getToastConfig("error");
  sonnerToast.custom(
    () => (
      <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 flex items-start gap-3 max-w-md`}>
        {config.icon}
        <div className="flex-1">
          {title && <p className="font-semibold text-sm">{title}</p>}
          <p className={`text-sm ${title ? "mt-1" : ""}`}>{message}</p>
        </div>
      </div>
    ),
    { duration: duration || 5000 }
  );
};

export const notifyWarning = (message: string, title?: string, duration?: number) => {
  const config = getToastConfig("warning");
  sonnerToast.custom(
    () => (
      <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 flex items-start gap-3 max-w-md`}>
        {config.icon}
        <div className="flex-1">
          {title && <p className="font-semibold text-sm">{title}</p>}
          <p className={`text-sm ${title ? "mt-1" : ""}`}>{message}</p>
        </div>
      </div>
    ),
    { duration: duration || 4000 }
  );
};

export const notifyInfo = (message: string, title?: string, duration?: number) => {
  const config = getToastConfig("info");
  sonnerToast.custom(
    () => (
      <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 flex items-start gap-3 max-w-md`}>
        {config.icon}
        <div className="flex-1">
          {title && <p className="font-semibold text-sm">{title}</p>}
          <p className={`text-sm ${title ? "mt-1" : ""}`}>{message}</p>
        </div>
      </div>
    ),
    { duration: duration || 4000 }
  );
};

export const notifyLoading = (message: string, title?: string) => {
  const config = getToastConfig("loading");
  sonnerToast.custom(
    () => (
      <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 flex items-start gap-3 max-w-md`}>
        {config.icon}
        <div className="flex-1">
          {title && <p className="font-semibold text-sm">{title}</p>}
          <p className={`text-sm ${title ? "mt-1" : ""}`}>{message}</p>
        </div>
      </div>
    ),
    { duration: Infinity }
  );
};

export const notifyWithAction = (options: EnhancedToastOptions) => {
  const config = getToastConfig(options.type);
  sonnerToast.custom(
    () => (
      <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 flex items-start gap-3 max-w-md`}>
        {config.icon}
        <div className="flex-1">
          {options.title && <p className="font-semibold text-sm">{options.title}</p>}
          <p className={`text-sm ${options.title ? "mt-1" : ""}`}>{options.message}</p>
        </div>
        {options.action && (
          <button
            onClick={options.action.onClick}
            className="text-sm font-semibold underline hover:opacity-70 transition-opacity flex-shrink-0"
          >
            {options.action.label}
          </button>
        )}
      </div>
    ),
    { duration: options.duration || 4000 }
  );
};
